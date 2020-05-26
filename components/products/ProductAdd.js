import PropTypes from 'prop-types';
import {
  Banner,
  Button,
  ButtonGroup,
  Loading,
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import LocalClient from '../../LocalClient';
import { BOX_ADD_PRODUCT, BOX_GET_DESELECTED_PRODUCTS  } from './queries';
import { GET_BOXES } from '../boxes/queries';

export default function ProductAdd({ boxId, selected, toggleActive }) {

  const shopId = SHOP_ID;

  const updateCacheAfterAdd = (cache, { data }) => {
    let variables = { shopId };
    let query = GET_BOXES;
    const product = data.boxAddCreateProduct;
    const getBoxes = cache.readQuery({ query, variables }).getBoxes.map((box) => {
      if (parseInt(box.id) === boxId) {
        box.products = box.products.concat([data.boxAddCreateProduct]);
      }
      return box;
    });
    data = { getBoxes };
    console.log(data.getBoxes);

    cache.writeQuery({ query, variables, data });

    variables = { boxId };
    query = BOX_GET_DESELECTED_PRODUCTS;
    const boxGetDeselectedProducts = cache.readQuery({ query, variables })
      .boxGetDeselectedProducts.filter((item) => item.id !== product.id);
    data = { boxGetDeselectedProducts };

    cache.writeQuery({ query, variables, data });
  }

  return (
    <Mutation
      client={LocalClient}
      mutation={BOX_ADD_PRODUCT}
      update={updateCacheAfterAdd}
    >
      {(productAdd, { loading, error, data }) => {
          const showError = error && (
            <Banner status="critical">{error.message}</Banner>
          );

          const displayLoading = loading && <Loading />;

          const handleProductAdd = () => {
            const input = {
              boxId: boxId,
              data: {
                name: selected.label,
                productId: parseInt(selected.value),
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
        }
      }
    </Mutation>
  )
}
