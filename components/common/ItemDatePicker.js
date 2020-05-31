import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {
  Banner,
  Button,
  DatePicker,
  Loading,
  Popover,
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import { LocalClient } from '../../LocalClient';

export default function ItemDatePicker(props) {

  const {date, mutation, ...args} = props;

  const [popoverActive, setPopoverActive] = useState(false);

  const [saveActive, setSaveActive] = useState(false);

  const [selectedDate, setSelectedDate] = useState(date);

  const [{month, year}, setDate] = useState({
    month: date.getMonth(),
    year: date.getFullYear(),
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({month, year}),
    [],
  );

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  return (
      <Mutation
        client={LocalClient}
        mutation={mutation}
      >
        {(handleDateChange, { loading, error, data }) => {
          if (loading) { return <Loading />; }

          if (error) { return (
            <Banner status="critical">{error.message}</Banner>
          )}

          const dateChange = () => {
            const tempDate = selectedDate;
            tempDate.setDate(selectedDate.getDate() + 1); // correct for unfound day descrepency
            const delivered = tempDate.toISOString().slice(0, 10) + ' 00:00:00';
            const input = { ...args, delivered };
            handleDateChange({ variables: { input } });
            togglePopoverActive();
          }

          const setSelectedDateChange = (date) => {
            setSelectedDate(date.start);
            setSaveActive(true);
          }
  
          return (
            <Popover fluidContent={true} active={popoverActive} onClose={togglePopoverActive} activator={(
              <Button
                onClick={togglePopoverActive}
                disclosure={!popoverActive ? 'down' : 'up'}
                >
                  {date.toDateString()}
              </Button>
            )}>
              <DatePicker
                month={month}
                year={year}
                onMonthChange={handleMonthChange}
                selected={selectedDate}
                onChange={setSelectedDateChange}
              />
                <Button
                  primary
                  fullWidth
                  disabled={ !saveActive }
                  onClick={ dateChange }
                >Save</Button>
            </Popover>
          );
        }
      }
    </Mutation>
  )
}

ItemDatePicker.propTypes = {
  date: PropTypes.object,
}


