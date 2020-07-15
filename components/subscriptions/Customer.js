import React from 'react';
import {
  Banner,
  Button,
  Loading,
  Spinner,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { GET_CUSTOMER } from './shopify-queries';

export default function Customer({ id }) {

  const input = { id: `gid://shopify/Customer/${id}` };

  return (
    <Query
      context={{ shopify: true }}
      query={GET_CUSTOMER}
      variables={ input }
    >
      {({ loading, error, data }) => {
        { if (error)  return <Banner status='critical'>{error.message}</Banner> }
        { if (loading) return <Spinner size='small' /> }

        const { customer } = data;
        return (
          <Button
            plain
            external
            url={ `https://${SHOP_NAME}.myshopify.com/admin/customers/${id}` }
          >
            { `${customer.displayName} <${customer.email}>` }
          </Button>
        );
      }}
    </Query>
  );
}

