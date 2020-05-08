import React, {useCallback, useRef, useState} from 'react';
import {
  Frame,
  Layout,
  Page,
  Card,
  Loading,
  TextContainer,
  SkeletonPage,
  SkeletonDisplayText,
  SkeletonBodyText,
} from '@shopify/polaris';
import LoadingPageMarkup from '../components/common/LoadingPageMarkup';
import ScriptTagModify from '../components/scripttags/ScriptTagModify';

export default function ScriptTags() {

  const [isLoading, setIsLoading] = useState(false);

  const toggleIsLoading = useCallback(
    () => setIsLoading((isLoading) => !isLoading),
    [],
  );

  const loadingMarkup = isLoading ? <Loading /> : null;

  const actualPageMarkup = (
    <Page title="ScriptTags">
      <Layout>
        <ScriptTagModify />
      </Layout>
    </Page>
  );

  const pageMarkup = isLoading ? LoadingPageMarkup : actualPageMarkup;

  return (
    <Frame>
      {loadingMarkup}
      {pageMarkup}
    </Frame>
  );
}
