import React, { useState, useCallback } from 'react';
import {
  Button,
  DatePicker,
  EmptyState,
  Frame,
  Heading,
  Popover,
  Layout,
  Page,
  Stack,
  Sheet,
  Icon,
  TextContainer,
  TextStyle,
} from '@shopify/polaris';
import {
  MobileCancelMajorMonotone,
} from '@shopify/polaris-icons';
import { printCache } from '../components/common/ShowCache';
import SheetHelper from '../components/common/SheetHelper';
import BoxList from '../components/boxes/BoxList';
import BoxAdd from '../components/boxes/BoxAdd';
import ProductList from '../components/products/ProductList';

export default function Boxes() {

  const [sheetActive, setSheetActive] = useState(false);
  const toggleSheetActive = useCallback(() => setSheetActive(!sheetActive), [sheetActive]);

  const [sheetTitle, setSheetTitle] = useState('Add Box');

  const toggleSheet = (title) => {
    setSheetTitle(title);
    toggleSheetActive();
  }

  return (
    <Frame>
      <Page
        title="Boxes"
        primaryAction={{
          content: 'Add Box',
          onAction: () => toggleSheet('Add Box'),
        }}
        secondaryActions={[
          {
            content: 'View Products',
            onAction: () => toggleSheet('View Products'),
          },
          {
            content: 'Show Cache',
            onAction: () => printCache(),
          },
        ]}
      >
        <Sheet open={sheetActive} onClose={toggleSheetActive}>
          <SheetHelper title={sheetTitle} toggle={toggleSheetActive}>
            { sheetTitle === 'Add Box' ?
              <BoxAdd onComplete={toggleSheetActive} />
              :
              <ProductList onComplete={toggleSheetActive} />
            }
          </SheetHelper>
        </Sheet>
        <Layout>
        <Layout.Section>
          <BoxList addBox={() => toggleSheet('Add Box')}/>
        </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}

