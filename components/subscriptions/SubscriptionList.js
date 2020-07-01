import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  EmptyState,
  DataTable,
  Icon,
  Layout,
  Loading,
  Sheet,
  TextStyle,
} from '@shopify/polaris';
import {
    MinusMinor
} from '@shopify/polaris-icons';
import { Query } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { ShopifyApolloClient } from '../../graphql/shopify-client';
import { LocalApolloClient } from '../../graphql/local-client';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import { GET_SUBSCRIBED_CUSTOMERS } from './shopify-queries';
import { GET_SELECTED_DATE } from '../boxes/queries';

export default function SubscriptionList({ shopUrl }) {

  const ShopId = SHOP_ID;

  /* subscription datatable stuff */
  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalApolloClient });
  const [delivered, setDelivered] = useState(data.selectedDate);
  /* end subscription datatable stuff */

  /* checkbox stuff */
  const [checkedId, setCheckedId] = useState(0);
  const [checked, setChecked] = useState(false);
  const handleCheckedChange = useCallback((newChecked, id) => {
    setChecked(newChecked);
    setCheckedId(id);
    }, []
  );
  const clearChecked = () => {
      setChecked(false);
      setCheckedId(0);
  };
  /* end checkbox stuff */

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
        {({ loading, error, data, refetch, networkStatus }) => {
          //console.log('GetBox Network status:', networkStatus);
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


