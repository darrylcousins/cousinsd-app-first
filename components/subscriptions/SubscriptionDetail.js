import React from 'react';
import {
  Banner,
  Loading,
  Stack,
  TextStyle,
} from '@shopify/polaris';
import { Link } from 'react-router-dom';
import { Query } from '@apollo/react-components';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import Customer from './Customer';
import SubscriptionBox from './SubscriptionBox';
import { GET_SUBSCRIPTION } from './queries';

import { GET_INITIAL } from '../client/graphql/local-queries';
import { Client } from '../client/graphql/client';

export default function SubscriptionDetail({ uid }) {

  const input = { uid };
  console.log(Client.cache.data.data);

  return (
    <Query
      query={GET_SUBSCRIPTION}
      variables={ { input } }
    >
      {({ loading, error, data }) => {
        { if (error)  return <Banner status='critical'>{error.message}</Banner> }
        { if (loading) return (
            <React.Fragment>
              <Loading />
              <LoadingPageMarkup />
            </React.Fragment>
          );
        }

        const subscription = data.getSubscription;
        Client.writeQuery({ 
          query: GET_INITIAL,
          data: { initial: subscription.current_cart },
        });

        return (
          <>
          <div style={{ margin: '1.6rem' }}>
            <Stack>
              <Link to='/subscribers'>
                <TextStyle variation='subdued'>
                Back to all subscriptions
                </TextStyle>
              </Link>
              <Customer id={subscription.subscriber.shopify_customer_id} />
              <SubscriptionBox id={subscription.current_cart.box_id} />
            </Stack>
          </div>
          </>
        );
      }}
    </Query>
  );
}


