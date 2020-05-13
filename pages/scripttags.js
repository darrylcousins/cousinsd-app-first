import {
  Frame,
  Layout,
  Page,
} from '@shopify/polaris';
import ScriptTagModify from '../components/scripttags/ScriptTagModify';

export default function ScriptTags() {

  return (
    <Frame>
      <Page title="ScriptTags">
        <Layout>
          <ScriptTagModify />
        </Layout>
      </Page>
    </Frame>
  );
}
