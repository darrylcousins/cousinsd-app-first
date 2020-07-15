import React from 'react';
import {
  Banner,
  DataTable,
  EmptyState,
  Layout,
  Loading,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { ShopifyApolloClient } from '../../graphql/shopify-client';
import { LocalApolloClient } from '../../graphql/local-client';
import { numberFormat } from '../../lib';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import { Editable } from '../common/Editable';
import { Switch } from '../common/Switch';
import { 
  GET_PRODUCTS,
  TOGGLE_PRODUCT_AVAILABLE,
} from './queries';
import { 
  PRODUCT_UPDATE,
} from './shopify-queries';

export default function ProductList() {

  const ShopId = SHOP_ID;
  const input = { ShopId };
  const adminUrl = `/admin/products/`;

  return (
    <Query
      client={LocalApolloClient}
      query={GET_PRODUCTS}
      fetchPolicy='no-cache'
      variables={ { input } }
      notifyOnNetworkStatusChange
      >
      {({ loading, error, data }) => {
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
                key={0}
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
                key={1}
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
              <span>{ numberFormat({ amount: product.shopify_price, currencyCode: 'NZD' }) }</span>
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
                  <strong key={0}>Title</strong>,
                  <strong key={1}>Available</strong>,
                  <strong key={2}>Price</strong>,
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
                        <strong>Product Type</strong> as <strong>&quot;Box Produce&quot;</strong>,<br />
                        <strong>Vendor</strong> as <strong>&quot;Spring Collective&quot;</strong>
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
