import React, { useRef, useEffect } from 'react';

export default function LineItemProductList({ list, produce }) {

  const products = list.split(',').filter(el => {
    if (!produce) return true;
    const handle = el.replace(/ /g, '-').toLowerCase();
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
