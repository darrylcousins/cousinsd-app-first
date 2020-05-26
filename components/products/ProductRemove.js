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
} from '@shopify/polaris-icons';
import { Mutation } from 'react-apollo';
import LocalClient from '../../LocalClient';
import { BOX_REMOVE_PRODUCT } from './queries';
import { GET_BOXES } from '../boxes/queries';

export default function ProductRemove({ boxId, productId, productName, setActive }) {

  const shopId = SHOP_ID;

  const updateCacheAfterRemove = (cache, { data } ) => {
    let variables = { shopId };
    let query = GET_BOXES;
    const getBoxes = cache.readQuery({ query, variables }).getBoxes.map((box) => {
      if (parseInt(box.id) === boxId) {
        box.products = box.products.filter((item) => parseInt(item.id) !== productId);
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
          const input = { boxId, productId };
          productRemove({ variables: { input } }).then(() => setActive(false)).then(() => setActive(true));
        };

        return (
          <Stack>
            <Button
              plain
              onClick={handleProductRemove}>
                <Icon source={DeleteMinor} />
            </Button>
            <TextStyle>
              {productName}
            </TextStyle>
          </Stack>
        );
      }}
    </Mutation>
  );
}


