import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  DataTable,
  DatePicker,
  Heading,
  Icon,
  Layout,
  List,
  Loading,
  TextContainer,
} from '@shopify/polaris';
import {
  CancelSmallMinor
} from '@shopify/polaris-icons';
import { Query } from 'react-apollo';
import LocalClient from '../../LocalClient';
import ItemDatePicker from '../common/ItemDatePicker';
import ProductAdd from '../products/ProductAdd';
import ProductSelect from '../products/ProductSelect';
import { GET_BOXES, BOX_UPDATE_DELIVERED } from './queries';

export default function BoxList() {

  const shopId = SHOP_ID;

  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive(!active), [active]);

  const RemoveButton = () => {
    return <Icon source={CancelSmallMinor} />
  }

  return (
    <Layout.Section>
      <TextContainer>
        <Heading>Boxes</Heading>

        <Query client={LocalClient} query={GET_BOXES} variables={{shopId}}>
          {({ loading, error, data }) => {
            if (loading) { return <Loading />; }
            if (error) { return (
              <Banner status="critical">{error.message}</Banner>
            )}
            console.log(data);
            const rows = data.getBoxes.map((item) => (
              [
                item.name,
                <ItemDatePicker
                  mutation={BOX_UPDATE_DELIVERED}
                  date={new Date(parseInt(item.delivered))}
                  boxId={parseInt(item.id)}
                />,
                (
                  <React.Fragment>
                      { item.products.map(product => (
                        <Card
                          key={product.id}
                          title={product.name}
                          primaryFooterAction={
                            {
                              content: <RemoveButton />,
                            }
                          }
                        >
                        </Card>
                      )) }
                        <Button
                          primary plain
                          onClick={toggleActive}
                        >
                          Add product
                      </Button>
                    { active ? <ProductSelect boxId={parseInt(item.id)} /> : null }
                  </React.Fragment>
                ),
              ]
            ));
            return (
              <React.Fragment>
                <DataTable
                  columnContentTypes={[
                    'text', 'text'
                  ]}
                  headings={[
                    'Name', 'Deliver Date', 'Products'
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

