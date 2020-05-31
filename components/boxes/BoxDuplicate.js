import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  Loading,
  Stack,
  TextField,
  DatePicker,
} from '@shopify/polaris';
import { Query, Mutation } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { LocalClient } from '../../LocalClient';
import { dateToISOString } from '../../lib';
import BoxSelectDate from './BoxSelectDate';
import BoxSelectName from './BoxSelectName';
import BoxSelectProduct from './BoxSelectProduct';
import { 
  DUPLICATE_BOX, 
  GET_BOXES,
  GET_SELECTED_DATE,
  GET_SHOPIFY_PRODUCT,
} from './queries';

export default function BoxDuplicate({ box, onComplete }) {

  const shopId = SHOP_ID;

  const [name, setName] = useState(box.name);
  const [selectedDate, setSelectedDate] = useState(new Date(parseInt(box.delivered)));
  const [storeProduct, setStoreProduct] = useState({ id: box.storeProductId });
  const [storeProductId, setStoreProductId] = useState(storeProduct.id);

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalClient });
  const delivered = data && data.selectedDate ? data.selectedDate : dateToISOString(new Date());

  const updateCacheAfterAdd = (cache, { data }) => {
    const variables = { shopId, delivered };
    const query = GET_BOXES;
    const box = data.duplicateBox;

    const getBoxes = cache.readQuery({ query, variables }).getBoxes.concat([box]);
    data = { getBoxes };

    cache.writeQuery({ query, variables, data });
  }

  return (
    <Mutation
      client={LocalClient}
      mutation={DUPLICATE_BOX}
      update={updateCacheAfterAdd}
    >
      {(duplicateBox, { loading, error, data }) => {
        if (loading) { return <Loading />; }
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleBoxAdd = () => {
          const tempDate = selectedDate;
          tempDate.setDate(selectedDate.getDate() + 1); // correct for unfound day descrepency
          const delivered = dateToISOString(tempDate);
          const boxId = parseInt(box.id);
          const storeProductId = storeProduct.id;
          const input = { boxId, shopId, name, delivered, storeProductId };
          console.log('duplicate input', input);
          duplicateBox({ variables: { input } }).then((value) => {
            onComplete();
          }).catch((error) => {
            console.log('error', error);
          });
        }

        return (
          <Stack vertical>
            <BoxSelectName name={name} onSelect={setName} />
            <Query query={GET_SHOPIFY_PRODUCT} variables={{ id: storeProductId }}>
              {({ loading, error, data }) => {
                if (loading) { return <Loading />; }
                if (error) { return (
                  <Banner status="critical">{error.message}</Banner>
                )}

                const { product } = data;
                return (
                  <BoxSelectProduct product={product} onSelect={setStoreProduct} />
                )
              }}
            </Query>
            <BoxSelectDate date={selectedDate} onSelect={setSelectedDate} />
            <ButtonGroup
              segmented
              fullWidth
            >
              <Button
                primary
                onClick={handleBoxAdd}
              >
                Save
              </Button>
              <Button
                onClick={onComplete}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </Stack>
        );
      }}
    </Mutation>
  );
}

