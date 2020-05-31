import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Loading,
  Stack,
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { LocalClient } from '../../LocalClient';
import { dateToISOString } from '../../lib';
import BoxSelectDate from './BoxSelectDate';
import BoxSelectName from './BoxSelectName';
import BoxSelectProduct from './BoxSelectProduct';
import { 
  CREATE_BOX, 
  GET_BOXES,
  GET_SELECTED_DATE,
} from './queries';

export default function BoxAdd({ onComplete }) {

  const shopId = SHOP_ID;

  const [storeProduct, setStoreProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState('');

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalClient });
  const delivered = data && data.selectedDate ? data.selectedDate : dateToISOString(new Date());

  const updateCacheAfterAdd = (cache, { data }) => {
    const variables = { shopId, delivered };
    const query = GET_BOXES;
    const box = data.createBox;
    box.products = [];

    const getBoxes = cache.readQuery({ query, variables }).getBoxes.concat([box]);
    data = { getBoxes };

    cache.writeQuery({ query, variables, data });
  }

  return (
    <Mutation
      client={LocalClient}
      mutation={CREATE_BOX}
      update={updateCacheAfterAdd}
    >
      {(boxAdd, { loading, error, data }) => {
        if (loading) { return <Loading />; }
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleBoxAdd = () => {
          const tempDate = selectedDate;
          tempDate.setDate(selectedDate.getDate() + 1); // correct for unfound day descrepency
          const delivered = dateToISOString(tempDate);
          const storeProductId = storeProduct.id;
          const input = { shopId, name, delivered, storeProductId };
          console.log('Box add: ', input);
          boxAdd({ variables: { input } }).then((value) => {
            console.log('then', value);
            onComplete();
          }).catch((error) => {
            console.log('error', error);
          });
        }

        return (
          <Stack vertical>
            <BoxSelectName name={name} onSelect={setName} />
            <BoxSelectProduct product={storeProduct} onSelect={setStoreProduct} />
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
