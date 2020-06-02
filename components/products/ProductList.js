import React, { useState, useCallback } from 'react';
import {
  Banner,
  DataTable,
  Loading,
} from '@shopify/polaris';
import { Query, Mutation } from 'react-apollo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LocalClient } from '../../LocalClient';
import { 
  GET_PRODUCTS,
} from './queries';

export default function ProductList() {

  const shopId = SHOP_ID;
  const input = { shopId };

  return (
    <Query
      client={LocalClient}
      query={GET_PRODUCTS}
      variables={ { input } }
    >
      {({ loading, error, data }) => {
        console.log(data);
        if (loading) { return <Loading />; }
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}
        console.log(data);

        /* datatable stuff */
        const rows = data.getProducts.map((product) => (
          [
            product.title,
            product.shopify_gid,
            JSON.stringify(product.available),
          ]
        ));
        /* end datatable stuff */

        return (
          <DataTable
            columnContentTypes={Array(3).fill('text')}
            headings={[
              <strong>Title</strong>,
              <strong>Store Product</strong>,
              <strong>Available</strong>,
            ]}
            rows={rows}
          />
        );
      }}
    </Query>
  );
}


