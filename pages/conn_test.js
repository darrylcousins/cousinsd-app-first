import React from 'react';
import {
  Banner,
  Layout,
  TextContainer,
  TextStyle,
  Heading,
  Loading,
  Frame,
  Page,
  DataTable,
} from '@shopify/polaris';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { LocalApolloClient } from '../graphql/local-client';

const GET_SHOP = gql`
  query getShop($input: ShopIdInput!) {
    getShop(input: $input) {
      name
      email
      url
      shopify_name
      createdAt
    }
  }
`;

const GET_SHOPIFY = gql`
  query shop {
    shop {
      name
      email
      myshopifyDomain
    }
  }
`;

const ShopId = SHOP_ID;
const input = { id: ShopId };

class ConnTest extends React.Component {

  render() {
    return (
      <Frame>
        <Page>
          <Layout>
            <Layout.Section>
              <TextContainer>
                <Heading>
                  Connection Test
                </Heading>

                <Query client={LocalApolloClient} query={GET_SHOP} variables={{ input }}>
                  {({ loading, error, data }) => {
                    if (loading) { return <Loading />; }
                    if (error) { return (
                      <Banner status="critical">{error.message}</Banner>
                    )}
                    if (!data.getShop) { return (
                      <Banner status="warning">No shop</Banner>
                    )}
                    console.log(data);
                    const { name, email, url, shopify_name, createdAt } = data.getShop;
                    console.log(new Date(parseInt(createdAt)).toDateString());
                    return (
                      <React.Fragment>
                        <TextStyle variation="strong">Local Storage</TextStyle>
                        <Banner status="success">Success - see console log</Banner>
                        <DataTable
                          columnContentTypes={[
                            'text', 'text', 'text', 'text', 'text'
                          ]}
                          headings={[
                            'Name', 'Email', 'Url', 'ShopifyID', 'Created'
                          ]}
                          rows={[
                            [name, email, url, shopify_name, new Date(parseInt(createdAt)).toDateString()]
                          ]}
                        />
                      </React.Fragment>
                    );
                  }}
                </Query>

                <Query query={GET_SHOPIFY}>
                  {({ loading, error, data }) => {
                    if (loading) { return <Loading />; }
                    if (error) { return (
                      <Banner status="critical">{error.message}</Banner>
                    )}
                    console.log(data);
                    const { name, email, myshopifyDomain } = data.shop;
                    return (
                      <React.Fragment>
                        <TextStyle variation="strong">Remote Storage</TextStyle>
                        <Banner status="success">Success - see console log</Banner>
                        <DataTable
                          columnContentTypes={[
                            'text', 'text', 'text'
                          ]}
                          headings={[
                            'Name', 'Email', 'Domain'
                          ]}
                          rows={[
                            [name, email, myshopifyDomain]
                          ]}
                        />
                      </React.Fragment>
                    );
                  }}
                </Query>

              </TextContainer>
            </Layout.Section>
          </Layout>
        </Page>
      </Frame>
    );
  }
}

export default ConnTest;
