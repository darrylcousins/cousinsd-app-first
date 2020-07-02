import React, { useEffect, useState, useCallback } from 'react';
import fetch from 'node-fetch';
import {
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  DataTable,
  EmptyState,
  Heading,
  Layout,
  Loading,
  TextStyle,
} from '@shopify/polaris';
import { execute, makePromise } from 'apollo-link';
import { useQuery } from '@apollo/react-hooks';
import { ShopifyHttpLink } from '../../graphql/shopify-client';
import { LocalApolloClient, LocalHttpLink } from '../../graphql/local-client';
import { dateToISOString } from '../../lib';
import DateSelector from '../common/DateSelector';
import OrderList from './OrderList';
import createDocDefinition from './docdefinition';
import { getQuery } from './shopify-queries';
import { GET_ORDERS, GET_ORDER_DATES } from './queries';
import { GET_SELECTED_DATE } from '../boxes/queries';
import './order.css';

export default function OrderListWrapper({ shopUrl }) {

  const ShopId = SHOP_ID;

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalApolloClient });
  const [delivered, setDelivered] = useState(data.selectedDate);
  const [labelLoading, setLabelLoading] = useState(false);
  const [fulfillmentLoading, setFulfillmentLoading] = useState(false);
  const [delivery_date, including, addons, removed] = LABELKEYS;

  /* checkbox stuff */
  const [checkedIds, setCheckedIds] = useState([]);
  const [ids, setIds] = useState([]);
  const [dates, setDates] = useState([]);

  const handleCheckedChange = useCallback((newChecked, id) => {
    if (newChecked) {
      setCheckedIds(checkedIds.concat([id]));
    } else {
      setCheckedIds(checkedIds.filter(el => el != id));
    }
    }, [checkedIds]);

  const handleCheckAll = useCallback((checked, value) => {
    if (checked) setCheckedIds(ids);
    if (!checked) setCheckedIds([]);
  }, [ids, checkedIds]);
  /* end checkbox stuff */

  /* query stuff */
  const [query, setQuery] = useState(null);
  const [input, setInput] = useState({ ShopId, delivered });

  /* absolutely vital, collect this data before anything else */
  useEffect(() => {
    makePromise(execute(LocalHttpLink, { query: GET_ORDERS, variables: { input } }))
      .then(async response => {
        const res = await response;
        const orderids = res.data.getOrders.map(el => el.shopify_order_id);
        if (orderids.length > 0) {
          setQuery(getQuery(orderids));
          setIds(orderids.map(el => el.toString()));
        } else {
          setQuery(null);
          setIds([]);
        }
      })
      .catch(error => {
        console.log('get orders errors:', error);
      });
  }, [input]);

  useEffect(() => {
    makePromise(execute(LocalHttpLink, { query: GET_ORDER_DATES }))
      .then(async response => {
        const res = await response;
        setDates(res.data.getOrderDates.map(el => ({ delivered: el.delivered, count: el.count })));
      })
      .catch(error => {
        console.log('get date errors:', error);
      })
  }, []);
  /* end query stuff */

  /* pdf labels */
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

  const createPdf = () => {
    setLabelLoading(true);
    const query = getQuery(checkedIds);
    makePromise(execute(ShopifyHttpLink, { query }))
      .then(data => createDocDefinition({ data, delivered }))
      .then(dd => getPdf(dd))
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url => {
        var link = document.createElement('a');
        link.href = url;
        link.download = `labels-${dateToISOString(new Date())}.pdf`;
        link.click();
        setLabelLoading(false);
        handleCheckAll(false)
      })
      .catch(err => console.log(err));
  };
  /* end pdf labels */

  const handleDateChange = (date) => {
    console.log('handle date change', date)
    setDelivered(date);
    setInput({ ShopId, delivered: date });
  };

  /* checkboxes for the list */
  const checkbox = (
    <Checkbox 
      id='all'
      label='Select/deselect all'
      labelHidden={true}
      onChange={handleCheckAll}
      checked={checkedIds.length > 0}
    />
  );

  const LineCheckbox = ({ id, name }) => {
    return (
      <Checkbox 
        id={id}
        label={name}
        labelHidden={true}
        onChange={handleCheckedChange}
        checked={checkedIds.indexOf(id) > -1}
      />
    );
  };
  /* end checkboxes for the list */

  return (
    <React.Fragment>
      <div style={{ padding: '1.6rem' }}>
        <ButtonGroup segmented >
          <Button
            disabled={checkedIds.length == 0}
            primary={checkedIds.length > 0}
            onClick={createPdf}
            loading={labelLoading}
          >
            Print Labels
          </Button>
          <DateSelector 
            handleDateChange={handleDateChange}
            dates={dates}
            //disabled={ Boolean(isLoading) }
          />
        </ButtonGroup>
      </div>
      { query ? (
        <OrderList 
          shopUrl={shopUrl}
          input={input}
          checkbox={checkbox}
          LineCheckbox={LineCheckbox}
          query={query} />
      ) : (
        <div className='emptystate'>
          <h5>{`No box orders for delivery on ${delivered}.`}</h5>
          <ul>
            <li>
              Have boxes been created for { delivered }?
            </li>
            <li>
              Are there any orders for delivery on { delivered }?
            </li>
          </ul>
        </div>
      )}
    </React.Fragment>
  );
}


