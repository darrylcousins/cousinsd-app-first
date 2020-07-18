import React from 'react';
import {
  Banner,
  Loading,
  Stack,
  TextStyle,
} from '@shopify/polaris';
import { Link } from 'react-router-dom';
import { Query } from '@apollo/react-components';
import { useApolloClient } from '@apollo/client';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import Customer from './Customer';
import SubscriptionBox from './SubscriptionBox';
import { GET_SUBSCRIPTION } from './queries';
import {
  GET_INITIAL,
  GET_CURRENT_SELECTION,
  initial,
  current,
  numberFormat
} from '@cousinsd/shopify-boxes-client';

export default function SubscriptionDetail({ uid }) {

  const client = useApolloClient();

  // reset cache data
  client.writeQuery({ 
    query: GET_INITIAL,
    data: { initial },
  });
  client.writeQuery({ 
    query: GET_CURRENT_SELECTION,
    data: { current },
  });

  const input = { uid };

  return (
    <Query
      query={GET_SUBSCRIPTION}
      fetchPolicy='no-cache'
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

        client.writeQuery({ 
          query: GET_INITIAL,
          data: { initial: subscription.current_cart },
        });

        //console.log(client.cache.data.data);
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
              <span style={{ fontWeight: 'bold', fontSize: '1.7em' }} data-regular-price>
                { numberFormat(subscription.current_cart.total_price * 0.01) }
              </span>
            </Stack>
            <SubscriptionBox
              subscription={subscription} />
          </div>
          </>
        );
      }}
    </Query>
  );
}
  /*
              */

