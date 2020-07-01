import React, { useEffect, useState, useCallback } from 'react';
import gql from 'graphql-tag';
import fetch from 'node-fetch';
import {
  Badge,
  Banner,
  Button,
  DataTable,
  EmptyState,
  Layout,
  Loading,
} from '@shopify/polaris';
import { Query } from 'react-apollo';
import { ShopifyApolloClient } from '../../graphql/shopify-client';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import { dateToISOString } from '../../lib';
import OrderAddress from './OrderAddress';
import LineItemProductList from './LineItemProductList';

export default function OrderList({ query, shopUrl, input, checkbox, LineCheckbox }) {

  const ShopId = SHOP_ID;

  const adminUrl = `${shopUrl}/admin/orders/`;
  const [delivery_date, including, addons, removed] = LABELKEYS;

  const getBadge = (text) => {
    var progress = '';
    var status = '';
    if (text.toUpperCase().startsWith('UN')) {
      progress = 'incomplete';
      status = 'attention';
    } else {
      progress = 'complete';
      status = 'new';
    }
    const finalText = text.toUpperCase()[0] + text.toLowerCase().slice(1);
    return (
      <Badge
        progress={progress}
        status={status}
      >
        { finalText }
      </Badge>
    );
  };

  return (
    <Query
      client={ShopifyApolloClient}
      query={query}
      fetchPolicy='no-cache'
      variables={ { input } }
      notifyOnNetworkStatusChange
      >
      {({ loading, error, data, refetch, networkStatus }) => {
        const isError = error && (
          <Banner status="critical">{error.message}</Banner>
        );
        const isLoading = loading && (
          <React.Fragment>
            <Loading />
            <LoadingPageMarkup />
          </React.Fragment>
        );

        /* datatable stuff */
        let rows = Array();

        const checkAddons = (addons, lineItems) => {
          console.log(lineItems);
          console.log(addons);
          return addons;
        }

        if (!loading) {
          //console.log(query);
          //console.log(data);
          for (const [ key, order ] of Object.entries(data)) {
            let row = Array();
            let lineItems = order.lineItems.edges;
            let id = order.id.split('/').pop();
            let done = false;
            //console.log(order);
            let produce = Array();
            const deliveryDate = new Date(input.delivered).toDateString();
            // collect added items to check against attribute list
            for (let i = 0; i < lineItems.length; i++) {
              let node = lineItems[i].node;
              if (node.product.productType == 'Box Produce') {
                produce.push(node.product.handle);
              };
            };
            for (let i = 0; i < lineItems.length; i++) {
              let node = lineItems[i].node;
              if (node.product.productType == 'Veggie Box') {
                var attrs = node.customAttributes.reduce(
                  (acc, curr) => Object.assign(acc, { [`${curr.key}`]: curr.value }),
                  {});
                if (new Date(attrs[delivery_date]).toDateString() == deliveryDate) {
                  let lineid = node.id.split('/').pop();
                  row.push(!done ? 
                    <LineCheckbox id={id} name={order.name} />
                    : ''
                  );
                  row.push(!done ? 
                      <Button 
                        plain
                        url={`${adminUrl}${id}`}
                      >
                        {order.name}
                      </Button> : '');
                  row.push(
                    <>
                    <span>{ node.name }</span><br />
                    { getBadge(order.displayFinancialStatus) }
                    { getBadge(node.fulfillmentStatus) }<br />
                    <input type='hidden' value={lineid} name={id} />
                    <input type='hidden' value={node.quantity} name={lineid} />
                    </>
                  );
                  row.push(node.quantity);
                  row.push(attrs[delivery_date]);
                  row.push(<LineItemProductList list={attrs[including]} />);
                  row.push(<LineItemProductList list={attrs[addons]} produce={produce} />);
                  row.push(<LineItemProductList list={attrs[removed]} />);
                  row.push(<OrderAddress address={order.shippingAddress} />);
                  done = true;
                  rows.push(row);
                  row = Array();
                }
              }
            }
          };
        };

        return (
          <React.Fragment>
            { isError && isError } 
            { isLoading ? isLoading :
              <React.Fragment>
                <DataTable
                  columnContentTypes={Array(8).fill('text')}
                  headings={[
                    checkbox,
                    <strong>Order</strong>,
                    <strong>Box</strong>,
                    <strong>Qty</strong>,
                    <strong>Delivery Date</strong>,
                    <strong>Including</strong>,
                    <strong>Extras</strong>,
                    <strong>Removed</strong>,
                    <strong>Address</strong>,
                  ]}
                  rows={rows}
                />
              </React.Fragment>
            }
          </React.Fragment>
        );
      }}
    </Query>
  );
}

