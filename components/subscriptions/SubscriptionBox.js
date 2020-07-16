import React from 'react';
import {
  Banner,
  Button,
  Spinner,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import loadable from '@loadable/component';
import { useApolloClient } from '@apollo/client';
import { GET_BOX_PRODUCTS } from '../boxes/queries';
import {
  Box,
  makeCurrent,
  GET_INITIAL,
  GET_CURRENT_SELECTION,
} from '@cousinsd/shopify-boxes-client';

export default function SubscriptionBox({ id }) {

  const client = useApolloClient();
  const { initial } = client.readQuery({ 
    query: GET_INITIAL,
  });
  const input = { id };

  return (
    <Query
      query={GET_BOX_PRODUCTS}
      variables={ { input } }
    >
      {({ loading, error, data }) => {
        { if (error)  return <Banner status='critical'>{error.message}</Banner> }
        { if (loading) return <Spinner size='small' /> }

        const box = data.getBox;
        const start = {
          box,
          delivered: initial.delivered,
          including: initial.including,
          addons: initial.addons,
          exaddons: [],
          dislikes: initial.dislikes,
          quantities: initial.quantities,
          subscription: initial.subscription,
        };
        const { current } = makeCurrent({ current: start, client });
        client.writeQuery({ 
          query: GET_CURRENT_SELECTION,
          data: { current },
        });

        return (
          <div style={{ width: '70rem' }}>
            <Box loaded={true} />
          </div>
        );
      }}
    </Query>
  );
};
