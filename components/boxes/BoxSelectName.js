import React, {useState, useCallback} from 'react';
import {
  TextField,
} from '@shopify/polaris';
import { LocalClient } from '../../LocalClient';
import { dateToISOString } from '../../lib';

export default function BoxSelectName({ name, onSelect }) {

  const [value, setValue] = useState(name);

  const handleValueChange = useCallback((newValue) => setValue(value), []);

  const handleNameChange = (name) => {
    handleValueChange(name);
    onSelect(name);
  }

  const isInvalid = (value, pattern) => value ? new RegExp(pattern).test(value) : true;

  const namePattern = "/^[a-zA-Z ]+$/";
  const errorMessage = () => {
    if (value === '') return false;
    return isInvalid(value, namePattern) ? "Invalid name entered!" : false;
  }

  return (
    <TextField
      value={name}
      onChange={handleNameChange}
      placeholder="Box name"
      pattern={namePattern}
      error={errorMessage()}
    />
  );
}



