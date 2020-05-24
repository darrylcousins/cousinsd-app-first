import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Autocomplete,
  Banner,
  Button,
  ButtonGroup,
  Form,
  Icon,
  Loading,
} from '@shopify/polaris';
import {
  SearchMinor
} from '@shopify/polaris-icons';
import { Query } from 'react-apollo';
import LocalClient from '../../LocalClient';
import ProductAdd from './ProductAdd';
import { BOX_GET_DESELECTED_PRODUCTS } from './queries';

export default function ProductSelect({ boxId }) {

  const shopId = SHOP_ID;

  function NameAutocomplete({ deselectedOptions }) {

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState(deselectedOptions);

    const updateText = useCallback(
      (value) => {
        console.log('update Text', value);
        setInputValue(value);

        if (value === '') {
          setOptions(deselectedOptions);
          return;
        }

        const filterRegex = new RegExp(value, 'i');
        const resultOptions = deselectedOptions.filter((option) =>
          option.label.match(filterRegex),
        );
        setOptions(resultOptions);
      },
      [deselectedOptions],
    );

    const updateSelection = useCallback((selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });

      setInputValue(selectedValue[0]);
      setSelectedOptions(selected);
    }, []);

    const textField = (
      <Autocomplete.TextField
        onChange={updateText}
        value={inputValue}
        prefix={<Icon source={SearchMinor} color="inkLighter" />}
              placeholder="Search"
      />
    );


    const selectedValue = (deselectedOptions) => {
      const matchedOption = deselectedOptions.find((option) => {
        return option.label.match(inputValue);
      });
      return matchedOption ? matchedOption : {value: null, label: inputValue};
    }

    return (
      <React.Fragment>
        <Autocomplete
          options={options}
          selected={selectedOptions}
          onSelect={updateSelection}
          textField={textField}
        />
        <ProductAdd boxId={boxId} selected={selectedValue(deselectedOptions)} />
      </React.Fragment>
    );
  }

  return (
    <Query client={LocalClient} query={BOX_GET_DESELECTED_PRODUCTS} variables={{boxId}}>
      {({ loading, error, data }) => {
        if (loading) { return <Loading />; }
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}
        const rows = data.boxGetDeselectedProducts.map((item) => (
          {value: item.id, label: item.name}
        ));
        return (
          <NameAutocomplete deselectedOptions={rows} />
        );
      }}
    </Query>
  );
}
