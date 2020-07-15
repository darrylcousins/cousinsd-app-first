import React from 'react';
import {
  Banner,
  Loading,
  Stack,
  TextStyle,
} from '@shopify/polaris';
import { Link } from 'react-router-dom';
import { Query } from '@apollo/react-components';
import { LocalApolloClient } from '../../graphql/local-client';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import Customer from './Customer';
import { GET_SUBSCRIPTION } from './queries';

export default function SubscriptionDetail({ uid }) {

  const input = { uid };

  return (
    <Query
      client={LocalApolloClient}
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
            </Stack>
          </div>
          </>
        );
      }}
    </Query>
  );
}


