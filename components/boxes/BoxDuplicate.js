import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  Loading,
  Stack,
  TextField,
  DatePicker,
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import LocalClient from '../../LocalClient';
import ItemDatePicker from '../common/ItemDatePicker';
import { 
  CREATE_BOX, 
  GET_BOXES,
  GET_SELECTED_DATE,
} from './queries';

export default function BoxDuplicate({ box, onComplete }) {

  const shopId = SHOP_ID;

  const [name, setName] = useState(box.name);

  const handleNameChange = useCallback((newValue) => setName(newValue), []);

  const isInvalid = (value, pattern) => value ? new RegExp(pattern).test(value) : true;

  const [selectedDate, setSelectedDate] = useState(new Date(parseInt(box.delivered)));

  const [{month, year}, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });

  const handleMonth= useCallback(
    (month, year) => setDate({month, year}),
    [],
  );

  const setSelectedDateChange = (date) => {
    setSelectedDate(date.start);
  }

  const correctedDate = (date) => {
    return date.toISOString().slice(0, 10) + ' 00:00:00';
  }

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalClient });
  const delivered = data && data.selectedDate ? data.selectedDate : correctedDate(new Date());

  const updateCacheAfterAdd = (cache, { data }) => {
    const variables = { shopId, delivered };
    const query = GET_BOXES;
    const box = data.createBox;
    box.products = [];

    const getBoxes = cache.readQuery({ query, variables }).getBoxes.concat([box]);
    data = { getBoxes };

    cache.writeQuery({ query, variables, data });
  }

  return (
    <Mutation
      client={LocalClient}
      mutation={CREATE_BOX}
      update={updateCacheAfterAdd}
    >
      {(boxAdd, { loading, error, data }) => {

        if (loading) { return <Loading />; }

        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleBoxAdd = () => {
          const tempDate = selectedDate;
          tempDate.setDate(selectedDate.getDate() + 1); // correct for unfound day descrepency
          const delivered = correctedDate(tempDate);
          const input = { shopId, name, delivered };
          boxAdd({ variables: { input } }).then((value) => {
            onComplete();
          }).catch((error) => {
            console.log('error', error);
          });
        }

        const namePattern = "/^[a-zA-Z ]+$/";
        const errorMessage = () => {
          if (name === '') return false;
          return isInvalid(name, namePattern) ? "Invalid name entered!" : false;
        }

        return (
          <Stack vertical>
            <TextField
              value={name}
              onChange={handleNameChange}
              placeholder="Box name"
              pattern={namePattern}
              error={errorMessage()}
            />
            <DatePicker
              month={month}
              year={year}
              onMonthChange={handleMonth}
              selected={selectedDate}
              onChange={setSelectedDateChange}
            />
            <ButtonGroup
              segmented
              fullWidth
            >
              <Button
                primary
                onClick={handleBoxAdd}
              >
                Save
              </Button>
              <Button
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

