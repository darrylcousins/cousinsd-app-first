import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Loading,
  TextField,
} from '@shopify/polaris';
import {
  CircleTickOutlineMinor,
  CircleDisableMinor,
  DeleteMinor,
} from '@shopify/polaris-icons';
import { Query, Mutation } from 'react-apollo';
import { LocalClient } from '../../LocalClient';
import { nameSort } from '../../lib';
import Editable from '../common/Editable';
import { 
  GET_PRODUCTS,
  CREATE_PRODUCT,
  BOX_GET_DESELECTED_PRODUCTS,
} from './queries';

/*
 * Create product alone
*/

export default function ProductCreate() {

  const shopId = SHOP_ID;
  
  const [value, setValue] = useState('');
  const handleValue = useCallback((value) => setValue(value), []);

  const [editing, setEditing] = useState(false);

  const updateCacheAfterCreate = (cache, { data }) => {
    let variables = { shopId };
    let query = GET_PRODUCTS;
    const product = data.createProduct;

    const getProducts = cache.readQuery({ query, variables }).getProducts
      .filter((item) => item.id != product.id)
      .concat([product]).sort(nameSort);
    data = { getProducts };

    cache.writeQuery({ query, variables, data });

    const BoxIds = Object.values(LocalClient.cache.extract())
      .filter(item => item.__typename === 'Box')
      .map(item => item.id);

    let boxGetDeselectedProducts, boxId;
    query = BOX_GET_DESELECTED_PRODUCTS;
    BoxIds.forEach((id) => {
      boxId = parseInt(id);
      variables = { boxId };
      try {
        boxGetDeselectedProducts = cache.readQuery({ query, variables }).boxGetDeselectedProducts
          .filter((item) => item.id != product.id)
          .concat([product]).sort(nameSort);
        data = { boxGetDeselectedProducts };

        cache.writeQuery({ query, variables, data });
      } catch(e) {};
    });
  }

  return (
    <Mutation
      client={LocalClient}
      mutation={CREATE_PRODUCT}
      update={updateCacheAfterCreate}
    >
      {(productCreate, { loading, error, data }) => {
        if (loading) { return <Loading />; }
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleKeyPress = (event) => {
          const enterKeyPressed = event.keyCode === 13;
          if (enterKeyPressed) {
            event.preventDefault();
            const name = value;
            const input = { shopId, name };
            console.log('product add input', input);
            productCreate({ variables: { input } })
              .then((value) => setEditing(false));
          }
        }

        return (
          editing ?
            <div
              onKeyDown={handleKeyPress}
            >
              <TextField
                focused
                clearButton
                value={value}
                onChange={handleValue}
                onClearButtonClick={() => setEditing(false)}
              />
            </div>
            :
            <div
              onClick={() => setEditing(true)}
            >
              <Button
                primary
                fullWidth
              >Add product</Button>
          </div>
        );
      }}
    </Mutation>
  );
}
