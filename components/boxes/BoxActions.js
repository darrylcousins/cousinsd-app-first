import React, { useEffect, useState, useCallback } from 'react';
import {
  ActionList,
  Banner,
  Button,
  Popover,
  Spinner,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { LocalApolloClient } from '../../graphql/local-client';
import BoxDelete from './BoxDelete';
import BoxDuplicate from './BoxDuplicate';
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

  /* duplicate modal stuff */
  const [duplicateActive, setDuplicateActive] = useState(false);
  const toggleDuplicateActive = useCallback(
    () => setDuplicateActive((duplicateActive) => !duplicateActive),
    [],
  );
  /* end duplicate modal stuff */

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

  const onDuplicateComplete = () => {
    onComplete();
    toggleDuplicateActive();
    refetch();
  };

  const onDuplicateCancel = () => {
    onComplete();
    toggleDuplicateActive();
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
                    {content: 'Duplicate', onAction: toggleDuplicateActive},
                  ]}
                />
                <BoxDelete
                  open={deleteActive}
                  box={box}
                  onComplete={onDeleteComplete}
                  onCancel={onDeleteCancel}
                />
                <BoxDuplicate
                  open={duplicateActive}
                  box={box}
                  onComplete={onDuplicateComplete}
                  onCancel={onDuplicateCancel}
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
