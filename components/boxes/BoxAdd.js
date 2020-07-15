import React, { useState } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Loading,
  Stack,
} from '@shopify/polaris';
import { Mutation } from '@apollo/react-components';
import { useQuery } from '@apollo/client';
import BoxAddSelectDate from './BoxAddSelectDate';
import BoxAddSelectName from './BoxAddSelectName';
import BoxAddSelectProduct from './BoxAddSelectProduct';
import { 
  CREATE_BOX, 
  GET_SELECTED_DATE,
} from './queries';

export default function BoxAdd({ onComplete, refetch }) {

  const ShopId = SHOP_ID;

  const { data } = useQuery(GET_SELECTED_DATE);
  const [storeProduct, setStoreProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(Date.parse(data.selectedDate)));
  const [name, setName] = useState('');

  return (
    <Mutation
      mutation={CREATE_BOX}
    >
      {(boxAdd, { loading, error, data }) => {
        if (loading) { return <Loading />; }

        const isError = error && (
          <Banner status="critical">{error.message}</Banner>
        );

        const handleBoxAdd = () => {
          const variables = {
            input: {
              ShopId,
              title: name,
              delivered: selectedDate.toDateString(),
              shopify_title: storeProduct.title,
              shopify_gid: storeProduct.id,
              shopify_id: parseInt(storeProduct.id.split('/')[4]),
              shopify_handle: storeProduct.handle,
              shopify_variant_id: parseInt(storeProduct.variants[0].id.split('/')[4]),
              shopify_price: parseFloat(storeProduct.variants[0].price)*100,
            }
          };
          boxAdd({ variables })
            .then(() => {
              onComplete();
              refetch();
            })
            .catch((error) => {
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
