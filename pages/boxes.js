import React, { useState, useCallback } from 'react';
import {
  Button,
  Frame,
  Heading,
  Layout,
  Page,
  Sheet,
  Icon,
} from '@shopify/polaris';
import {
  MobileCancelMajorMonotone,
} from '@shopify/polaris-icons';
import SheetHelper from '../components/common/SheetHelper';
import BoxList from '../components/boxes/BoxList';
import BoxAdd from '../components/boxes/BoxAdd';

export default function Boxes() {

  const [sheetActive, setSheetActive] = useState(false);
  const toggleSheetActive = useCallback(() => setSheetActive(!sheetActive), [sheetActive]);

  return (
    <Frame>
      <Page
        title="Boxes"
        primaryAction={{
          content: 'Add Box',
          onAction: toggleSheetActive,
        }}
      >
        <Sheet open={sheetActive} onClose={toggleSheetActive}>
          <SheetHelper title="Add Box" toggle={toggleSheetActive}>
            <BoxAdd onComplete={toggleSheetActive} />
          </SheetHelper>
        </Sheet>
        <Layout>
          <BoxList />
        </Layout>
      </Page>
    </Frame>
  );
}

