import React from 'react';
import {
  Banner,
  Button,
  Spinner,
  TextStyle,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { 
  GET_PRODUCT_PRICE,
} from './shopify-queries';

export function ProductShopPrice({ id, adminUrl, productId }) {

  const numberFormat = ({ amount, currencyCode }) => {
    let amt = amount * 0.01; // amount comes in at cent decimal value
    let locale = 'en-NZ';
    if (currencyCode == 'NZD') locale = 'en-NZ';
    return (
      new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currencyCode
      }).format(amt)
    )
  }

  return (
    <Query
      query={GET_PRODUCT_PRICE}
      variables={{ id }}
      context={{ shopify: true }}
      fetchPolicy='no-cache'
    >
      {({ loading, error, data }) => {
        if (loading) { return <Spinner size='small' />; }
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )}
        const { product } = data;
        const price = numberFormat(product.priceRange.maxVariantPrice);
        return (
          <Button 
            plain
            external
            url={`${adminUrl}${productId}`}
          >
            <TextStyle variation='subdued'>{price}</TextStyle>
          </Button>
        )
      }}
    </Query>
  );
}


