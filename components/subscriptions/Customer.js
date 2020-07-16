import React from 'react';
import {
  Banner,
  Button,
  Loading,
  Spinner,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { Redirect } from "@shopify/app-bridge/actions";
import { Context } from '@shopify/app-bridge-react'
import { GET_CUSTOMER } from './shopify-queries';

export default function Customer({ id }) {

  const input = { id: `gid://shopify/Customer/${id}` };

  return (
    <Query
      context={{ shopify: true }}
      query={GET_CUSTOMER}
      variables={ input }
    >
      {({ loading, error, data }) => {
        { if (error)  return <Banner status='critical'>{error.message}</Banner> }
        { if (loading) return <Spinner size='small' /> }

        const { customer } = data;
        return (
          <Context.Consumer>
            { app => {
              const redirect = Redirect.create(app);
              return (
                <Button 
                  plain
                  external
                  onClick={() => redirect.dispatch(
                    Redirect.Action.ADMIN_PATH,
                    { path: `/customers/${id}`, newContext: true }
                  )}
                >
                  { `${customer.displayName} <${customer.email}>` }
                </Button>
              );
            }}
          </Context.Consumer>
        );
      }}
    </Query>
  );
}

