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
import { dateToISOString, findErrorMessage } from '../../lib';
import BoxAddSelectDate from './BoxAddSelectDate';
import BoxAddSelectName from './BoxAddSelectName';
import BoxAddSelectProduct from './BoxAddSelectProduct';
import { 
  CREATE_BOX, 
} from './queries';

export default function BoxAdd({ onComplete, refetch }) {

  const shopId = SHOP_ID;

  const [storeProduct, setStoreProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState('');

  return (
    <Mutation
      client={LocalApolloClient}
      mutation={CREATE_BOX}
    >
      {(boxAdd, { loading, error, data }) => {
        if (loading) { return <Loading />; }
        const isError = error && (
          <Banner status="critical">{error.message}</Banner>
        );


        const handleBoxAdd = () => {
          const tempDate = selectedDate;
          const delivered = dateToISOString(tempDate);
          const shopify_gid = storeProduct.id;
          const shopify_title = storeProduct.title;
          const shopify_handle = storeProduct.handle;
          const shopify_id = parseInt(storeProduct.id.split('/')[4]);
          const title = name;
          const input = { shopId, title, shopify_handle, delivered, shopify_title, shopify_gid, shopify_id };
          boxAdd({ variables: { input } }).then((value) => {
            onComplete();
            refetch();
          }).catch((error) => {
            console.log('error', error);
          });
        }

        return (
          <Stack vertical>
            { isError && isError } 
            <BoxAddSelectName name={name} onSelect={setName} />
            <BoxAddSelectProduct product={storeProduct} onSelect={setStoreProduct} />
            <BoxAddSelectDate date={selectedDate} onSelect={setSelectedDate} />
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
