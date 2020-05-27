import React, {useState} from 'react';
import {
  Banner,
  Layout,
  TextContainer,
  Heading,
  Loading,
  Frame,
  SettingToggle,
  Stack,
  TextStyle,
} from '@shopify/polaris';
import { Query } from 'react-apollo';
import LocalClient from '../../LocalClient';
import ProductItem from './ProductItem';
import { GET_PRODUCTS } from './queries';

export default function ProductList({ onComplete }) {

  const shopId = SHOP_ID;

  return (
    <Query client={LocalClient} query={GET_PRODUCTS} variables={{shopId}}>
      {({ loading, error, data }) => {
        if (loading) { return <Loading />; }
        console.log(error);
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}
        console.log(data);
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            { data.getProducts.map(product => (
              <ProductItem product={product} key={product.id} />
            )) }
        </div>
        );
      }}
    </Query>
  );
}
