import React from 'react';
import {
  DataTable,
  Button,
} from '@shopify/polaris';
import { Link } from 'react-router-dom';
import ProductTitle from './ProductTitle';

export default function Subscriptions({ subscriptions }) {

  const rows = subscriptions.map((el) => (
    [
      <Link
        to={`/subscription/${el.uid}`}
      >View subscription</Link>,
      <ProductTitle id={el.shopify_product_id} />,
      el.frequency,
    ]
  ));
  return (
    <DataTable
      columnContentTypes={Array(3).fill('text')}
      headings={[]}
      rows={rows}
    />
  );
};

