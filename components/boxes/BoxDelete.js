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
import { useQuery } from '@apollo/react-hooks';
import { LocalClient } from '../../LocalClient';
import { 
  DELETE_BOX, 
  GET_BOXES,
  GET_SELECTED_DATE,
} from './queries';

export default function BoxDelete({ box, onComplete }) {

  const shopId = SHOP_ID;

  const correctedDate = (date) => {
    return date.toISOString().slice(0, 10) + ' 00:00:00';
  }

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalClient });
  const delivered = data && data.selectedDate ? data.selectedDate : correctedDate(new Date());

  const updateCacheAfterDelete = (cache, { data } ) => {
    const variables = { shopId, delivered };
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
              This action is irreversible, are you sure you want to delete {box.name}?
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

