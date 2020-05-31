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
import { LocalClient } from '../../LocalClient';
import { nameSort } from '../../lib';
import {
  BOX_REMOVE_PRODUCT,
  BOX_GET_DESELECTED_PRODUCTS,
} from './queries';
import {
  GET_BOXES,
  FRAGMENT_PRODUCT_ARRAY,
} from '../boxes/queries';

/*
 * Remove a product from a box
 */

export default function ProductRemove({ boxId, product, setActive }) {

  const updateCacheAfterRemove = (cache, { data } ) => {

    const product = data.boxRemoveProduct;
    const fragment = FRAGMENT_PRODUCT_ARRAY;
    const fragmentName = 'productArray';
    const id = `Box:${boxId}`;

    data = cache.readFragment({ id, fragment, fragmentName });
    const products = data.products.filter((item) => item.id !== product.id);
    data = { products }
    cache.writeFragment({ id, fragment, fragmentName, data });

    const variables = { boxId };
    const query = BOX_GET_DESELECTED_PRODUCTS;
    try {
      const boxGetDeselectedProducts = cache.readQuery({ query, variables })
        .boxGetDeselectedProducts.concat([product]).sort(nameSort);
      data = { boxGetDeselectedProducts };

      cache.writeQuery({ query, variables, data });
    } catch(e) {};
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
          productRemove({ variables: { input } });
        };

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


