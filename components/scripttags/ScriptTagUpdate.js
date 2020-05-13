import React, {useState} from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  Form,
  FormLayout,
  Loading,
  Select,
  TextField,
} from '@shopify/polaris';
import { Query } from 'react-apollo';
import { Mutation } from 'react-apollo';
import LoadingTextMarkup from '../common/LoadingTextMarkup';
import { UPDATE_SCRIPTTAG, GET_SCRIPTTAGS, GET_SCRIPTTAG } from './queries';

export default function ScriptTagUpdate({id, setShowUpdateForm, displayToast}) {

  function ScriptTagUpdateForm(props) {
    const id = props.id;
    const [src, setSrc] = useState(props.src);
    const [displayScope, setDisplayScope] = useState(props.displayScope);

    // update cache after updating script tag
    const updateCacheAfterUpdate = (cache, { data: { scriptTagUpdate } }) => {
      const { scriptTags } = cache.readQuery({ query: GET_SCRIPTTAGS })

      const edges = scriptTags.edges.filter(nodes => nodes.node.id !== scriptTagUpdate.scriptTag.id);

      cache.writeQuery({
        query: GET_SCRIPTTAGS,
        data: {
          scriptTags: {
            edges: edges.concat(
              [{
                node: scriptTagUpdate.scriptTag,
                __typename: 'ScriptTagEdge'
              }]
            ),
            __typename: 'ScriptTagConnection'
          }
        }
      });

      setShowUpdateForm(false);
      displayToast('ScriptTag Updated');

    }

    return (
        <Mutation
          mutation={UPDATE_SCRIPTTAG}
          update={updateCacheAfterUpdate}
        >
          {(handleSubmit, { loading, error, data }) => {
            const showError = error && (
              <Banner status="critical">{error.message}</Banner>
            );
            const showUserError = data && data.scriptTagUpdate && data.scriptTagUpdate.userErrors.length > 0 && ( 
              <Banner status="critical">{data.scriptTagUpdate.userErrors[0].message}</Banner>
            );
            const displayLoading = loading && <Loading />;
            return (
              <React.Fragment>
                {displayLoading}
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
                            data.scriptTagUpdate &&
                            data.scriptTagUpdate.userErrors.length > 0 &&
                            data.scriptTagUpdate.userErrors[0].field[1] == 'src' &&
                            data.scriptTagUpdate.userErrors[0].message
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
                          variables: { id: id, input: scriptTagInput },
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
    );
  }

  return (
    <React.Fragment>
      <Card
        title="Update Script Tag"
        sectioned
        >
        <Query query={GET_SCRIPTTAG} variables={{ id }}>
          {({ data, loading, error }) => {
            if (loading) { return <React.Fragment><Loading /><LoadingTextMarkup /></React.Fragment>; }
            if (error) { return <Banner status="critical">{error.message}</Banner>; }
            const { src, displayScope } = data.scriptTag;
            return (
              <ScriptTagUpdateForm id={id} src={src} displayScope={displayScope} />
            );
          }}
        </Query>
      </Card>
    </React.Fragment>
  );
}

