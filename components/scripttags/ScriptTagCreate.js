import React, {useState} from 'react';
import {
  Card,
  Banner,
  Loading,
  Layout,
  Form,
  FormLayout,
  TextField,
  Select,
  Button,
  ButtonGroup,
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import LoadingPageMarkup from '../common/LoadingPageMarkup';
import { INSTALL_SCRIPTTAG, GET_SCRIPTTAGS } from './queries';

export default function ScriptTagCreate({ setShowCreateForm, displayToast }) {
  const [src, setSrc] = useState('https://68331e1c.ngrok.io/products.js');
  const [displayScope, setDisplayScope] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  const loadingMarkup = isLoading ? <Loading /> : null;

  // update cache after adding script tag
  const updateCacheAfterCreate = (cache, { data: { scriptTagCreate } }) => {
    const { scriptTags } = cache.readQuery({ query: GET_SCRIPTTAGS })

    cache.writeQuery({
      query: GET_SCRIPTTAGS,
      data: {
        scriptTags: {
          edges: scriptTags.edges.concat(
            [{
              node: scriptTagCreate.scriptTag,
              __typename: 'ScriptTagEdge'
            }]
          ),
          __typename: 'ScriptTagConnection'
        }
      }
    });

    setShowCreateForm(false);
    displayToast('ScriptTag Created');
  }

  const actualPageMarkup = (
    <Card
      title="Add Script Tag"
      sectioned
      >
      <Mutation
        mutation={INSTALL_SCRIPTTAG}
        update={updateCacheAfterCreate}
      >
        {(handleSubmit, { loading, error, data }) => {
          const showError = error && (
            <Banner status="critical">{error.message}</Banner>
          );
          const showUserError = data && data.scriptTagCreate && data.scriptTagCreate.userErrors.length > 0 && ( 
            <Banner status="critical">{data.scriptTagCreate.userErrors[0].message}</Banner>
          );
          return (
            <React.Fragment>
              {showError}
              {showUserError}
              <Form>
                <Card sectioned>
                  <FormLayout>
                    <FormLayout.Group>
                      <Select
                        label="Display Scope"
                        options={[
                          {label: 'All', value: 'ALL'},
                          {label: 'Online Store', value: 'ONLINE_STORE'},
                          {label: 'Order Status', value: 'ORDER_STATUS'},
                        ]}
                        value={displayScope}
                        onChange={(selected) => setDisplayScope(selected)}
                        />
                      <TextField
                        prefix=""
                        value={src}
                        label="Src"
                        type="src"
                        onChange={(value) => setSrc(value)}
                        error={
                          data &&
                          data.scriptTagCreate &&
                          data.scriptTagCreate.userErrors.length > 0 &&
                          data.scriptTagCreate.userErrors[0].field[1] == 'src' &&
                          data.scriptTagCreate.userErrors[0].message
                          }
                      />
                    </FormLayout.Group>
                  </FormLayout>
                </Card>
                <ButtonGroup fullWidth={true} segmented={true} connectedTop={true}>
                  <Button
                    primary
                    loading={loading}
                    onClick={() => {
                      const scriptTagInput = {
                        displayScope: displayScope,
                        src: src,
                      };
                      handleSubmit({
                        variables: { input: scriptTagInput },
                      });
                    }}
                  >
                    Save
                  </Button>
                </ButtonGroup>
              </Form>
            </React.Fragment>
          );
        }}
      </Mutation>
    </Card>
  );

  const pageMarkup = isLoading ? LoadingPageMarkup : actualPageMarkup;

  return (
    <Layout.Section>
      {loadingMarkup}
      {pageMarkup}
    </Layout.Section>
  );
}

