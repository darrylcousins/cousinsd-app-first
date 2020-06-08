import React, {useState, useCallback} from 'react';
import {
  Button,
  InlineError,
  TextStyle,
} from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';

export default function BoxAddSelectProduct({ product, onSelect }) {

  const [pickerActive, setPickerActive] = useState(false);
  const handleResourcePickerClose = useCallback(() => setPickerActive(false), []);
  const toggleResourcePicker = useCallback(() => setPickerActive(!pickerActive), [pickerActive]);

  const [storeProduct, setStoreProduct] = useState(product);

  const handleResourceSelection = useCallback(
    ({selection}) => {
      setStoreProduct(selection[0]);
      handleResourcePickerClose();
      onSelect(selection[0]);
    },
    [handleResourcePickerClose],
  );

  return (
    <React.Fragment>
      <Button
        primary={!storeProduct}
        fullWidth
        onClick={toggleResourcePicker}
      >
        { !storeProduct ?
          <TextStyle>Select store product</TextStyle>
        :
          <TextStyle variation="strong">{storeProduct.title}</TextStyle>
        }
      </Button>
      { !storeProduct &&
        <InlineError message="Store product is required" />
      }
      <ResourcePicker
        resourceType="Product"
        open={pickerActive}
        allowMultiple={false}
        initialQuery='Veg'
        showHidden={false}
        onSelection={handleResourceSelection}
        onCancel={handleResourcePickerClose}
      />
    </React.Fragment>
  );

}

