import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  DataTable,
  Loading,
  TextStyle,
} from '@shopify/polaris';
import { Query, Mutation } from 'react-apollo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ShopifyApolloClient } from '../../graphql/shopify-client';
import { LocalApolloClient } from '../../graphql/local-client';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import { Editable } from '../common/Editable';
import { Switch } from '../common/Switch';
import { ProductShopPrice } from './ProductShopPrice';
import { 
  GET_PRODUCTS,
  TOGGLE_PRODUCT_AVAILABLE,
} from './queries';
import { 
  PRODUCT_UPDATE,
} from './shopify-queries';

export default function ProductList({ shopUrl }) {

  const shopId = SHOP_ID;
  const input = { shopId };
  const adminUrl = `${shopUrl}/admin/products/`;

  return (
    <Query
      client={LocalApolloClient}
      query={GET_PRODUCTS}
      fetchPolicy='network-only'
      variables={ { input } }
    >
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <React.Fragment>
              <Loading />
              <LoadingPageMarkup />
            </React.Fragment>
          )
        }
        if (error) {
          console.log(error);
          return (
            <Banner status="critical">{error.message}</Banner>
          )
        }
        console.log(data);

        /* datatable stuff */
        const rows = data.getProducts.map((product) => (
          [
            (
              <Editable 
                title={product.title}
                id={product.shopify_gid}
                fieldName='title'
                client={ShopifyApolloClient}
                mutation={PRODUCT_UPDATE}
                update={(data) => console.log(data)}
                textStyle='strong'
              />
            ),
            (
              <Switch
                id={product.id}
                fieldName='available'
                client={LocalApolloClient}
                mutation={TOGGLE_PRODUCT_AVAILABLE}
                update={(data) => console.log(data)}
                selected={product.available}
                onChange={(checked, gid) => console.log('got value', checked, gid)}
              />
            ),
            (
              <Button 
                plain
                external
                url={`${adminUrl}${product.shopify_id}`}
              >
                <TextStyle variation='subdued'>{ product.handle }</TextStyle>
              </Button>
            ),
            (
              <ProductShopPrice
                id={product.shopify_gid}
                adminUrl={adminUrl}
                productId={product.shopify_id}
              />
            ),
          ]
        ));
        /* end datatable stuff */

        return (
          <DataTable
            columnContentTypes={Array(3).fill('text').concat(['number'])}
            headings={[
              <strong>Title</strong>,
              <strong>Available</strong>,
              <strong>Store Product Handle</strong>,
              <strong>Store Product Price</strong>,
            ]}
            rows={rows}
          />
        );
      }}
    </Query>
  );
}


