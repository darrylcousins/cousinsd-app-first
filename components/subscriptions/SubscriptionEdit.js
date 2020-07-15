import React from 'react';
import {
  Banner,
  Loading,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { ShopifyApolloClient } from '../../graphql/shopify-client';

export default function SubscriptionEdit({ uid }) {

  return (
    `Edit subscription ${uid}`
  );
};


