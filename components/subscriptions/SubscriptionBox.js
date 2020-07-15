import React from 'react';
import {
  Banner,
  Button,
  Spinner,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';

import { Box } from '../client/components/boxes/Box';
import { GET_CURRENT_SELECTION, GET_INITIAL } from '../client/graphql/local-queries';
import { GET_BOX } from '../client/graphql/queries';
import { makeCurrent } from '../client/lib';
import { Client } from '../client/graphql/client';

export default function SubscriptionBox({ id }) {

  const { initial } = Client.readQuery({ 
    query: GET_INITIAL,
  });
  const input = { id };

  return (
    <Query
      client={Client}
      query={GET_BOX}
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
        const { current } = makeCurrent({ current: start });
        Client.writeQuery({ 
          query: GET_CURRENT_SELECTION,
          data: { current },
        });

        return (
          <div style={{ width: '50%', textAlign: 'center' }}>
            <Box loaded={true} />
          </div>
        );
      }}
    </Query>
  );
};



