import React from 'react';
import {
  Banner,
  DataTable,
  EmptyState,
  Loading,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import { GET_SUBSCRIBERS } from './queries';
import Customer from './Customer';
import Subscriptions from './Subscriptions';

export default function SubscriberList() {

  const input = { ShopId: SHOP_ID };

  return (
    <Query
      query={GET_SUBSCRIBERS}
      fetchPolicy='no-cache'
      variables={ { input } }
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
        const rows = isLoading ? Array(2) : data.getSubscribers.map((subscriber) => (
          [
            <Customer id={subscriber.shopify_customer_id} />,
            <Subscriptions subscriptions={subscriber.subscriptions} />
          ]
        ));
        /* end datatable stuff */

        return (
          <React.Fragment>
            { isError && isError } 
            { isLoading ? isLoading :
              <DataTable
                columnContentTypes={Array(2).fill('text')}
                headings={[
                  <strong key={1}>Customer</strong>,
                  <strong key={1}>Boxes</strong>,
                ]}
                rows={rows}
              />
            }
            { data && data.getSubscribers.length == 0 &&
              <EmptyState
                heading="No subscribers"
                secondaryAction={{content: 'Learn more', url: 'http://cousinsd.net/'}}
              >
              </EmptyState>
            }
          </React.Fragment>
        );
      }}
    </Query>
  );
};

