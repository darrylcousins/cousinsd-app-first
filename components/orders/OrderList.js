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
import { execute, makePromise } from 'apollo-link';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ShopifyApolloClient, ShopifyHttpLink } from '../../graphql/shopify-client';
import { LocalApolloClient } from '../../graphql/local-client';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import { dateToISOString } from '../../lib';
import DateRangeSelector from '../common/DateRangeSelector';
import OrderAddress from './OrderAddress';
import LineItemProductList from './LineItemProductList';
import createDocDefinition from './docdefinition';
import { 
  GET_ORDERS,
  getQuery,
} from './shopify-queries';
import { 
  GET_SELECTED_DATE,
} from '../boxes/queries';

export default function OrderList({ shopUrl }) {

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalApolloClient });
  const [date, setDate] = useState(data.selectedDate);

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
    if (checked) setCheckedIds(ids);
    if (!checked) setCheckedIds([]);
  }
  /* end checkbox stuff */

  const [labelLoading, setLabelLoading] = useState(false);
  const [including, addons, removed] = ['Including', 'Add on items', 'Removed items'];

  const first = 10;
  const query = 'fulfillment_status:UNFULFILLED AND created_date:>';

  const input = { first, query: `${query}${date}` };

  const getPdf = (dd) => {
    return fetch(`${HOST}/pdf`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dd),
    })
  };

  /* pdf labels maybe */
  const createPdf = () => {
    setLabelLoading(true);
    const query = getQuery(checkedIds);
    makePromise(execute(ShopifyHttpLink, { query }))
      .then(data => createDocDefinition({ data, including, addons, removed }))
      .then(dd => getPdf(dd))
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url => {
        var link = document.createElement('a');
        link.href = url;
        link.download = `labels-${dateToISOString(new Date())}.pdf`;
        link.click();
        setLabelLoading(false);
      })
      .catch(err => console.log(err));
  };

  const onHoverRow = (e) => {
    console.log('hover', e.target);
  };

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
                      <LineItemProductList list={customAttributes[including]} />,
                      <LineItemProductList list={customAttributes[addons]} />,
                      <LineItemProductList list={customAttributes[removed]} />,
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

        const headers = [
          <Checkbox 
            id='all'
            label='Select/deselect all'
            labelHidden={true}
            onChange={handleCheckAll}
            checked={checkedIds.length > 0}
          />,
          'Box',
          'Delivery',
          'Including',
          'Extras',
          'Removed',
          'Address',
        ];

        return (
          <React.Fragment>
            <div style={{ padding: '1.6rem' }}>
              <ButtonGroup segmented >
                <Button
                  disabled={checkedIds.length == 0}
                  onClick={createPdf}
                  loading={ labelLoading }
                >
                  Labels
                </Button>
                <DateRangeSelector handleDateChange={handleDateChange} disabled={ Boolean(isLoading) } />
              </ButtonGroup>
            </div>
            { isError && isError } 
            { isLoading ? isLoading :
              <React.Fragment>
              <table style={{ width: '100%', borderTop: '0.1rem solid rgb(196, 205, 213)' }}>
                <thead style={{ borderBottom: '0.1rem solid rgb(196, 205, 213)' }}>
                  <tr style={{ borderBottom: '0.1rem solid rgb(196, 205, 213)' }}>
                    { headers.map(cell => <th style={{ borderBottom: '0.1rem solid rgb(196, 205, 213)' }}>{ cell }</th>) }
                  </tr>
                </thead>
                <tbody>
                  { rows.map((row) => <tr>{ row.map(cell => <td>{ cell }</td>) }</tr> )}
                </tbody>
              </table>
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
              </React.Fragment>
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

