import React from 'react';
import {
  Banner,
  Button,
  Heading,
  Spinner,
  TextStyle,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { useApolloClient } from '@apollo/client';
import Spacer from '../common/Spacer';
import SubscriptionEdit from './SubscriptionEdit';
import { GET_BOX_PRODUCTS } from '../boxes/queries';
import {
  WrappedBox,
  makeCurrent,
  GET_INITIAL,
  GET_CURRENT_SELECTION,
  REACT2,
} from '@cousinsd/shopify-boxes-client';

export default function SubscriptionBox({ subscription }) {

  const client = useApolloClient();

  const { initial } = client.readQuery({ 
    query: GET_INITIAL,
  });
  const input = { id: subscription.current_cart.box_id };

  /* subscription selector */
  const handleSubscriptionChange = (frequency) => {
    console.log(frequency);
    const { current } = client.readQuery({ 
      query: GET_CURRENT_SELECTION,
    });
    const update = { ...current };
    update.subscription = frequency;
    client.writeQuery({ 
      query: GET_CURRENT_SELECTION,
      data: { current: update },
    });
    console.log('initial', initial);
    console.log('current', update);
  };
  /* end subscription selector */

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
          <>
            <Spacer />
            <Heading>
              { current.box.shopify_title }&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <TextStyle variation='subdued'>
                <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>{ current.delivered }</span>
              </TextStyle>
            </Heading>
            <div style={{ width: '55rem' }}>
              <WrappedBox 
                loaded={true} 
                state={current.subscription}
                handleChange={handleSubscriptionChange} />
              <Spacer />
              <SubscriptionEdit subscription={subscription} />
            </div>
          </>
        );
      }}
    </Query>
  );
};
/*
              <Box loaded={true} />
              <Spacer />
              <Subscription
                state={current.subscription}
                handleChange={handleSubscriptionChange} />
              <Spacer />
              <SubscriptionEdit subscription={subscription} />
*/
