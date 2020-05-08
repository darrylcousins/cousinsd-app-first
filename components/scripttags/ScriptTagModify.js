import React, {useCallback, useRef, useState} from 'react';
import {
  Card,
  Button,
  ButtonGroup,
  OptionList,
  Stack,
  TextStyle,
  Banner,
  Frame,
  Page,
  PageActions,
  Loading,
  Layout,
  TextContainer,
  Toast,
  EmptyState,
} from '@shopify/polaris';
import { Query } from 'react-apollo';
import { Mutation } from 'react-apollo';
import LoadingTextMarkup from '../common/LoadingTextMarkup';
import LoadingPageMarkup from '../common/LoadingPageMarkup';
import ScriptTagUpdate from './ScriptTagUpdate';
import ScriptTagCreate from './ScriptTagCreate';
import { DELETE_SCRIPTTAG, GET_SCRIPTTAGS } from './queries';

export default function ScriptTagModify() {
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const toggleIsLoading = useCallback(
    () => setIsLoading((isLoading) => !isLoading),
    [],
  );

  const loadingMarkup = isLoading ? <Loading /> : null;

  // update form
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  // add form
  const [showCreateForm, setShowCreateForm] = useState(false);

  // toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // callback to display toast messages
  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    // assume actions completed
    setSelected([]);
  }

  const toastReveal = showToast && toastMessage && (
    <Toast
      content={toastMessage}
      onDismiss={() => {
        setShowToast(false);
        setToastMessage('');
      }}
    />
  );

  // deleting state and methods
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteScriptTag = (scriptTagDelete) => {
    console.log(selected);
    setIsDeleting(true);
    scriptTagDelete({ variables: { id: selected[0] } });
  }

  // selected item state and methods
  const [selected, setSelected] = useState([]);

  // update cache after delete
  const updateCacheAfterDelete = (cache, { data: { scriptTagDelete } }) => {
    const { scriptTags } = cache.readQuery({ query: GET_SCRIPTTAGS })

    cache.writeQuery({
      query: GET_SCRIPTTAGS,
      data: {
        scriptTags: {
          edges: scriptTags.edges.filter(nodes => nodes.node.id !== scriptTagDelete.deletedScriptTagId),
          __typename: 'ScriptTagConnection'
        }
      }
    })
    // remove selection
    displayToast('ScriptTag Deleted');
  }

  // when not loading
  const listScriptTagsMarkup = (
    <React.Fragment>
      <Card
        title="Installed Script Tags"
        sectioned
        >
        <Query query={GET_SCRIPTTAGS}>
          {({ data, loading, error }) => {
            if (loading) { return <React.Fragment><Loading /><LoadingTextMarkup /></React.Fragment>; }
            if (error) { return <Banner status="critical">{error.message}</Banner>; }
            const items = data.scriptTags.edges.map(({ node }) => ({
              value: node.id,
              label: `${node.id.padEnd(40)} (${node.src}  ${node.displayScope.padEnd(15)} )`
            }));
            if (items.length) {
              return (
                <Card>
                  <OptionList
                    onChange={setSelected}
                    selected={selected}
                    allowMultiple={false}
                    options={items}
                  />
                </Card>
              );
            } else {
              return (
                <EmptyState>
                  <p>No installed script tags here.</p>
                </EmptyState>
              );
            }
          }}
        </Query>
        { selected.length ?
          <React.Fragment>
            <ButtonGroup fullWidth={true} segmented={true} connectedTop={true}>
              <Button
                primary
                onClick={() => setShowUpdateForm(true)}
              >
                Change
              </Button>
              <Mutation
                  mutation={DELETE_SCRIPTTAG}
                  variables={{id: selected[0]}}
                  update={updateCacheAfterDelete}
              >
                {(scriptTagDelete, { loading, error }) => {
                  return (
                    <Button
                      destructive
                      loading={loading}
                      onClick={() => scriptTagDelete(deleteScriptTag)}
                    >
                      Delete
                    </Button>
                  );
                }}
              </Mutation>
            </ButtonGroup>
          </React.Fragment>
          :
          <React.Fragment />
        }
      </Card>
      { showUpdateForm ?
        <ScriptTagUpdate
          id={selected[0]}
          setShowUpdateForm={setShowUpdateForm}
          displayToast={displayToast}
        /> : <React.Fragment /> }
      { showCreateForm ? (
        <ScriptTagCreate
          id={selected[0]}
          setShowCreateForm={setShowCreateForm}
          displayToast={displayToast}
        />
      ) : (
        <PageActions
          primaryAction={[
            {
              content: 'Add New ScriptTag',
              onAction: () => setShowCreateForm(true),
            },
          ]}
        />
      )}
    </React.Fragment>
  );

  const pageMarkup = isLoading ? LoadingPageMarkup : listScriptTagsMarkup;

  return (
    <React.Fragment>
      <Layout.Section>
        {toastReveal}
        {loadingMarkup}
        {pageMarkup}
      </Layout.Section>
    </React.Fragment>
  );
}
