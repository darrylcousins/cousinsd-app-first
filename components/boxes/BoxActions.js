import React, { useEffect, useState, useCallback } from 'react';
import {
  ActionList,
  Banner,
  Button,
  Loading,
  Popover,
  Spinner,
} from '@shopify/polaris';
import { Query } from 'react-apollo';
import { LocalApolloClient } from '../../graphql/local-client';
import SheetHelper from '../common/SheetHelper';
import BoxDelete from './BoxDelete';
import { 
  GET_BOX,
} from './queries';

export default function BoxActions({ checked, checkedId, onComplete, refetch }) {

  /* is an item checked and what is that id */
  const [active, setActive] = useState(checked);
  const [id, setId] = useState(checkedId);

  useEffect(() => {
    setActive(checked);
    setId(checkedId);
  }, [checked, checkedId])
  /* end is an item checked and what is that id */

  /* delete modal stuff */
  const [deleteActive, setDeleteActive] = useState(false);
  const toggleDeleteActive = useCallback(
    () => setDeleteActive((deleteActive) => !deleteActive),
    [],
  );
  /* end delete modal stuff */

  /* action actions stuff */
  const [actionsActive, setActionsActive] = useState(false);
  const toggleActionsActive = useCallback(
    () => setActionsActive((actionsActive) => !actionsActive),
    [],
  );
  /* end action actions stuff */

  const onDeleteComplete = () => {
    onComplete();
    toggleDeleteActive();
    refetch();
  };

  const onDeleteCancel = () => {
    onComplete();
    toggleDeleteActive();
  };

  const activator = (
    <Button
      onClick={toggleActionsActive}
      disabled={!active}
      disclosure
    >
        Actions
    </Button>
  );

  return (
    <React.Fragment>
      <Popover
        active={actionsActive}
        activator={activator}
        onClose={toggleActionsActive}
      >
      { id > 0 &&
        <Query
          query={GET_BOX}
          variables={{ input: { id } }}
          client={LocalApolloClient}
        >
          {({ loading, error, data }) => {
            if (loading) { return <Spinner size='small' />; }
            if (error) { return (
              <Banner status="critical">{error.message}</Banner>
            )}
            const box = data.getBox;
            //console.log(box);
            return (
              <React.Fragment>
                <ActionList
                  items={[
                    {content: 'Delete', onAction: toggleDeleteActive},
                  ]}
                />
                <BoxDelete
                  open={deleteActive}
                  box={box}
                  onComplete={onDeleteComplete}
                  onCancel={onDeleteCancel}
                />
              </React.Fragment>
            )
          }}
        </Query>
      }
      </Popover>
    </React.Fragment>
  );
}
