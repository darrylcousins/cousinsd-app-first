import React, { useEffect, useState, useCallback } from 'react';
import fetch from 'node-fetch';
import {
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  DataTable,
  EmptyState,
  Layout,
  Loading,
  TextStyle,
} from '@shopify/polaris';
import { Query, Mutation } from 'react-apollo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ShopifyApolloClient } from '../../graphql/shopify-client';
import { LocalApolloClient } from '../../graphql/local-client';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import DateRangeSelector from '../common/DateRangeSelector';
import OrderAddress from './OrderAddress';
import LineItemProductList from './LineItemProductList';
import { 
  GET_ORDERS,
} from './shopify-queries';
import { 
  GET_SELECTED_DATE,
} from '../boxes/queries';

export default function OrderList({ shopUrl }) {

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalApolloClient });
  const [date, setDate] = useState(data.selectedDate);

  const first = 10;
  const query = 'fulfillment_status:UNFULFILLED AND created_date:>';

  const input = { first, query: `${query}${date}` };
  const adminUrl = `${shopUrl}/admin/orders/`;

  /* checkbox stuff */
  let ids = Array();
  const [checkedIds, setCheckedIds] = useState([]);
  const handleCheckedChange = useCallback((newChecked, id) => {
    if (newChecked) {
      setCheckedIds(checkedIds.concat([id]));
    } else {
      setCheckedIds(checkedIds.filter(el => el != id));
    }
    }, [checkedIds]
  );
  const handleCheckAll = (checked, value) => {
    console.log(checked, value);
    if (checked) setCheckedIds(ids);
    if (!checked) setCheckedIds([]);
  }
  /* end checkbox stuff */

  /* pdf labels maybe */
  /* pdf labels maybe */
  async function getSomething() {
    const response = await fetch(`${HOST}/pdf`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answer: 42 }),
    });
    console.log('got 1', response);
  };
  getSomething();

  return (
    <Query
      client={ShopifyApolloClient}
      query={GET_ORDERS}
      fetchPolicy='no-cache'
      variables={ input }
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
        if (!loading) {
          data.orders.edges.forEach(({ node }) => {
            if (!node.closed) {
              const lineItems = node.lineItems.edges;
              const itemsLength = lineItems.length;
              const id = node.id.split('/').pop();
              ids = ids.concat([id])
              for (let i = 0; i < itemsLength; i++) {
                if (lineItems[i].node.product.productType == 'Veggie Box') {
                  var customAttributes = lineItems[i].node.customAttributes.reduce(
                    (acc, curr) => Object.assign(acc, { [`${curr.key}`]: curr.value }),
                    {});
                  customAttributes = lineItems[i].node.customAttributes.reduce(
                    (acc, curr) => Object.assign(acc, { [`${curr.key}`]: curr.value }),
                    {});
                  rows.push([
                    i == 0 ? 
                      <Checkbox 
                        id={id}
                        label={node.name}
                        labelHidden={true}
                        onChange={handleCheckedChange}
                        checked={checkedIds.indexOf(id) > -1}
                      /> : '',
                    i == 0 ? 
                      <Button 
                        plain
                        url={`${adminUrl}${id}`}
                      >
                        {node.name}
                      </Button> : '',
                    lineItems[i].node.name,
                    customAttributes['Delivery Date'],
                    <LineItemProductList list={customAttributes['Including']} />,
                    <LineItemProductList list={customAttributes['Add on items']} />,
                    <LineItemProductList list={customAttributes['Removed items']} />,
                    <OrderAddress address={node.shippingAddress} />,
                  ]);
                }
              }
            }
          });
        };

        const handleDateChange = (date) => {
          const input = { first, query: `${query}${date}` };
          refetch(input);
        }

        return (
          <React.Fragment>
            <div style={{ padding: '1.6rem' }}>
              <ButtonGroup segmented >
                <Button
                  disabled={checkedIds.length == 0}
                >
                  Labels
                </Button>
                <DateRangeSelector handleDateChange={handleDateChange} disabled={ Boolean(isLoading) } />
              </ButtonGroup>
            </div>
            { isError && isError } 
            { isLoading ? isLoading :
              <DataTable
                columnContentTypes={Array(8).fill('text')}
                headings={[
                  <Checkbox 
                    id='all'
                    label='Select/deselect all'
                    labelHidden={true}
                    onChange={handleCheckAll}
                    checked={checkedIds.length > 0}
                  />,
                  <strong>Order</strong>,
                  <strong>Box</strong>,
                  <strong>Delivery Date</strong>,
                  <strong>Including</strong>,
                  <strong>Extras</strong>,
                  <strong>Removed</strong>,
                  <strong>Address</strong>,
                ]}
                rows={rows}
              />
            }
            { data && data.orders.edges.length == 0 &&
              <Layout>
                <Layout.Section>
                  <EmptyState
                    heading="No orders here"
                  >
                  </EmptyState>
                </Layout.Section>
              </Layout>
            }
          </React.Fragment>
        );
      }}
    </Query>
  );
}

