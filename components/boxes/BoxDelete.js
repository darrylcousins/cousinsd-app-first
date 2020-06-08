import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Loading,
  Modal,
  Spinner,
  TextContainer,
} from '@shopify/polaris';
import { Query, Mutation } from 'react-apollo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { dateToISOString } from '../../lib';
import { LocalApolloClient } from '../../graphql/local-client';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import { 
  DELETE_BOX, 
  GET_BOXES,
  GET_SELECTED_DATE,
} from './queries';

export default function BoxDelete({ open, box, onComplete, onCancel }) {

  /* checkbox stuff */
  const [modalOpen, setModalOpen] = useState(open);
  const [instance, setInstance] = useState(box);

  useEffect(() => {
    setModalOpen(open);
    setInstance(box);
  }, [open, box])
  /* end checkbox stuff */

  const toggleModalOpen = useCallback(() => setModalOpen(!modalOpen), [modalOpen]);

  return (
    <Mutation
      client={LocalApolloClient}
      mutation={DELETE_BOX}
    >
      {(boxDelete, { loading, error, data }) => {
        const isError = error && (
          <Banner status="critical">{error.message}</Banner>
        );
        const isLoading = loading && (
          <React.Fragment>
            <Loading />
            <Spinner />
          </React.Fragment>
        );

        const deleteBox = () => {
          const input = { id: instance.id }
          console.log('deleting', input);
          boxDelete({ variables: { input } })
            .then((value) => {
              onComplete();
          }).catch((error) => {
            console.log('error', error);
          });
        }

        return (
          <Modal
            open={modalOpen}
            onClose={toggleModalOpen}
            title={`Are you sure you want to delete ${instance.title}?`}
            primaryAction={{
              content: "Yes, I'm sure",
              onAction: deleteBox,
              destructive: true,
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: onCancel,
              },
            ]}
          >
            <Modal.Section>
              { isError && isError } 
              { isLoading ? isLoading :
                <TextContainer>
                  <p>
                    Deleting { instance.title }. 
                    This action cannot be undone.
                  </p>
                </TextContainer>
              }
            </Modal.Section>
          </Modal>
        );
      }}
    </Mutation>
  );
}
