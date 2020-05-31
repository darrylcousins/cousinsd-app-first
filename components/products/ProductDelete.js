import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Loading,
  Modal,
  TextContainer,
} from '@shopify/polaris';
import {
  DeleteMinor,
} from '@shopify/polaris-icons';
import { Mutation } from 'react-apollo';
import { LocalClient } from '../../LocalClient';
import { 
  FRAGMENT_PRODUCT_ARRAY,
} from '../boxes/queries';
import { 
  GET_PRODUCTS,
  DELETE_PRODUCT,
  BOX_GET_DESELECTED_PRODUCTS,
} from './queries';

/*
 * Delete a product forever
*/

export default function ProductDelete({ product }) {

  const shopId = SHOP_ID;

  const [modalActive, setModalActive] = useState(false);

  const toggleModalActive = useCallback(() => setModalActive(!modalActive), [modalActive]);

  const updateCacheAfterDelete = (cache, { data }) => {
    let variables = { shopId };
    let query = GET_PRODUCTS;
    const productId = data.deleteProduct;
    console.log('PRODUCT ID', productId);

    const getProducts = cache.readQuery({ query, variables })
      .getProducts.filter((item) => item.id != productId);
    data = { getProducts };

    cache.writeQuery({ query, variables, data });

    const BoxIds = Object.values(LocalClient.cache.extract())
      .filter(item => item.__typename === 'Box')
      .map(item => item.id);

    let boxGetDeselectedProducts, boxId, id, box_id;
    query = BOX_GET_DESELECTED_PRODUCTS;
    const fragment = FRAGMENT_PRODUCT_ARRAY;
    const fragmentName = 'productArray';
    BoxIds.forEach((box_id) => {
      boxId = parseInt(box_id);
      variables = { boxId };
      try {
        // remove from box deselected products
        boxGetDeselectedProducts = cache.readQuery({ query, variables })
          .boxGetDeselectedProducts.filter((item) => item.id != productId);
        data = { boxGetDeselectedProducts };
        console.log('filtered deselected:', boxGetDeselectedProducts);

        cache.writeQuery({ query, variables, data });
      } catch(e) {};

      // remove from product list
      id = `Box:${boxId}`;
      data = cache.readFragment({ id , fragment, fragmentName });
      const products = data.products.filter((item) => item.id != productId);
      data = { products }
      console.log('filtered actual box products:', products);
      cache.writeFragment({ id, fragment, fragmentName, data });

    });

  }

  return (
    <Mutation
      client={LocalClient}
      mutation={DELETE_PRODUCT}
      update={updateCacheAfterDelete}
    >
      {(productDelete, { loading, error, data }) => {
        if (loading) { return <Loading />; }
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}

        const handleProductDelete = () => {
          const productId = parseInt(product.id);
          const input = { productId }
          productDelete({ variables: { input } }).then((value) => {
            toggleModalActive();
          }).catch((error) => {
            console.log('error', error);
          });
        };

        return (
          <React.Fragment>
            <Button
              destructive
              onClick={toggleModalActive}
              size='slim'
              icon={DeleteMinor}
            />
            <Modal
              open={modalActive}
              onClose={toggleModalActive}
              title={`Are you sure you want to delete ${product.name}?`}
              primaryAction={{
                content: "Yes I'm sure",
                onAction: handleProductDelete,
                destructive: true,
              }}
              secondaryActions={[
                {
                  content: 'Cancel',
                  onAction: toggleModalActive,
                },
              ]}
            >
              <Modal.Section>
                <TextContainer>
                  <p>
                    This action is irreversible and the product will be removed from
                    all boxes.
                  </p>
                </TextContainer>
              </Modal.Section>
            </Modal>
          </React.Fragment>
        );
      }}
    </Mutation>
  );
  
}
