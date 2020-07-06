import React from 'react';
import {
  Banner,
  Loading,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { ShopifyApolloClient } from '../../graphql/shopify-client';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import { GET_SUBSCRIBED_CUSTOMERS } from './shopify-queries';

export default function SubscriptionList() {

  const input = { first: 10, query: 'acceptsMarketing:true' };

  return (
    <React.Fragment>
      <Query
        client={ShopifyApolloClient}
        query={GET_SUBSCRIBED_CUSTOMERS}
        fetchPolicy='no-cache'
        variables={ input }
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

          console.log(JSON.stringify(data, null, 2));

          return (
            <React.Fragment>
              { isError && isError } 
              { isLoading && isLoading }
            </React.Fragment>
          )
        }}
      </Query>
    </React.Fragment>
  );
}


