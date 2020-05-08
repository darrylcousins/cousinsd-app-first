import {
  Banner,
  Layout,
  TextContainer,
  Heading,
  Loading,
  Frame,
  Page,
  DataTable,
} from '@shopify/polaris';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import LocalClient from '../LocalClient';

const GET_ALL_PRODUCE = gql`
  query getAllProduce {
    getAllProduce {
    id
    name
    alt_name
    created
  }
  }
`;

class Produce extends React.Component {

  render() {
    return (
      <Frame>
        <Page>
          <Layout>
            <Layout.Section>
              <TextContainer>
                <Heading>
                  Produce
                </Heading>

                <Query client={LocalClient} query={GET_ALL_PRODUCE}>
                  {({ loading, error, data }) => {
                    if (loading) { return <Loading />; }
                    if (error) { return (
                      <Banner status="critical">{error.message}</Banner>
                    )}
                    console.log(data);
                    const rows = data.getAllProduce.map((item) => (
                      [item.name, new Date(parseInt(item.created)).toDateString()]
                    ));
                    return (
                      <React.Fragment>
                        <Banner status="success">Success - see console log</Banner>
                        <DataTable
                          columnContentTypes={[
                            'text', 'text'
                          ]}
                          headings={[
                            'Name', 'Created'
                          ]}
                          rows={rows}
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
  };
}

export default Produce;
