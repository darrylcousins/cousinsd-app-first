import React from 'react';
import {
  Banner,
  DataTable,
  Loading,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { ShopifyApolloClient } from '../../graphql/shopify-client';
import ProductTitle from './ProductTitle';

export default function Subscriptions({ subscriptions }) {

  const rows = subscriptions.map((el) => (
    [
      <ProductTitle id={el.shopify_product_id} />,
      el.frequency,
    ]
  ));
  return (
    <DataTable
      columnContentTypes={Array(2).fill('text')}
      headings={[]}
      rows={rows}
    />
  );
};

