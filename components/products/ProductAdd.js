import PropTypes from 'prop-types';
import {
  Banner,
  Button,
  ButtonGroup,
  Loading,
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { LocalClient } from '../../LocalClient';
import { nameSort } from '../../lib';
import {
  BOX_ADD_PRODUCT,
  BOX_GET_DESELECTED_PRODUCTS,
  GET_PRODUCTS,
} from './queries';
import { 
  GET_BOXES,
  GET_SELECTED_DATE,
  UPDATE_PRODUCT_LIST,
  FRAGMENT_PRODUCT_ARRAY,
} from '../boxes/queries';

/*
 * Create product including the box
*/
export default function ProductAdd({ boxId, selected, toggleActive }) {

  const shopId = SHOP_ID;

  const correctedDate = (date) => {
    return date.toISOString().slice(0, 10) + ' 00:00:00';
  }

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalClient });
  const delivered = data && data.selectedDate ? data.selectedDate : correctedDate(new Date());

  const updateCacheAfterAdd = (cache, { data }) => {
    const product = data.boxAddCreateProduct;

    const fragment = FRAGMENT_PRODUCT_ARRAY;
    const fragmentName = 'productArray';
    const id = `Box:${boxId}`;

    data = cache.readFragment({ id, fragment, fragmentName });
    const products = data.products
      .filter((item) => item.id != product.id)
      .concat([product]);
    data = { products }
    cache.writeFragment({ id, fragment, fragmentName, data });

    let variables = { boxId };
    let query = BOX_GET_DESELECTED_PRODUCTS;
    const boxGetDeselectedProducts = cache.readQuery({ query, variables })
      .boxGetDeselectedProducts.filter((item) => item.id !== product.id);
    data = { boxGetDeselectedProducts };

    cache.writeQuery({ query, variables, data });

    variables = { shopId };
    query = GET_PRODUCTS;

    try {
      // query may not be loaded
      const getProducts = cache.readQuery({ query, variables }).getProducts
        .filter((item) => item.id != product.id)
        .concat([product]).sort(nameSort);
      data = { getProducts };

      cache.writeQuery({ query, variables, data });
    } catch(e) {};
  }

  return (
    <Mutation
      client={LocalClient}
      mutation={BOX_ADD_PRODUCT}
      update={updateCacheAfterAdd}
    >
      {(productAdd, { loading, error, data }) => {
        if (loading) { return <Loading />; }
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleProductAdd = () => {
          const input = {
            boxId: boxId,
            data: {
              name: selected.label,
              id: parseInt(selected.value),
            }
          }
          console.log('product add input', input);
          productAdd({ variables: { input } }).then((value) => toggleActive());
        }
        return (
          <ButtonGroup fullWidth segmented >
            <Button
              primary
              onClick={handleProductAdd}
            >Save</Button>
            <Button
              onClick={toggleActive}
            >Cancel</Button>
          </ButtonGroup>
        );
      }}
    </Mutation>
  )
}
