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
import LocalClient from '../../LocalClient';
import ItemDatePicker from '../common/ItemDatePicker';
import ProductAdd from '../products/ProductAdd';
import ProductSelect from '../products/ProductSelect';
import BoxItem from './BoxItem';
import { 
  GET_BOXES,
  BOX_UPDATE_DELIVERED,
  GET_SELECTED_DATE,
  SET_SELECTED_DATE,
} from './queries';

export default function BoxList() {

  const shopId = SHOP_ID;

  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive(!active), [active]);

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [{month, year}, setDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({month, year}),
    [],
  );

  const correctedDate = (date) => {
    const tempDate = date;
    //tempDate.setDate(date.getDate() + 1); // correct for unfound day descrepency
    return tempDate.toISOString().slice(0, 10) + ' 00:00:00';
  }

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalClient });
  const [delivered, setDelivered] = useState(
    data && data.selectedDate ? data.selectedDate : correctedDate(selectedDate)
  );

  const [storeSelectedDate] = useMutation(
    SET_SELECTED_DATE,
    { 
      variables: { delivered }, 
      client: LocalClient 
    }
  );

  const setSelectedDateChange = (date) => {
    const tempDate = date.start;
    //tempDate.setDate(date.start.getDate() + 1); // correct for unfound day descrepency
    setSelectedDate(tempDate);
    setDelivered(correctedDate(tempDate));
    //LocalClient.writeData({ data: { selectedDate: correctedDate(tempDate) }})
    storeSelectedDate();
    togglePopoverActive();
  }

  console.log('delivered in box list', delivered);

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
    </React.Fragment>
  );
}

