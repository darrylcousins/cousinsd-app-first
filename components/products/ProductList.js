import React, {useState} from 'react';
import {
  Banner,
  Button,
  Loading,
  Scrollable,
} from '@shopify/polaris';
import { Query } from 'react-apollo';
import { LocalClient } from '../../LocalClient';
import ProductItem from './ProductItem';
import ProductCreate from './ProductCreate';
import Editable from '../common/Editable';
import {
  GET_PRODUCTS,
  BOX_ADD_PRODUCT,
  CREATE_PRODUCT,
} from './queries';

export default function ProductList({ onComplete }) {

  const shopId = SHOP_ID;

  const windowHeight = window.innerHeight - 180;
  console.log(window.innerHeight, windowHeight);

  return (
    <Query client={LocalClient} query={GET_PRODUCTS} variables={{shopId}} fetchPolicy='network-only'>
      {({ loading, error, data }) => {
        if (loading) { return <Loading />; }
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}
        return (
          <React.Fragment>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ProductCreate />
              <div
                style={{
                  height: `${windowHeight}px`,
                  overflowY: 'auto',
                  paddingTop: '1.6rem',
                }}
              >
                { data.getProducts.map(product => (
                  <ProductItem product={product} key={product.id} />
                )) }
              </div>
            </div>
            <div
              style={{
              alignItems: 'left',
              borderTop: '1px solid #DFE3E8',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1rem',
              width: '100%',
              }}
            >
              <Button onClick={onComplete}>Cancel</Button>
              <Button primary onClick={onComplete}>
              Done
              </Button>
            </div>
          </React.Fragment>
        );
      }}
    </Query>
  );
}
