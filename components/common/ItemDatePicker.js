import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {
  Banner,
  Button,
  DatePicker,
  Loading,
  Popover,
  Spinner,
  TextStyle,
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import { LocalApolloClient } from '../../graphql/local-client';
import { dateToISOString } from '../../lib';

export default function ItemDatePicker(props) {

  const {id, fieldName, date, mutation, refetch, ...args} = props;

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
      client={LocalApolloClient}
      mutation={mutation}
    >
      {(handleDateChange, { loading, error, data }) => {
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

        const dateChange = (tempDate) => {
          //const tempDate = selectedDate;
          const delivered = dateToISOString(tempDate);
          console.log(delivered);
          let input = { id };
          input[fieldName] = delivered;
          handleDateChange({ variables: { input } });
          togglePopoverActive();
          if (refetch) refetch();
        }

        const setSelectedDateChange = (date) => {
          setSelectedDate(date.start);
          dateChange(date.start);
          setSaveActive(true);
        }

        return (
          <Popover fluidContent={true} active={popoverActive} onClose={togglePopoverActive} activator={(
            <Button
              plain
              onClick={togglePopoverActive}
              disclosure={!popoverActive ? 'down' : 'up'}
              >
                <TextStyle variation='subdued'>{date.toDateString()}</TextStyle>
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
      }}
    </Mutation>
  )
}

  /*
              <Button
                primary
                fullWidth
                disabled={ !saveActive }
                onClick={ dateChange }
              >Save</Button>
ItemDatePicker.propTypes = {
  date: PropTypes.object,
}
*/


