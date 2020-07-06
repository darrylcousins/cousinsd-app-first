import React from 'react';
import {
  Banner,
  Button,
  Icon,
  Loading,
  Spinner,
  Stack,
  TextStyle,
} from '@shopify/polaris';
import {
  CircleMinusOutlineMinor,
} from '@shopify/polaris-icons';
import { Mutation } from '@apollo/react-components';
import { LocalApolloClient } from '../../graphql/local-client';
import {
  BOX_REMOVE_PRODUCT,
} from './queries';

/*
 * Remove a product from a box with id
 */

export default function BoxProductRemove({ boxId, product, refetch, isAddOn }) {

  return (
    <Mutation
      client={LocalApolloClient}
      mutation={BOX_REMOVE_PRODUCT}
    >
      {(productRemove, { loading, error, data }) => {
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

        console.log(data);

        const handleProductRemove = () => {
          const productId = parseInt(product.id);
          const input = { boxId, productId, isAddOn };
          productRemove({ variables: { input } })
            .then(() => {
              refetch();
          }).catch((error) => {
            console.log('error', error);
          });
        };

        const textStyle = product.available === true ? 'strong' : 'subdued';
        console.log(product.available, textStyle);

        return (
          <Stack>
            <Button
              plain
              onClick={handleProductRemove}>
                <Icon source={CircleMinusOutlineMinor} />
            </Button>
            <TextStyle variation={textStyle}>
              {product.title}
            </TextStyle>
          </Stack>
        );
      }}
    </Mutation>
  );
}


