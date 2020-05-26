import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Loading,
  Sheet,
  Stack,
  TextContainer,
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import LocalClient from '../../LocalClient';
import { DELETE_BOX, GET_BOXES } from './queries';

export default function BoxDelete({ box, onComplete }) {

  const shopId = SHOP_ID;

  const updateCacheAfterDelete = (cache, { data } ) => {
    const variables = { shopId };
    const query = GET_BOXES;
    const boxId = data.deleteBox;

    const getBoxes = cache.readQuery({ query, variables }).getBoxes.filter((box) => parseInt(box.id) !== boxId)
    data = { getBoxes };

    cache.writeQuery({ query, variables, data });
  }

  return (
    <Mutation
      client={LocalClient}
      mutation={DELETE_BOX}
      update={updateCacheAfterDelete}
    >
      {(boxDelete, { loading, error, data }) => {

        if (loading) { return <Loading />; }

        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleBoxDelete = () => {
          const boxId = parseInt(box.id);
          const input = { boxId }
          boxDelete({ variables: { input } }).then((value) => {
            onComplete();
          }).catch((error) => {
            console.log('error', error);
          });
        };

        return (
          <Stack vertical>
            <TextContainer>
              This action is irrevesible, are you sure you want to delete {box.name}?
            </TextContainer>
            <ButtonGroup
              segmented
              fullWidth
            >
              <Button
                destructive
                onClick={handleBoxDelete}
              >
                Yes, I'm sure.
              </Button>
              <Button
                primary
                onClick={onComplete}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </Stack>
        );
      }}
    </Mutation>
  );
}

