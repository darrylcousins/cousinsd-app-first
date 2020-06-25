import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  DataTable,
  EmptyState,
  Layout,
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

  const ShopId = SHOP_ID;
  const input = { ShopId };
  const adminUrl = `${shopUrl}/admin/products/`;

  return (
    <Query
      client={LocalApolloClient}
      query={GET_PRODUCTS}
      fetchPolicy='no-cache'
      variables={ { input } }
      notifyOnNetworkStatusChange
      >
      {({ loading, error, data, refetch, networkStatus }) => {
        //console.log('GetBox Network status:', networkStatus);
        const isError = error && (
          <Banner status="critical">{error.message}</Banner>
        );
        const isLoading = loading && (
          <React.Fragment>
            <Loading />
            <LoadingPageMarkup />
          </React.Fragment>
        );

        /* datatable stuff */
        const rows = isLoading ? Array(3) : data.getProducts.map((product) => (
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
          <React.Fragment>
            { isError && isError } 
            { isLoading ? isLoading :
              <DataTable
                columnContentTypes={Array(2).fill('text').concat(['number'])}
                headings={[
                  <strong>Title</strong>,
                  <strong>Available</strong>,
                  <strong>Store Product Price</strong>,
                ]}
                rows={rows}
              />
            }
            { data && data.getProducts.length == 0 &&
              <Layout>
                <Layout.Section>
                  <EmptyState
                    heading="Manage your veggie box produce"
                    secondaryAction={{content: 'Learn more', url: 'http://cousinsd.net/'}}
                  >
                      <p style={{ textAlign: 'left' }}>
                        Add products on your store, be sure to set<br />
                        <strong>Product Type</strong> as <strong>"Box Produce"</strong>,<br />
                        <strong>Vendor</strong> as <strong>"Spring Collective"</strong>
                      </p>
                  </EmptyState>
                </Layout.Section>
              </Layout>
            }
          </React.Fragment>
        );
      }}
    </Query>
  );
}
