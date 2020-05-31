import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  DataTable,
  DatePicker,
  EmptyState,
  Heading,
  Icon,
  Layout,
  List,
  Loading,
  Popover,
  Sheet,
  Stack,
  TextContainer,
  TextStyle,
} from '@shopify/polaris';
import {
  CancelSmallMinor
} from '@shopify/polaris-icons';
import { Query } from 'react-apollo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LocalClient, resetStore } from '../../LocalClient';
import ItemDatePicker from '../common/ItemDatePicker';
import ProductAdd from '../products/ProductAdd';
import ProductSelect from '../products/ProductSelect';
import BoxItem from './BoxItem';
import { dateToISOString } from '../../lib';
import { 
  GET_BOXES,
  BOX_UPDATE_DELIVERED,
  GET_SELECTED_DATE,
  SET_SELECTED_DATE,
} from './queries';

export default function BoxList({ addBox }) {

  const shopId = SHOP_ID;

  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive(!active), [active]);

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalClient });
  const [delivered, setDelivered] = useState(data.selectedDate);

  const [selectedDate, setSelectedDate] = useState(new Date(Date.parse(delivered)));


  const [{month, year}, setDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({month, year}),
    [],
  );

  const setSelectedDateChange = (date) => {
    const tempDate = date.start;
    resetStore(tempDate);
    setSelectedDate(tempDate);
    setDelivered(dateToISOString(tempDate));
    LocalClient.writeData({ data: { selectedDate: dateToISOString(tempDate) }})
    togglePopoverActive();
  }

  return (
    <React.Fragment>
      <Layout.Section>
        <Stack>
          <TextStyle variation="subdued">Showing boxes later than:</TextStyle>
          <Popover fluidContent={true} active={popoverActive} onClose={togglePopoverActive} activator={(
            <Button
              onClick={togglePopoverActive}
              disclosure={!popoverActive ? 'down' : 'up'}
              >
                {selectedDate.toDateString()}
            </Button>
          )}>
            <DatePicker
              month={month}
              year={year}
              onMonthChange={handleMonthChange}
              selected={selectedDate}
              onChange={setSelectedDateChange}
            />
          </Popover>
        </Stack>
      </Layout.Section>
      <Layout.Section>
        <TextContainer>
          <Query
            client={LocalClient}
            query={GET_BOXES}
            variables={{delivered, shopId}}
          >
            {({ loading, error, data }) => {
              console.log(data);
              if (loading) { return <Loading />; }
              if (error) { return (
                <Banner status="critical">{error.message}</Banner>
              )}
              return (
                <Layout>
                  <Layout.Section>
                    { data.getBoxes.length ?
                      data.getBoxes.map((box) => 
                        <BoxItem box={box} key={box.id} />
                       )
                    :
                      <EmptyState
                        heading="Manage your vege boxes"
                        action={{content: 'Add box', onAction: addBox}}
                        secondaryAction={{content: 'Learn more', url: 'http://cousinsd.net/'}}
                      >
                          <p>Add boxes with products and link to your products on your store</p>
                      </EmptyState>
                    }
                  </Layout.Section>
                </Layout>
              );
            }}
          </Query>

        </TextContainer>
      </Layout.Section>
    </React.Fragment>
  );
}

