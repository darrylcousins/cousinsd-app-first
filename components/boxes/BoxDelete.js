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
import { DELETE_BOX } from './queries';

export default function BoxDelete({ box, onComplete }) {

  return (
    <Mutation
      client={LocalClient}
      mutation={DELETE_BOX}
    >
      {(boxDelete, { loading, error, data }) => {

        if (loading) { return <Loading />; }

        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleBoxDelete = () => {
          const boxId = parseInt(box.id);
          const input = { boxId }
          console.log({ input });
          boxDelete({ variables: { input } });
          onComplete();
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

