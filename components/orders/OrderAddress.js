import React, { useRef, useEffect } from 'react';

export default function OrderAddress({ address, customer }) {

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
        { customer && <li key={0}>{ customer.email }</li> }
        <li key={1}>{ address.name }</li>
        <li key={2}>{ address.address1 } { address.address2 }</li>
        <li key={3}>{ address.city } { address.zip }</li>
      </ul>
    ) : <p>No shipping</p>
  );
}

