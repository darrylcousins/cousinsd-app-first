import React, { useState, useCallback } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  Frame,
  Form,
  FormLayout,
  Heading,
  Modal,
  List,
  Spinner,
  TextContainer,
  TextField,
} from '@shopify/polaris';
import fetch from 'isomorphic-fetch';
import { execute } from '@apollo/client';
import { LocalHttpLink } from '../graphql/local-client';
import { OrderSeeder } from '../lib/order-seeder';
import { makePromise } from '../lib';
import { GET_ALL_ORDERS } from '../components/orders/queries';

export default function Index() {

  const ShopId = SHOP_ID;

  /* modal stuff */
  const [modalOpen, setModalOpen] = useState(false);
  /* end modal stuff */

  const toggleModalOpen = useCallback(() => setModalOpen(!modalOpen), [modalOpen]);

  const [customerLoading, setCustomerLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [getCustomerLoading, setGetCustomerLoading] = useState(false);
  const [getWebhooksLoading, setGetWebhooksLoading] = useState(false);
  const [getOrderLoading, setGetOrderLoading] = useState(false);
  const [deleteOrdersLoading, setDeleteOrdersLoading] = useState(false);
  const [getOrderIdLoading, setGetOrderIdLoading] = useState(false);
  const [deleteOrderLoading, setDeleteOrderLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [getOrderId, setGetOrderId] = useState('');

  const handleOrderIdChange = useCallback((value) => setOrderId(value), []);
  const handleGetOrderIdChange = useCallback((value) => setGetOrderId(value), []);

  const postDelete = ({url }) => {
    return fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    })
  };

  const getFetch = ({ url }) => {
    return fetch(url, {
      credentials: 'include',
    })
  };

  const asyncPostFetch = async ({ data, url }) => {
    return await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
  };

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
        setOrderId('');
      })
      .catch(err => {
        console.log(err);
        setDeleteOrderLoading(false);
      })
  };

  const handleOrderGet = (e) => {
    setGetOrderLoading(true);
    console.log(getOrderId);
    const url = `${HOST}/api/orders/${getOrderId}`;
    console.log(url);
    getFetch({ url })
      .then(res => {
        console.log(res.status, res.statusText);
        return res.json();
      })
      .then(json => {
        console.log(JSON.stringify(json, null, 2));
        setGetOrderLoading(false);
      })
      .catch(err => {
        console.log(err);
        setGetOrderLoading(false);
      })
  };

  const seedCustomers = () => {
    setCustomerLoading(true);
    const { customers } = require(`../shopify_seeders/customers/customers.json`);
    const url = `${HOST}/api/customers`;
    const task = (i) => {
      setTimeout(() => {
        console.log('every half sec', i);
        const customer = customers[i];
        const data = JSON.stringify({ customer });
        postFetch({ data, url })
          .then(res => {
            console.log(res.status, res.statusText);
            return res.json();
          })
          .then(json => {
            console.log(json.customer.email);
            setCustomerLoading(false);
          })
          .catch(err => {
            console.log(err);
            setCustomerLoading(false);
          })
      }, 600 * i);
    };
    for (let i=0; i<customers.length; i++) {
      task(i);
    }
    return false;
  };

  const seedOrders = () => {
    setOrderLoading(true);
    const url = `${HOST}/api/orders`;
    OrderSeeder()
      .then((orders) => {
        const task = (i) => {
          const data = {
            order: orders[i]
          };
          setTimeout(() => {
            console.log(data.order.email, data.order.user_id);
            postFetch({ data: JSON.stringify(data), url })
              .then(res => {
                return res.json();
              })
              .then(json => {
                console.log(i, json.order.email);
              });
          }, 30000 * i);
        };
        for (let i=0; i<orders.length; i++) {
          task(i);
        }
        setOrderLoading(false);
      })
      .then(() => {
      });

    return false;
  };

  const deleteOrders = () => {
    setDeleteOrdersLoading(true);
    toggleModalOpen(false);
    console.log('Deleting all orders');
    const variables = { input: { ShopId } };
    makePromise(execute(LocalHttpLink, { query: GET_ALL_ORDERS, variables }))
      .then(({ data }) => {
        const orderIds = data.getAllOrders.map(el => el.shopify_order_id);
        console.log(orderIds);
        return orderIds;
      })
      .then((orderIds) => {
        const task = (i) => {
          setTimeout(() => {
            console.log('every half sec', i);
            const orderId = orderIds[i];
            const url = `${HOST}/api/orders/${orderId}`;
            postDelete({ url })
              .then(res => {
                console.log(res.status, res.statusText);
                return res.json();
              })
              .then(json => {
                console.log(json);
                setDeleteOrderLoading(false);
                setOrderId('');
              })
              .catch(err => {
                console.log(err);
                setDeleteOrdersLoading(false);
              })
          }, 600 * i);
        };

        for (let i=0; i<orderIds.length; i++) {
          task(i);
        }
      })
      .then(() => {
        setDeleteOrdersLoading(false);
      });

    return false;
  };

  const getWebhooks = () => {
    setGetWebhooksLoading(true);
    const url = `${HOST}/api/webhooks`;
    getFetch({ url })
      .then(res => res.json())
      .then(json => {
        console.log(JSON.stringify(json, null, 2));
        setGetWebhooksLoading(false);
      })
      .catch(err => {
        console.log(err);
        setGetWebhooksLoading(false);
      })
    return false;
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
              <Button
                onClick={getWebhooks}
                loading={getWebhooksLoading}
              >Get webhooks</Button>
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
            <Heading>Delete all</Heading>
            <ButtonGroup segmented>
              <Button
                onClick={() => setModalOpen(true)}
                loading={deleteOrdersLoading}
              >Delete all orders</Button>
            </ButtonGroup>
          </div>
          <div style={{ padding: '1em' }}>
            <Form onSubmit={handleOrderGet}>
              <FormLayout>
                <Heading>Get Order</Heading>
                <TextField
                  value={getOrderId}
                  placeholder='Order id to get'
                  onChange={handleGetOrderIdChange}
                  label="Order Id"
                  type="number"
                  helpText={
                    <span>
                      Enter order id to get
                    </span>
                  }
                />
                <Button
                  submit
                  loading={getOrderIdLoading}
                >Get Order</Button>
              </FormLayout>
            </Form>
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
      <Modal
        open={modalOpen}
        onClose={toggleModalOpen}
        title={`Are you sure you want to delete all orders?`}
        primaryAction={{
          content: "Yes, I'm sure",
          onAction: deleteOrders,
          destructive: true,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: toggleModalOpen,
          },
        ]}
      >
        <Modal.Section>
            <TextContainer>
              <p>
                Deleting all orders. 
                This action cannot be undone.
              </p>
            </TextContainer>
        </Modal.Section>
      </Modal>
    </Frame>
  );
}
