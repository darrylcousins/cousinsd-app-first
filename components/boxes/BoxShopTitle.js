import React, {useState, useCallback} from 'react';
import {
  Banner,
  Button,
  InlineError,
  Loading,
  Spinner,
  TextStyle,
} from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { Mutation } from 'react-apollo';
import { LocalApolloClient } from '../../graphql/local-client';
import { UPDATE_BOX } from './queries';

export default function BoxShopTitle({ id, title }) {

  const [value, setValue] = useState(title);
  const [pickerActive, setPickerActive] = useState(false);

  const handleResourcePickerClose = useCallback(() => setPickerActive(false), []);
  const toggleResourcePicker = useCallback(() => setPickerActive(!pickerActive), [pickerActive]);

  return (
    <Mutation
      client={LocalApolloClient}
      mutation={UPDATE_BOX}
    >
      {(handleUpdate, { loading, error, data }) => {
        if (loading) { 
          return (
            <React.Fragment>
              <Loading />
              <Spinner size='small' />
            </React.Fragment>
          );
        }

        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleResourceSelection = ({ selection }) => {
          handleResourcePickerClose();
          const storeProduct = selection[0];
          const input = { 
            id: parseInt(id),
            shopify_gid: storeProduct.id,
            shopify_title: storeProduct.title,
            shopify_id: parseInt(storeProduct.id.split('/')[4]),
            handle: storeProduct.handle,
          };
          handleUpdate({ variables: { input } })
            .then((value) => {
              setValue(storeProduct.title);
            })
        };

        return (
          <React.Fragment>
            <Button
              plain
              fullWidth
              onClick={toggleResourcePicker}
              disclosure={!pickerActive ? 'down' : 'up'}
            >
              <TextStyle variation="subdued">{value}</TextStyle>
            </Button>
            <ResourcePicker
              resourceType="Product"
              open={pickerActive}
              allowMultiple={false}
              showHidden={false}
              onSelection={handleResourceSelection}
              onCancel={handleResourcePickerClose}
            />
          </React.Fragment>
        );
      }}
    </Mutation>
  );

  }


