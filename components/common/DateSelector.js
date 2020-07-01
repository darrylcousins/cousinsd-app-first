import React, { useEffect, useState, useCallback } from 'react';
import {
  ActionList,
  Badge,
  Banner,
  Button,
  Loading,
  Popover,
} from '@shopify/polaris';
import { Query, Mutation } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { LocalApolloClient, resetStore } from '../../graphql/local-client';
import { dateToISOString } from '../../lib';
import { 
  GET_SELECTED_DATE,
} from '../boxes/queries';

export default function DateSelector({ handleDateChange, disabled, dates }) {

  const ShopId = SHOP_ID;
  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalApolloClient });
  const [delivered, setDelivered] = useState(data.selectedDate);

  const [selectedDate, setSelectedDate] = useState(new Date(Date.parse(delivered)));

  const setSelectedDateChange = (date) => {
    setSelectedDate(date);
    const dateString = dateToISOString(date);
    setDelivered(dateString);
    LocalApolloClient.writeData({ data: { selectedDate: dateString }})
    togglePopoverActive();
    handleDateChange(dateString);
  }

  useEffect(() => {
  }, []);


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
      <ActionList
        items={ dates.map(({ delivered, count }) => {
          const d = new Date(parseInt(delivered)); 
          const label = <><Badge>{ count }</Badge> <span>{ d.toDateString() }</span></>;
          return { 
            content: label, 
            onAction: (e) => setSelectedDateChange(d),
          }
        })}
      />
    </Popover>
  );
}


