import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  DatePicker,
  Loading,
  Popover,
} from '@shopify/polaris';
import { Query, Mutation } from 'react-apollo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LocalApolloClient, resetStore } from '../../graphql/local-client';
import { dateToISOString } from '../../lib';
import { 
  GET_SELECTED_DATE,
} from '../boxes/queries';

export default function DateRangeSelector({ refetch, disabled }) {

  const shopId = SHOP_ID;
  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalApolloClient });
  const [delivered, setDelivered] = useState(data.selectedDate);

  const [selectedDate, setSelectedDate] = useState(new Date(Date.parse(delivered)));

  const [{month, year}, setDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({month, year}),
    [],
  );

  const setSelectedDateChange = (date) => {
    const tempDate = date.start;
    //resetStore(tempDate);
    setSelectedDate(tempDate);
    const dateString = dateToISOString(tempDate);
    setDelivered(dateString);
    LocalApolloClient.writeData({ data: { selectedDate: dateString }})
    togglePopoverActive();
    const input = { shopId, delivered: dateString };
    refetch({ input });
  }

  return (
    <Popover fluidContent={true} active={popoverActive} onClose={togglePopoverActive} activator={(
      <Button
        onClick={togglePopoverActive}
        disabled={disabled}
        disclosure={!popoverActive ? 'down' : 'up'}
        >
          {selectedDate.toDateString()}
      </Button>
    )}>
      <DatePicker
        month={month}
        year={year}
        onMonthChange={handleMonthChange}
        selected={selectedDate}
        onChange={setSelectedDateChange}
      />
    </Popover>
  );
}

