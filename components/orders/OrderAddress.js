import React, { useRef, useEffect, useState, useCallback } from 'react';
import './order.css';

export default function OrderAddress({ address }) {

  const ulRef = useRef(null);

  useEffect(() => {
    ulRef.current.style.setProperty('--max-height', ulRef.current.scrollHeight + 'px'); 
  });

  return (
    address ? (
      <ul
        className='overflow listed'
        ref={ulRef}
      >
        <li>{ address.name }</li>
        <li>{ address.address1 } { address.address2 }</li>
        <li>{ address.city } { address.zip }</li>
      </ul>
    ) : <p>No shipping</p>
  );
}

