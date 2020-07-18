import React, { useState, useCallback } from 'react';
import { useParams, BrowserRouter, Route, Link, Switch, useHistory } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Card, Tabs, EmptyState } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import OrderListWrapper from '../components/orders/OrderListWrapper';
import BoxList from '../components/boxes/BoxList';
import SubscriberList from '../components/subscriptions/SubscriberList';
import SubscriptionDetail from '../components/subscriptions/SubscriptionDetail';
import ProductList from '../components/products/ProductList';

/* tab stuff */
const tabs = [
  {
    id: 'home',
    content: 'Home',
    accessibilityLabel: 'Home',
    panelID: 'home',
  },
  {
    id: 'orders',
    content: 'Orders',
    accessibilityLabel: 'Orders',
    panelID: 'orders',
  },
  {
    id: 'boxes',
    content: 'Boxes',
    accessibilityLabel: 'Boxes',
    panelID: 'boxes',
  },
  { 
    id: 'products',
    content: 'Produce',
    accessibilityLabel: 'Produce',
    panelID: 'products',
  },
  { 
    id: 'subscribers',
    content: 'Subscribers',
    accessibilityLabel: 'Subscribers',
    panelID: 'subscribers',
  },
];
/* end tab stuff */

function Index() {
  return (
    <>
      <TitleBar title='Veggies Boxes' />
      <Card>
        <EmptyState
          heading="Manage veggie boxes on store"
          action={{content: 'View boxes'}}
          secondaryAction={{content: 'View orders'}}
          image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
          fullWidth={true}
          centeredLayout={false}
        >
          <p>Some content for home page</p>
        </EmptyState>
      </Card>
    </>
  );
}

function Orders() {
  return (
    <>
      <TitleBar title='Orders' />
      <Card><OrderListWrapper /></Card>
    </>
  );
}

function Boxes() {
  return (
    <>
      <TitleBar title='Boxes' />
      <Card><BoxList /></Card>
    </>
  );
}

function Subscriptions() {
  return (
    <>
      <TitleBar title='Subscriptions' />
      <Card><SubscriberList /></Card>
    </>
  );
}

function Products() {
  return (
    <>
      <TitleBar title='Products' />
      <Card><ProductList /></Card>
    </>
  );
}

function NotFound() {
  return (
    <>
      <TitleBar title='404' />
      <Card><h1>Not found</h1></Card>
    </>
  );
}

function Subscription() {

  const { uid } = useParams();
  console.log(uid);

  return (
    <>
      <TitleBar title='Subscription' />
      <Card><SubscriptionDetail uid={uid} /></Card>
    </>
  );
}

function App(props) {

  const [tabSelected, setTabSelected] = useState(0);
  const history = useHistory();

  const handleTabSelect = (e) => {
    setTabSelected(e);
    if (e === 0) {
      history.push(`/`);
    } else {
      history.push(`/${tabs[e].id}`);
    }
  };

  return(
    <>
    <Tabs tabs={tabs} selected={tabSelected} onSelect={handleTabSelect}>
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/orders" component={Orders} />
        <Route path="/boxes" component={Boxes} />
        <Route path="/products" component={Products} />
        <Route path="/subscribers" component={Subscriptions} />
        <Route path="/subscription/:uid" component={Subscription} />
        <Route component={NotFound}/>
      </Switch>
    </Tabs>
    </>
  );
}

export default App;
