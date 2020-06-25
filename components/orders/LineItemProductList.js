import React, { useState, useCallback } from 'react';

export default function LineItemProductList({ list }) {

  //console.log(items);
  const products = list.split(',');
  const ulStyle = {
    margin: '0',
    padding: '0',
    listStyleType: 'none',
  }

  return (
    <ul style={ ulStyle } >
      { products.map((el) => <li key={el}>{ el }</li>) }
    </ul>
  );
}


