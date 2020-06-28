import React, { useState, useCallback } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  Frame,
  Form,
  FormLayout,
  Heading,
  List,
  Spinner,
  TextField,
} from '@shopify/polaris';
import fetch from 'node-fetch';

export default function Index() {

  const ShopId = SHOP_ID;

  const [customerLoading, setCustomerLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [getCustomerLoading, setGetCustomerLoading] = useState(false);
  const [getOrderLoading, setGetOrderLoading] = useState(false);
  const [deleteOrderLoading, setDeleteOrderLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const postDelete = ({ data, url }) => {
    return fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    })
  };

  const handleOrderDelete = (e) => {
    setDeleteOrderLoading(true);
    console.log(orderId);
    //setOrderId('');
    const url = `${HOST}/api/orders/${orderId}`;
    console.log(url);
    postDelete({ url })
      .then(res => {
        console.log(res.status, res.statusText);
        return res.json();
      })
      .then(json => {
        console.log(json);
        setDeleteOrderLoading(false);
      })
      .catch(err => {
        console.log(err);
        setDeleteOrderLoading(false);
      })
  };


  const handleOrderIdChange = useCallback((value) => setOrderId(value), []);

  const postFetch = ({ data, url }) => {
    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
  };

  const seedCustomers = () => {
    for (let i=3; i<=4; i++) {
      setCustomerLoading(true);
      let data = require(`../shopify_seeders/customers/${i}.json`);
      data = JSON.stringify(data);
      const url = `${HOST}/api/customers`;
      postFetch({ data, url })
        .then(res => {
          console.log(res.status, res.statusText);
          return res.json();
        })
        .then(json => {
          console.log(JSON.stringify(json, null, 2));
          setCustomerLoading(false);
        })
        .catch(err => {
          console.log(err);
          setCustomerLoading(false);
        })
    }
    return false;
  };

  const seedOrders = () => {
    for (let i=2; i<=2; i++) {
      setOrderLoading(true);
      let data = require(`../shopify_seeders/orders/${i}.json`);
      data = JSON.stringify(data);
      const url = `${HOST}/api/orders`;
      postFetch({ data, url })
        .then(res => {
          console.log(res.status, res.statusText);
          return res.json();
        })
        .then(json => {
          console.log(JSON.stringify(json, null, 2));
          setOrderLoading(false);
        })
        .catch(err => {
          console.log(err);
          setOrderLoading(false);
        })
    }
    return false;
  };

  const getFetch = ({ url }) => {
    return fetch(url, {
      method: 'GET',
      credentials: 'include',
    })
  };

  const getCustomers = () => {
    setGetCustomerLoading(true);
    const url = `${HOST}/api/customers`;
    getFetch({ url })
      .then(res => res.json())
      .then(json => {
        console.log(JSON.stringify(json, null, 2));
        setGetCustomerLoading(false);
      })
      .catch(err => {
        console.log(err);
        setGetCustomerLoading(false);
      })
    return false;
  };

  const getOrders = () => {
    setGetOrderLoading(true);
    const url = `${HOST}/api/orders`;
    getFetch({ url })
      .then(res => res.json())
      .then(json => {
        console.log(JSON.stringify(json, null, 2));
        setGetOrderLoading(false);
      })
      .catch(err => {
        console.log(err);
        setGetOrderLoading(false);
      })
    return false;
  };

  return (
    <Frame>
      <div style={{ padding: '1em' }}>
        <Card>
          <div style={{ padding: '1em' }}>
            <Heading>Getters</Heading>
            <ButtonGroup segmented>
              <Button
                onClick={getCustomers}
                loading={getCustomerLoading}
              >Get customers</Button>
              <Button
                onClick={getOrders}
                loading={getOrderLoading}
              >Get orders</Button>
            </ButtonGroup>
          </div>
          <div style={{ padding: '1em' }}>
            <Heading>Seeders</Heading>
            <ButtonGroup segmented>
              <Button
                disabled
                onClick={seedCustomers}
                loading={customerLoading}
              >Seed customers</Button>
              <Button
                onClick={seedOrders}
                loading={orderLoading}
              >Seed orders</Button>
            </ButtonGroup>
          </div>
          <div style={{ padding: '1em' }}>
            <Form onSubmit={handleOrderDelete}>
              <FormLayout>
                <Heading>Delete Order</Heading>
                <TextField
                  value={orderId}
                  placeholder='Order id to delete'
                  onChange={handleOrderIdChange}
                  label="Order Id"
                  type="number"
                  helpText={
                    <span>
                      Enter order id to delete
                    </span>
                  }
                />
                <Button
                  submit
                  loading={deleteOrderLoading}
                >Delete Order</Button>
              </FormLayout>
            </Form>
          </div>
        </Card>
      </div>
    </Frame>
  );
}
