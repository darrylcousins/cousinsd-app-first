import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Loading,
  Spinner,
} from '@shopify/polaris';
import { Query, Mutation } from 'react-apollo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { dateToISOString } from '../../lib';
import { LocalApolloClient } from '../../graphql/local-client';
import { 
  DELETE_BOX, 
  GET_BOXES,
  GET_SELECTED_DATE,
} from './queries';

export default function BoxDelete({ checked, checkedId, onComplete }) {

  const shopId = SHOP_ID;

  /* checkbox stuff */
  const [active, setActive] = useState(checked);
  const [id, setId] = useState(checkedId);

  useEffect(() => {
    setActive(checked);
    setId(checkedId);
  }, [checked, checkedId])
  /* end checkbox stuff */

  /* update cache stuff */
  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalApolloClient });
  const delivered = data && data.selectedDate ? data.selectedDate : dateToISOString(new Date());

  const updateCacheAfterDelete = (cache, { data } ) => {
    const query = GET_BOXES;
    //const boxId = `Box.${data.deleteBox}`;
    const boxId = data.deleteBox;
    const input = { shopId, delivered };
    const variables = { input };
    console.log('got this id back', boxId);
    console.log(input);

    const getBoxes = cache.readQuery({ query, variables }).getBoxes.filter((box) => parseInt(box.id) !== boxId)
    data = { getBoxes };

    cache.writeQuery({ query, variables, data });
    onComplete();
  }
  /* end cache stuff */

  return (
    <Mutation
      client={LocalApolloClient}
      mutation={DELETE_BOX}
      update={updateCacheAfterDelete}
    >
      {(boxDelete, { loading, error, data }) => {
        if (loading) { 
          return (
            <React.Fragment>
              <Loading />
              <Spinner size='small' />
            </React.Fragment>
          );
        }

        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const deleteBox = () => {
          const input = { id }
          console.log('deleting', input);
          boxDelete({ variables: { input } });
        }

        return (
          <Button
            disabled={!(active && id)}
            onClick={deleteBox}
          >
            { active && id && 'Delete' }
          </Button>
        );
      }}
    </Mutation>
  );
}
