import React from 'react';
import {
  Banner,
  Button,
  Spinner,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { GET_PRODUCT } from './shopify-queries';

/* get product title for the subscription */
export default function ProductTitle({ id }) {

  const input = { id: `gid://shopify/Product/${id}` };

  return (
    <Query
      context={{ shopify: true }}
      query={GET_PRODUCT}
      variables={ input }
    >
      {({ loading, error, data }) => {
        { if (error)  return <Banner status='critical'>{error.message}</Banner> }
        { if (loading) return <Spinner size='small' /> }

        const { product } = data;
        return (
          <Button
            plain
            external
            url={ `https://${SHOP_NAME}.myshopify.com/admin/products/${id}` }
          >
            { `${product.title}` }
          </Button>
        );
      }}
    </Query>
  );
};


