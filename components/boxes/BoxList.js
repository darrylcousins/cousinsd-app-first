import React, { useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  DataTable,
  Icon,
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
import BoxDelete from './BoxDelete';
import BoxAdd from './BoxAdd';
import { 
  GET_BOXES,
  GET_SELECTED_DATE,
  UPDATE_BOX,
} from './queries';

export default function BoxList({ shopUrl, addBox, toggleAddBox }) {

  const shopId = SHOP_ID;
  const adminUrl = `${shopUrl}/admin/products/`;

  /* boxes datatable stuff */
  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalApolloClient });
  const [delivered, setDelivered] = useState(data.selectedDate);
  const [selectedDate, setSelectedDate] = useState(new Date(Date.parse(delivered)));
  const [input, setInput] = useState({ delivered, shopId });
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
        fetchPolicy='network-only'
        variables={ { input } }
      >
        {({ loading, error, data, refetch }) => {
          //console.log('Network status:', networkStatus);
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
                  label={box.handle}
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
              'the product list'
            ]
          ));
          /* end datatable stuff */

          return (
            <React.Fragment>
              <Sheet open={addBox} onClose={toggleAddBox}>
                <SheetHelper title='Add Box' toggle={toggleAddBox}>
                  <BoxAdd
                    onComplete={toggleAddBox}
                  />
                </SheetHelper>
              </Sheet>
              <div style={{ padding: '1.6rem' }}>
                <ButtonGroup segmented >
                  <BoxDelete
                    checked={checked}
                    checkedId={checkedId}
                    onComplete={clearChecked}
                  />
                  <DateRangeSelector refetch={refetch} disabled={ Boolean(isLoading) } />
                </ButtonGroup>
              </div>
              { isError && isError } 
              { isLoading ? isLoading :
                <DataTable
                  columnContentTypes={Array(4).fill('text')}
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
                    <strong>Produce</strong>,
                  ]}
                  rows={rows}
                />
              }
            </React.Fragment>
          );
        }}
      </Query>
    </React.Fragment>
  );
}

