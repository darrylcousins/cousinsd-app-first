import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  EmptyState,
  DataTable,
  Icon,
  Loading,
  Sheet,
} from '@shopify/polaris';
import {
    MinusMinor
} from '@shopify/polaris-icons';
import {  } from 'apollo-link';
import { Query } from '@apollo/react-components';
import { execute, useQuery } from '@apollo/client';
import { LocalApolloClient, LocalHttpLink } from '../../graphql/local-client';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import { Editable } from '../common/Editable';
import DateSelector from '../common/DateSelector';
import ItemDatePicker from '../common/ItemDatePicker';
import SheetHelper from '../common/SheetHelper';
import BoxShopTitle from './BoxShopTitle';
import BoxProductList from './BoxProductList';
import BoxAdd from './BoxAdd';
import BoxActions from './BoxActions';
import { 
  GET_BOXES,
  GET_BOX_DATES,
  GET_SELECTED_DATE,
  UPDATE_BOX,
} from './queries';

export default function BoxList({ shopUrl, addBox, toggleAddBox }) {

  const ShopId = SHOP_ID;

  /* boxes datatable stuff */
  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalApolloClient });
  const [delivered, setDelivered] = useState(data.selectedDate);
  const [input, setInput] = useState({ delivered, ShopId });
  const [dates, setDates] = useState([]);
  /* end boxes datatable stuff */

  useEffect(() => {
    execute(LocalHttpLink, { query: GET_BOX_DATES })
      .subscribe({
        next: (res) => {
          setDates(res.data.getBoxDates.map(el => ({ delivered: el.delivered, count: el.count })));
        },
        error: (err) => console.log('get orders error', err),
        //complete: () => console.log('execute orders complete'),
      });
  }, [input]);

  /* checkbox stuff */
  const [checkedId, setCheckedId] = useState(0);
  const [checked, setChecked] = useState(false);
  const handleCheckedChange = useCallback((newChecked, id) => {
    setChecked(newChecked);
    setCheckedId(id);
    }, []
  );
  const clearChecked = () => {
      setChecked(false);
      setCheckedId(0);
  };
  /* end checkbox stuff */

  return (
    <React.Fragment>
      <Query
        client={LocalApolloClient}
        query={GET_BOXES}
        fetchPolicy='no-cache'
        variables={ { input } }
        notifyOnNetworkStatusChange
      >
        {({ loading, error, data, refetch }) => {
          //console.log('GetBox Network status:', networkStatus);
          const isError = error && (
            <Banner status="critical">{error.message}</Banner>
          );
          const isLoading = loading && (
            <React.Fragment>
              <Loading />
              <LoadingPageMarkup />
            </React.Fragment>
          );
          /* datatable stuff */
          const rows = isLoading ? Array(4) : data.getBoxes.map((box) => (
            [
              (
                <Checkbox 
                  key={0}
                  id={box.id}
                  label={box.title}
                  labelHidden={true}
                  onChange={handleCheckedChange}
                  checked={checked && checkedId == box.id}
                />
              ),
              (
                <Editable 
                  key={1}
                  title={box.title}
                  id={box.id}
                  fieldName='title'
                  client={LocalApolloClient}
                  mutation={UPDATE_BOX}
                  update={(data) => console.log(data)}
                  textStyle='strong'
                />
              ),
              <BoxShopTitle
                key={2}
                id={parseInt(box.id)}
                title={box.shopify_title}
              />,
              <ItemDatePicker
                key={3}
                id={parseInt(box.id)}
                refetch={refetch}
                mutation={UPDATE_BOX}
                date={new Date(parseInt(box.delivered))}
                fieldName='delivered'
                variation='subdued'
              />,
              <BoxProductList
                key={4}
                id={parseInt(box.id)}
                isAddOn={false}
              />,
              <BoxProductList
                key={5}
                id={parseInt(box.id)}
                isAddOn={true}
              />,
            ]
          ));
          /* end datatable stuff */

          const refetchQuery = () => {
            const temp = { ...input };
            setInput(temp);
            refetch({ input });
          }

          const handleDateChange = (date) => {
            const input = { ShopId, delivered: date};
            setDelivered(date);
            setInput(input);
            refetch({ input });
          };


          return (
            <React.Fragment>
              <Sheet open={addBox} onClose={toggleAddBox}>
                <SheetHelper title='Add Box' toggle={toggleAddBox}>
                  <BoxAdd
                    onComplete={toggleAddBox}
                    refetch={refetchQuery}
                  />
                </SheetHelper>
              </Sheet>
              <div style={{ padding: '1.6rem' }}>
                <ButtonGroup segmented >
                  <BoxActions
                    checked={checked}
                    checkedId={checkedId}
                    onComplete={clearChecked}
                    refetch={refetchQuery}
                  />
                  <DateSelector
                    handleDateChange={handleDateChange}
                    dates={dates}
                    disabled={ Boolean(isLoading) } />
                </ButtonGroup>
              </div>
              { isError && isError } 
              { isLoading ? isLoading :
                <DataTable
                  columnContentTypes={Array(5).fill('text')}
                  headings={[
                    ( checked ? (
                      <Button 
                        key={0}
                        plain
                        onClick={() => clearChecked()}
                      >
                        <div style={{ 
                          width: '18px',
                          height: '18px',
                          border: '1px solid silver',
                          background: 'transparent',
                          borderRadius: '3px',
                        }}>
                          <Icon
                            color='inkLightest'
                            source={MinusMinor} />
                        </div>
                      </Button>
                    ) : '' ),
                    <strong key={1}>Title</strong>,
                    <strong key={2}>Store Product</strong>,
                    <strong key={3}>Delivery Date</strong>,
                    <strong key={4}>Included Produce</strong>,
                    <strong key={5}>Add On Produce</strong>,
                  ]}
                  rows={rows}
                />
              }
              { data && data.getBoxes.length == 0 &&
                <EmptyState
                  heading="Manage your vege boxes"
                  action={{content: 'Add box', onAction: toggleAddBox}}
                  secondaryAction={{content: 'Learn more', url: 'http://cousinsd.net/'}}
                >
                  <p style={{ textAlign: 'left' }}>
                    Add boxes with products and link to your products on your store
                  </p>
                </EmptyState>
              }
            </React.Fragment>
          );
        }}
      </Query>
    </React.Fragment>
  );
}

