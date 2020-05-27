import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Layout,
  TextContainer,
  Heading,
  Icon,
  Loading,
  Frame,
  Scrollable,
  Stack,
  TextStyle,
} from '@shopify/polaris';
import {
  AddProductMajorMonotone,
  RemoveProductMajorMonotone,
  CircleTickOutlineMinor,
  CircleDisableMinor,
  DeleteMinor,
} from '@shopify/polaris-icons';
import { Query, Mutation } from 'react-apollo';
import LocalClient from '../../LocalClient';
import { 
  TOGGLE_PRODUCT_AVAILABLE,
  GET_PRODUCTS,
} from './queries';

export default function ProductItem({ product }) {

  const shopId = SHOP_ID;

  const [active, setActive] = useState(product.available === 'true');
  const toggleActive = useCallback(() => setActive(!active), [active]);

  const updateCacheAfterRemove = (cache, { data } ) => {
    let variables = { shopId };
    let query = GET_PRODUCTS;
    const getProducts = cache.readQuery({ query, variables }).getProducts.map((item) => {
      if (parseInt(item.id) === parseInt(product.id)) {
        item.available = !item.available;
        toggleActive();
      }
      return item;
    });
    data = { getProducts };

    cache.writeQuery({ query, variables, data });
  }

  return (
    <Mutation
      client={LocalClient}
      mutation={TOGGLE_PRODUCT_AVAILABLE}
      update={updateCacheAfterRemove}
    >
      {(toggleProductAvailable, { loading, error, data }) => {
          const showError = error && (
            <Banner status="critical">{error.message}</Banner>
          );

          const displayLoading = loading && <Loading />;

          const handleToggle = () => {
            const input = {
              productId: parseInt(product.id),
            }
            console.log(input);
            toggleProductAvailable({ variables: { input } }).then((value) => console.log('success'));
          };

          const contentVariation = active ? 'strong' : 'subdued';

          const ToggleButton = ({ icon, available }) => {
            return (
              <Button
                disabled={available}
                primary={!available}
                onClick={handleToggle}
                size='slim'
              >
                <Icon source={icon} />
              </Button>
            );
          }

          return (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.3rem',
              }}
            >
              <ToggleButton icon={CircleTickOutlineMinor} available={active} />
              <TextStyle variation={contentVariation}>{product.name}</TextStyle>
              <ToggleButton icon={CircleDisableMinor} available={!active} />
            </div>
          );
        }
      }
    </Mutation>
  );
}

