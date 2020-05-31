import React, {useState, useCallback} from 'react';
import {
  Banner,
  Button,
  Loading,
  Stack,
  TextStyle,
} from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { Query, Mutation } from 'react-apollo';
import { LocalClient } from '../../LocalClient';
import Editable from '../common/Editable';
import { 
  BOX_UPDATE_NAME,
  BOX_UPDATE_PRODUCTGID,
  FRAGMENT_BOX_NAME,
  FRAGMENT_BOX_PRODUCTGID,
  GET_SHOPIFY_PRODUCT,
} from './queries';
import gql from 'graphql-tag';

export default function BoxTitle({ box }) {

  const [pickerActive, setPickerActive] = useState(false);

  const handleResourcePickerClose = useCallback(() => setPickerActive(false), []);
  const toggleResourcePicker = useCallback(() => setPickerActive(!pickerActive), [pickerActive]);

  const updateCacheAfterNameChange = (cache, { data }) => {
    const { name } = data.boxUpdateName;

    const id = `Box:${box.id}`;
    const fragment = FRAGMENT_BOX_NAME;
    const fragmentName = 'boxName';

    data = cache.readFragment({ id, fragment, fragmentName });
    data = { name };

    cache.writeFragment({ id, fragment, fragmentName, data });
  };

  const updateCacheAfterProductChange = (cache, { data }) => {
    const { storeProductId } = data.boxUpdateProductGid;

    const id = `Box:${box.id}`;
    const fragment = FRAGMENT_BOX_PRODUCTGID;
    const fragmentName = 'boxProductGid';

    data = cache.readFragment({ id, fragment, fragmentName });
    console.log('updating data', data);
    console.log('with data', storeProductId);
    data = { storeProductId };

    cache.writeFragment({ id, fragment, fragmentName, data });
  };

  return (
    <Stack>
      <TextStyle
        variation="strong"
      >
        <div
          style={{ color: "#5cb85c" }}
        >
          {'[' + new Date(parseInt(box.delivered)).toDateString() + '] '}
        </div>
      </TextStyle>
      <Editable 
        name={box.name}
        id={box.id}
        mutation={BOX_UPDATE_NAME}
        update={updateCacheAfterNameChange}
        textStyle="strong"
      />
      <Mutation
        client={LocalClient}
        mutation={BOX_UPDATE_PRODUCTGID}
        update={updateCacheAfterProductChange}
      >
        {(handleProductChange, { loading, error, data }) => {
          if (loading) { return <Loading />; }

          if (error) { return (
            <Banner status="critical">{error.message}</Banner>
          )}

          const handleResourceSelection = ({ selection }) => {
            handleResourcePickerClose();
            const input = { 
              id: parseInt(box.id),
              storeProductId: selection[0].id
            };
            handleProductChange({ variables: { input } })
          };

          return (
            <React.Fragment>
              <ResourcePicker
                resourceType="Product"
                open={pickerActive}
                allowMultiple={false}
                onSelection={handleResourceSelection}
                onCancel={handleResourcePickerClose}
              />
              <Query query={GET_SHOPIFY_PRODUCT} variables={{ id: box.storeProductId }}>
                {({ loading, error, data }) => {
                  if (loading) { return <Loading />; }
                  if (error) { return (
                    <Banner status="critical">{error.message}</Banner>
                  )}

                  const { product } = data;
                  return (
                    <div
                      onClick={toggleResourcePicker}
                    >
                      { box.storeProductId === "" ? 
                        <TextStyle variation="strong">Set store product</TextStyle>
                      :
                        <TextStyle variation="subdued">{product.title}</TextStyle>
                      }
                    </div>
                  )
                }}
              </Query>
            </React.Fragment>
          );
        }}
      </Mutation>
    </Stack>
  );
}
