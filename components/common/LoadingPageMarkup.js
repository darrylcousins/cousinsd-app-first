import React from 'react';
import {
  Layout,
  Card,
  TextContainer,
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
