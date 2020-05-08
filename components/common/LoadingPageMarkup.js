import React, {useCallback, useRef, useState} from 'react';
import {
  Layout,
  Card,
  TextContainer,
  SkeletonPage,
  SkeletonDisplayText,
  SkeletonBodyText,
} from '@shopify/polaris';

export default function LoadingPageMarkup() {
  return (
    <Layout>
      <Layout.Section>
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={9} />
          </TextContainer>
        </Card>
      </Layout.Section>
    </Layout>
  );
}
