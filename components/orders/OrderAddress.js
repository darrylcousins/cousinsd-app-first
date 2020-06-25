import React, { useState, useCallback } from 'react';

export default function OrderAddress({ address }) {

  const ulStyle = {
    margin: '0',
    padding: '0',
    listStyleType: 'none',
  }

  return (
    <ul style={ ulStyle }>
      <li>{ address.name }</li>
      <li>{ address.address1 } { address.address2 }</li>
      <li>{ address.city } { address.zip }</li>
    </ul>
  );
}

