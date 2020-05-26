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
import LocalClient from '../../LocalClient';
import ItemDatePicker from '../common/ItemDatePicker';
import { CREATE_BOX, GET_BOXES } from './queries';

export default function BoxAdd({ onComplete }) {

  const shopId = SHOP_ID;

  const [name, setName] = useState('');

  const handleNameChange = useCallback((newValue) => setName(newValue), []);

  const isInvalid = (value, pattern) => value ? new RegExp(pattern).test(value) : true;

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [{month, year}, setDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const handleMonth= useCallback(
    (month, year) => setDate({month, year}),
    [],
  );

  const setSelectedDateChange = (date) => {
    setSelectedDate(date.start);
  }

  const updateCacheAfterAdd = (cache, { data }) => {
    const variables = { shopId };
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
          const delivered = selectedDate.toISOString().slice(0, 10) + ' 00:00:00';
          const input = { shopId, name, delivered };
          boxAdd({ variables: { input } }).then((value) => {
            console.log('then', value);
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
