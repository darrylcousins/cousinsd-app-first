import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  InlineError,
  Loading,
  Spinner,
  Toast,
} from '@shopify/polaris';
import { Mutation } from '@apollo/react-components';
import { useApolloClient } from '@apollo/client';
import { findErrorMessage } from '../../lib';
import { UPDATE_SUBSCRIPTION } from './queries';
import {
  GET_INITIAL,
  GET_CURRENT_SELECTION,
} from '@cousinsd/shopify-boxes-client';

export default function SubscriptionEdit({ subscription }) {

  const client = useApolloClient();

  const [saved, setSaved] = useState(false);
  const toggleToast = useCallback(() => setSaved((saved) => !saved), []);

  /* save handler */
  const getInputData = () => {
    const { current } = client.readQuery({ 
      query: GET_CURRENT_SELECTION,
    });
    let quantities = [];
    let addons = [];
    let total_price = current.box.shopify_price;
    current.addons.forEach(el => {
      quantities.push({
        handle: el.shopify_handle,
        variant_id: el.shopify_variant_id,
        quantity: el.quantity
      });
      addons.push(el.quantity === 1 ? el.shopify_handle : `${el.shopify_handle} (${el.quantity})`);
      total_price += el.quantity * el.shopify_price;
    });
    const current_cart = {
      box_id: parseInt(current.box.id),
      shopify_id: current.box.shopify_id,
      shopify_title: current.box.shopify_title,
      delivered: current.delivered,
      subscription: current.subscription,
      including: current.including.map(el => el.shopify_handle),
      dislikes: current.dislikes.map(el => el.shopify_handle),
      is_loaded: true,
      total_price,
      addons,
      quantities,
    };
    return { 
      uid: subscription.uid,
      frequency: current_cart.subscription,
      current_cart
    };
  };
  /* end save handler */

  return (
    <Mutation
      mutation={UPDATE_SUBSCRIPTION}
    >
      {(updateSubscription, { data, loading, error }) => {

        const isError = error && (
          <InlineError message={ findErrorMessage(error) }  />
        );

        const isSaved = data && saved && (
          <Toast content='Your changes saved!' duration={3000} onDismiss={toggleToast} />
        );

        const handleSave = () => {
          const input = getInputData();
          console.log('The result to save: ', input);
          updateSubscription({ variables: { input } })
            .then(res => setSaved(true))
            .catch(err => console.log(err));
        };

        return (
          <div style={{ paddingBottom: '3rem' }}>
            { isError && isError } 
            { isSaved && isSaved } 
            <Button
              fullWidth
              primary
              loading={loading}
              onClick={handleSave}
            >Save</Button>
          </div>
        );
      }}
    </Mutation>
  );
};


