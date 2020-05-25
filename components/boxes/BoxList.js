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
  Sheet,
  Stack,
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
import BoxItem from './BoxItem';
import { GET_BOXES, BOX_UPDATE_DELIVERED } from './queries';

export default function BoxList() {

  const shopId = SHOP_ID;

  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive(!active), [active]);

  const RemoveButton = () => {
    return <Icon source={CancelSmallMinor} />
  }

  // { active ? <ProductSelect boxId={parseInt(item.id)} /> : null }

  return (
    <Layout.Section>
      <TextContainer>
        <Query client={LocalClient} query={GET_BOXES} variables={{shopId}}>
          {({ loading, error, data }) => {
            if (loading) { return <Loading />; }
            if (error) { return (
              <Banner status="critical">{error.message}</Banner>
            )}
            console.log(data);
            return (
              <Layout>
                <Layout.Section>
                 { data.getBoxes.map((box) => 
                  <BoxItem box={box} key={box.id} />
                 )}
                </Layout.Section>
              </Layout>
            );
          }}
        </Query>

      </TextContainer>
    </Layout.Section>
  );
}

