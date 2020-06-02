import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Card,
  DataTable,
  DatePicker,
  EmptyState,
  Frame,
  Heading,
  Popover,
  Layout,
  Loading,
  Page,
  Stack,
  Sheet,
  Icon,
  Tabs,
  TextContainer,
  TextStyle,
} from '@shopify/polaris';
import {
  MobileCancelMajorMonotone,
} from '@shopify/polaris-icons';
import { Query, Mutation } from 'react-apollo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LocalClient } from '../LocalClient';
import { printCache } from '../components/common/ShowCache';
import SheetHelper from '../components/common/SheetHelper';
import ProductList from '../components/products/ProductList';
import BoxList from '../components/boxes/BoxList';
import BoxAdd from '../components/boxes/BoxAdd';

export default function Index() {

  const [tabSelected, setTabSelected] = useState(0);
  const handleTabChange = useCallback(
        (selectedTabIndex) => setTabSelected(selectedTabIndex),
        [],
      );

  const tabs = [
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

  /* sheet stuff */
  const [sheetActive, setSheetActive] = useState(false);
  const toggleSheetActive = useCallback(() => setSheetActive(!sheetActive), [sheetActive]);

  const toggleSheet = (title) => {
    toggleSheetActive();
  }
  /* end sheet stuff */


  return (
    <Frame>
      <Page
        title={tabs[tabSelected].content}
        primaryAction={{
          content: 'Add Box',
          onAction: () => toggleSheetActive(),
        }}
        secondaryActions={[
          {
            content: 'Show Cache',
            onAction: () => printCache(),
          },
        ]}
      >
        <Sheet open={sheetActive} onClose={toggleSheetActive}>
          <SheetHelper title='Add Box' toggle={toggleSheetActive}>
            <BoxAdd onComplete={toggleSheetActive} />
          </SheetHelper>
        </Sheet>
        <Card>
          <Tabs tabs={tabs} selected={tabSelected} onSelect={handleTabChange}>
            { tabSelected === 0 && <BoxList /> }
            { tabSelected === 1 && <ProductList /> }
          </Tabs>
        </Card>
      </Page>
    </Frame>
  );
}
