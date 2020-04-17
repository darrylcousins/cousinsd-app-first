import { Layout, TextContainer, Heading } from '@shopify/polaris';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import LocalClient from '../components/LocalClient';

const UPDATE_PRICE = gql`
  mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      product {
        title
      }
      productVariant {
        id
        price
      }
    }
  }
`;

const GET_SHOP = gql`
  query getShop($id: Int) {
    getShop(id: $id) {
      name
      email
      url
    }
  }
`;

const GET_SELECTED_PRODUCTS = gql`
  query getSelectedProducts($shop_id: Int) {
    getSelectedProducts(shop_id: $shop_id) {
      shop_id
      product_ids
    }
  }
`;

const GET_SHOPIFY = gql`
  query shop {
    shop {
      name
    }
  }
`;

class ConnTest extends React.Component {

  render() {
    const shop_id = 1;
    return (
      <Layout>
        <Layout.Section>
          <TextContainer>
            <Heading>
              Connection Test
            </Heading>

            <Query client={LocalClient} query={GET_SHOP} variables={{ id: shop_id }}>
              {({ loading, error, data }) => {
                if (loading) { return <div>Loading…</div>; }
                if (error) { return <div>{error.message}</div>; }

                console.log(data);
                return (<div>Success - see console log</div>);
              }}
            </Query>

            <Query query={GET_SHOPIFY}>
              {({ loading, error, data }) => {
                if (loading) { return <div>Loading…</div>; }
                if (error) { return <div>{error.message}</div>; }

                console.log(data);
                return (<div>Success - see console log</div>);
              }}
            </Query>

          </TextContainer>
        </Layout.Section>
      </Layout>
    );
  };
}

export default ConnTest;
