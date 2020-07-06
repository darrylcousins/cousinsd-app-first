import React, {useState, useCallback} from 'react';
import {
  TextField,
} from '@shopify/polaris';

export default function BoxAddSelectName({ name, onSelect }) {

  const [value, setValue] = useState(name);

  const handleValueChange = useCallback((newValue) => setValue(newValue), []);

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



