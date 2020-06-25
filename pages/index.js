import React, { useState, useCallback } from 'react';
import {
  Banner,
  Card,
  Frame,
  Loading,
  Page,
  Tabs,
} from '@shopify/polaris';
import {
  TitleBar,
} from '@shopify/app-bridge-react';
import {
  MobileCancelMajorMonotone,
} from '@shopify/polaris-icons';
import { Query } from 'react-apollo';
import { LocalApolloClient } from '../graphql/local-client';
import { printCache } from '../components/common/ShowCache';
import ProductList from '../components/products/ProductList';
import BoxList from '../components/boxes/BoxList';
import OrderList from '../components/orders/OrderList';
import {
  GET_SHOP,
} from '../components/shop/queries';

export default function Index() {

  const ShopId = SHOP_ID;
  const [addBox, setAddBox] = useState(false);
  const toggleAddBox = useCallback(() => setAddBox(!addBox), [addBox]);
  const [tabSelected, setTabSelected] = useState(0);
  const handleTabChange = useCallback(
        (selectedTabIndex) => setTabSelected(selectedTabIndex),
        [],
      );

  const tabs = [
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
  ];
  /* end tab stuff */

/*
secondaryActions={[
  {
    content: 'Show Cache',
    onAction: () => printCache(),
  },
]}
*/

  const input = { id: ShopId };
  return (
    <Frame>
        <TitleBar
          title={tabs[tabSelected].content}
          primaryAction={{
            content: 'Add Box',
            onAction: () => toggleAddBox(),
          }}
        />
        <div style={{margin: '2.6rem 3.6rem'}}>
          <Card>
            <Query
              query={GET_SHOP}
              variables={{ input }}
              client={LocalApolloClient}
            >
              {({ loading, error, data }) => {
                if (loading) { return <Loading />; }
                const isError = error && (
                  <Banner status="critical">{error.message}</Banner>
                );
                const { url } = data.getShop;
                return (
                  <React.Fragment>
                    { isError && isError }
                    <Tabs tabs={tabs} selected={tabSelected} onSelect={handleTabChange}>
                      { tabSelected === 0 && <OrderList shopUrl={url} /> }
                      { tabSelected === 1 && <BoxList shopUrl={url} addBox={addBox} toggleAddBox={toggleAddBox}/> }
                      { tabSelected === 2 && <ProductList shopUrl={url} /> }
                    </Tabs>
                  </React.Fragment>
                )
              }}
            </Query>
          </Card>
        </div>
    </Frame>
  );
}
