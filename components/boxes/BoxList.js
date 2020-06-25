import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  EmptyState,
  DataTable,
  Icon,
  Layout,
  Loading,
  Sheet,
  TextStyle,
} from '@shopify/polaris';
import {
    MinusMinor
} from '@shopify/polaris-icons';
import { Query, Mutation } from 'react-apollo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LocalApolloClient } from '../../graphql/local-client';
import { LoadingPageMarkup } from '../common/LoadingPageMarkup';
import { Editable } from '../common/Editable';
import DateRangeSelector from '../common/DateRangeSelector';
import ItemDatePicker from '../common/ItemDatePicker';
import SheetHelper from '../common/SheetHelper';
import BoxShopTitle from './BoxShopTitle';
import BoxProductList from './BoxProductList';
import BoxDelete from './BoxDelete';
import BoxAdd from './BoxAdd';
import BoxActions from './BoxActions';
import { 
  GET_BOXES,
  GET_SELECTED_DATE,
  UPDATE_BOX,
} from './queries';

export default function BoxList({ shopUrl, addBox, toggleAddBox }) {

  const ShopId = SHOP_ID;
  const adminUrl = `${shopUrl}/admin/products/`;

  /* boxes datatable stuff */
  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalApolloClient });
  const [delivered, setDelivered] = useState(data.selectedDate);
  const [input, setInput] = useState({ delivered, ShopId });
  /* end boxes datatable stuff */

  /* sheet stuff */
  const [sheetActive, setSheetActive] = useState(addBox);
  const toggleSheetActive = useCallback(() => setSheetActive(!sheetActive), [sheetActive]);
  const toggleSheet = (title) => {
    toggleSheetActive();
  }
  /* end sheet stuff */

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
        {({ loading, error, data, refetch, networkStatus }) => {
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
                  id={box.id}
                  label={box.title}
                  labelHidden={true}
                  onChange={handleCheckedChange}
                  checked={checked && checkedId == box.id}
                />
              ),
              (
                <Editable 
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
                id={parseInt(box.id)}
                title={box.shopify_title}
              />,
              <ItemDatePicker
                id={parseInt(box.id)}
                refetch={refetch}
                mutation={UPDATE_BOX}
                date={new Date(parseInt(box.delivered))}
                fieldName='delivered'
              />,
              <BoxProductList
                id={parseInt(box.id)}
                isAddOn={false}
              />,
              <BoxProductList
                id={parseInt(box.id)}
                isAddOn={true}
              />,
            ]
          ));
          /* end datatable stuff */

          const refetchQuery = () => refetch({ input });

          const handleDateChange = (date) => {
            const input = { ShopId, delivered: date};
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
                  <DateRangeSelector
                    handleDateChange={handleDateChange}
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
                    <strong>Title</strong>,
                    <strong>Store Product</strong>,
                    <strong>Delivery Date</strong>,
                    <strong>Included Produce</strong>,
                    <strong>Add On Produce</strong>,
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

