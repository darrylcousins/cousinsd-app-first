import React, { useRef, useEffect, useState, useCallback } from 'react';
import './order.css';

export default function LineItemProductList({ list, produce }) {

  //console.log(items);
  /*
  const temp = list.split(',').map(el => {
    if (!produce) return el;
    const handle = el.replace(' ', '_').toLowerCase();
    if (produce.indexOf(handle) == -1) return '';
    return el;
  });
  const products = temp.filter(el => (el != ''));
  */

  const products = list.split(',').filter(el => {
    if (!produce) return true;
    const handle = el.replace(' ', '_').toLowerCase();
    return (produce.indexOf(handle) > -1);
  });

  const ulRef = useRef(null);

  useEffect(() => {
    ulRef.current.style.setProperty('--max-height', ulRef.current.scrollHeight + 'px'); 
  });

  return (
    <ul 
      className={`overflow${ products.length > 1 ? ' listed'  : '' }` }
      ref={ulRef}
    >
      { products.map((el) => <li key={el}>{ el }</li>) }
    </ul>
  );
}


