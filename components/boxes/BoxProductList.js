import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Collapsible,
  Loading,
  Spinner,
  Stack,
  TextStyle,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { LocalApolloClient } from '../../graphql/local-client';
import BoxProductAdd from './BoxProductAdd';
import BoxProductRemove from './BoxProductRemove';
import { 
  GET_BOX_PRODUCTS
} from './queries';

export default function BoxProductList({ id, isAddOn }) {

  const input = { id };
  const [showProducts, setShowProducts] = useState(false);
  const toggleShowProducts = useCallback(() => setShowProducts(!showProducts), [showProducts]);

  return (
    <Query
      query={GET_BOX_PRODUCTS}
      variables={{ input }}
      client={LocalApolloClient}
      fetchPolicy='no-cache'
    >
      {({ loading, error, data, refetch }) => {
        if (loading) { 
          return (
            <React.Fragment>
              <Loading />
              <Spinner size='small' />
            </React.Fragment>
          );
        }
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}
        const products = isAddOn ? data.getBoxProducts.addOnProducts : data.getBoxProducts.products;
        const doRefetch = () => refetch({ input });
        return (
            <Stack>
            { products.length ? 
              <Stack vertical>
                <Button 
                  plain
                  onClick={toggleShowProducts}
                  ariaExpanded={showProducts}
                  ariaControls="product-collapsible"
                  disclosure={!showProducts ? 'down' : 'up'}
                >
                  <TextStyle variation='subdued'>
                    { isAddOn ? 'Add ons' : 'Included' }
                  </TextStyle>
                </Button>
                  <Collapsible
                    open={showProducts}
                    id="product-collapsible"
                    transition={{duration: '150ms', timingFuntion: 'ease'}}
                  >
                    { products.map(product => (
                      <Stack 
                        vertical
                        key={product.id}>
                        <BoxProductRemove
                          isAddOn={isAddOn}
                          product={product}
                          boxId={ parseInt(id) }
                          refetch={doRefetch} />
                      </Stack>
                    )) }
                  </Collapsible>
              </Stack>
              : <TextStyle variation="subdued">No products</TextStyle>
            }
              <BoxProductAdd
                boxId={ parseInt(id) }
                refetch={doRefetch}
                isAddOn={isAddOn} />
            </Stack>
        )
      }}
    </Query>
  );
}



