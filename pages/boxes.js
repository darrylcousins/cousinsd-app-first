import React, {useCallback, useState} from 'react';
import {
  Frame,
  Page,
} from '@shopify/polaris';

export default function Boxes() {
  return (
    <Frame>
      <Page
        title='Edit Boxes'
        primaryAction={{
          content: 'Add Box',
        }}
      >
      </Page>
    </Frame>
  );
}
