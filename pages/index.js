import React, {useCallback, useState} from 'react';
import {
  Frame,
  Page,
} from '@shopify/polaris';

export default function Index() {
  return (
    <Frame>
      <Page
        title='App Index'
        primaryAction={{
          content: 'Edit Boxes',
        }}
      >
      </Page>
    </Frame>
  );
}
