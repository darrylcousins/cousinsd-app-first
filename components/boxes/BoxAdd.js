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
import { LocalApolloClient } from '../../graphql/local-client';
import { dateToISOString } from '../../lib';
import BoxSelectDate from './BoxSelectDate';
import BoxSelectName from './BoxSelectName';
import BoxSelectProduct from './BoxSelectProduct';
import { 
  CREATE_BOX, 
  GET_BOXES,
  GET_SELECTED_DATE,
} from './queries';

export default function BoxAdd({ onComplete, refetch }) {

  const shopId = SHOP_ID;

  const [storeProduct, setStoreProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState('');

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalApolloClient });
  const delivered = data && data.selectedDate ? data.selectedDate : dateToISOString(new Date());
  const updateCacheAfterAdd = (cache, { data }) => {
    const input = { shopId, delivered };
    const variables = { input };
    const query = GET_BOXES;
    const box = data.createBox;

    const getBoxes = cache.readQuery({ query, variables } ).getBoxes.concat([box]);
    data = { getBoxes };

    cache.writeQuery({ query, variables, data });
  }


  return (
    <Mutation
      client={LocalApolloClient}
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
          const shopify_gid = storeProduct.id;
          const shopify_title = storeProduct.title;
          const shopify_id = parseInt(storeProduct.id.split('/')[4]);
          const handle = storeProduct.handle;
          const title = name;
          const input = { shopId, title, handle, delivered, shopify_title, shopify_gid, shopify_id };
          boxAdd({ variables: { input } }).then((value) => {
            onComplete();
            return value;
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
