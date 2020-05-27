import React, {useState, useCallback} from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Icon,
  Loading,
  Sheet,
  Stack,
  TextContainer,
  TextStyle,
} from '@shopify/polaris';
import {
  DeleteMinor,
  CircleDisableMinor,
} from '@shopify/polaris-icons';
import { Mutation } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import LocalClient from '../../LocalClient';
import { BOX_REMOVE_PRODUCT } from './queries';
import {
  GET_BOXES,
  GET_SELECTED_DATE,
} from '../boxes/queries';

export default function ProductRemove({ boxId, product, setActive }) {

  const shopId = SHOP_ID;

  const correctedDate = (date) => {
    return date.toISOString().slice(0, 10) + ' 00:00:00';
  }

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalClient });
  const delivered = data && data.selectedDate ? data.selectedDate : correctedDate(new Date());

  const updateCacheAfterRemove = (cache, { data } ) => {
    let variables = { shopId, delivered };
    let query = GET_BOXES;
    const getBoxes = cache.readQuery({ query, variables }).getBoxes.map((box) => {
      if (parseInt(box.id) === boxId) {
        box.products = box.products.filter((item) => parseInt(item.id) !== parseInt(product.id));
      }
      return box;
    });
    data = { getBoxes };

    cache.writeQuery({ query, variables, data });
  }

  return (
    <Mutation
      client={LocalClient}
      mutation={BOX_REMOVE_PRODUCT}
      update={updateCacheAfterRemove}
    >
      {(productRemove, { loading, error, data }) => {

        if (loading) { return <Loading />; }

        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleProductRemove = () => {
          const productId = parseInt(product.id);
          const input = { boxId, productId };
          productRemove({ variables: { input } }).then(() => setActive(false)).then(() => setActive(true));
        };

        console.log(product.available);
        const textStyle = product.available === 'true' ? 'strong' : 'subdued';

        return (
          <Stack>
            <Button
              plain
              onClick={handleProductRemove}>
                <Icon source={CircleDisableMinor} />
            </Button>
            <TextStyle variation={textStyle}>
              {product.name}
            </TextStyle>
          </Stack>
        );
      }}
    </Mutation>
  );
}


