import React from 'react';
import {
  Button,
  Heading,
} from '@shopify/polaris';
import {
  MobileCancelMajorMonotone,
} from '@shopify/polaris-icons';

export default function SheetHelper({ toggle, title, children }) {
  
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          borderBottom: '1px solid #DFE3E8',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '1.6rem',
          width: '100%',
        }}
      >
        <Heading>{title}</Heading>
        <Button
          accessibilityLabel="Cancel"
          icon={MobileCancelMajorMonotone}
          onClick={toggle}
          plain
        />
      </div>
      <div
        style={{
          padding: "1em"
        }}
      >
        { children }
      </div>
    </div>
  );
}


