import React from 'react';
import {
  Layout,
  Card,
  TextContainer,
  SkeletonDisplayText,
  SkeletonBodyText,
  Spinner,
} from '@shopify/polaris';

export const LoadingPageMarkup () => {
  return (
    <Layout>
      <Layout.Section>
        <Card sectioned subdued >
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={9} />
          </TextContainer>
        </Card>
      </Layout.Section>
    </Layout>
  );
}
