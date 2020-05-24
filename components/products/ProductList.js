import React, {useState} from 'react';
import {
  Banner,
  Layout,
  TextContainer,
  Heading,
  Loading,
  Frame,
  DataTable,
} from '@shopify/polaris';
import { Query } from 'react-apollo';
import LocalClient from '../../LocalClient';
import { GET_PRODUCTS } from './queries';

export default function ProductList() {

  const shopId = SHOP_ID;

  // when done loading
  return (
    <Layout.Section>
      <TextContainer>
        <Heading>Produce</Heading>

        <Query client={LocalClient} query={GET_PRODUCTS} variables={{shopId}}>
          {({ loading, error, data }) => {
            if (loading) { return <Loading />; }
            console.log(error);
            if (error) { return (
              <Banner status="critical">{error.message}</Banner>
            )}
            console.log(data);
            const rows = data.getProducts.map((item) => (
              [item.name, new Date(parseInt(item.available)).toDateString()]
            ));
            return (
              <React.Fragment>
                <Banner status="success">Success - see console log</Banner>
                <DataTable
                  columnContentTypes={[
                    'text', 'text'
                  ]}
                  headings={[
                    'Name', 'Available'
                  ]}
                  rows={rows}
                />
              </React.Fragment>
            );
          }}
        </Query>

      </TextContainer>
    </Layout.Section>
  );
}
