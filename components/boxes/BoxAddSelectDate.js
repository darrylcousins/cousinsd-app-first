import React, {useState, useCallback} from 'react';
import {
  DatePicker,
} from '@shopify/polaris';

export default function BoxAddSelectDate({ date, onSelect }) {

  const [selectedDate, setSelectedDate] = useState(date);

  const [{month, year}, setDate] = useState({
    month: date.getMonth(),
    year: date.getFullYear(),
  });

  const handleMonth= useCallback(
    (month, year) => setDate({month, year}),
    [],
  );

  const setSelectedDateChange = (date) => {
    setSelectedDate(date.start);
    onSelect(date.start);
  }

  return (
    <div onClick={(e) => { e.stopPropagation(); }}>
      <DatePicker
        month={month}
        year={year}
        onMonthChange={handleMonth}
        selected={selectedDate}
        onChange={setSelectedDateChange}
      />
    </div>
  );
}


