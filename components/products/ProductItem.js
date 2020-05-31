import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Icon,
  Loading,
  Stack,
} from '@shopify/polaris';
import {
  CircleTickOutlineMinor,
  CircleDisableMinor,
  DeleteMinor,
} from '@shopify/polaris-icons';
import { Query, Mutation } from 'react-apollo';
import { LocalClient } from '../../LocalClient';
import Editable from '../common/Editable';
import ProductDelete from './ProductDelete';
import { 
  TOGGLE_PRODUCT_AVAILABLE,
  GET_PRODUCTS,
  FRAGMENT_PRODUCT_AVAILABLE,
  FRAGMENT_PRODUCT_NAME,
  PRODUCT_UPDATE_NAME,
} from './queries';

export default function ProductItem({ product }) {

  const shopId = SHOP_ID;

  const [active, setActive] = useState(product.available === 'true');
  const toggleActive = useCallback(() => setActive(!active), [active]);

  const updateCacheAfterRemove = (cache) => {
    const id = `Product:${product.id}`;
    const fragment = FRAGMENT_PRODUCT_AVAILABLE;
    const fragmentName = 'productAvailable';

    let data = cache.readFragment({ id, fragment, fragmentName });
    const available = data.available === "true" ? "false" : "true";
    data = { available };

    cache.writeFragment({ id, fragment, fragmentName, data });
    toggleActive();
  };

  const updateCacheAfterNameChange = (cache, { data }) => {
    console.log(data);
    const { name } = data.productUpdateName;

    const id = `Product:${product.id}`;
    const fragment = FRAGMENT_PRODUCT_NAME;
    const fragmentName = 'productName';

    data = cache.readFragment({ id, fragment, fragmentName });
    data = { name };
    console.log(name);

    cache.writeFragment({ id, fragment, fragmentName, data });
  };

  return (
    <Mutation
      client={LocalClient}
      mutation={TOGGLE_PRODUCT_AVAILABLE}
      update={updateCacheAfterRemove}
    >
      {(toggleProductAvailable, { loading, error, data }) => {
        if (loading) { return <Loading />; }
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleToggle = () => {
          const input = {
            productId: parseInt(product.id),
            available: !active
          }
          toggleProductAvailable({ variables: { input } }).then((value) => console.log('success'));
        };

        const contentVariant = active ? 'strong' : 'subdued';

        const ToggleButton = ({ icon, available }) => {
          return (
            <Button
              disabled={available}
              primary={!available}
              onClick={handleToggle}
              size='slim'
              icon={icon}
            />
          );
        };

        return (
          <div
            style={{
              alignItems: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.3rem',
            }}
          >
            <Editable 
              name={product.name}
              id={product.id}
              mutation={PRODUCT_UPDATE_NAME}
              update={updateCacheAfterNameChange}
              textStyle={contentVariant}
            />
            <ButtonGroup segmented>
              <ToggleButton icon={CircleTickOutlineMinor} available={active} />
              <ToggleButton icon={CircleDisableMinor} available={!active} />
              <ProductDelete product={product} />
            </ButtonGroup>
          </div>
        )}
      }
    </Mutation>
  );
}

