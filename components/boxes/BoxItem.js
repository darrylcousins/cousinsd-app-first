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
  Link,
  List,
  Loading,
  Stack,
  TextContainer,
  TextStyle,
  Tooltip,
  Collapsible,
  Sheet,
} from '@shopify/polaris';
import {
  CancelSmallMinor,
  RemoveProductMajorMonotone,
  DeleteMinor,
  CaretDownMinor,
  CaretUpMinor,
} from '@shopify/polaris-icons';
import { Query, Mutation } from 'react-apollo';
import { useQuery, useMutation } from "@apollo/react-hooks";
import LocalClient from '../../LocalClient';
import ItemDatePicker from '../common/ItemDatePicker';
import SheetHelper from '../common/SheetHelper';
import ProductSelect from '../products/ProductSelect';
import ProductRemove from '../products/ProductRemove';
import BoxDelete from './BoxDelete';
import BoxDuplicate from './BoxDuplicate';
import { 
  SET_SELECTED_BOX, 
  GET_SELECTED_BOX, 
  GET_BOXES, 
  BOX_UPDATE_DELIVERED 
} from './queries';

export default function BoxItem({ box }) {

  const shopId = SHOP_ID;

  const [productsCollapsible, setProductsCollapsible] = useState(false);
  const toggleProductsCollapsible = useCallback(() => setProductsCollapsible(!productsCollapsible), [productsCollapsible]);

  const [activeSelectForm, setActiveSelectForm] = useState(false);
  const toggleActiveSelectForm = useCallback(() => setActiveSelectForm(!activeSelectForm), [activeSelectForm]);

  const [sheetActive, setSheetActive] = useState(false);
  const toggleSheetActive = useCallback(() => setSheetActive(!sheetActive), [sheetActive]);

  const [productSelectActive, setProductSelectActive] = useState(false);
  const toggleProductSelectActive = useCallback(() => setProductSelectActive(!productSelectActive), [productSelectActive]);

  const BoxTitle = () => (
    <Stack>
      <TextStyle variation="subdued">
        {'[' + new Date(parseInt(box.delivered)).toDateString() + '] '}
      </TextStyle>
      <TextStyle variation="strong">
        {box.name}
      </TextStyle>
    </Stack>
  );

  const toggleProductActions = () => {
    if ( !productsCollapsible ) setProductsCollapsible(true);
    toggleProductSelectActive();
  };

  const { data } = useQuery(GET_SELECTED_BOX, { client: LocalClient });
  const activeCollapsible = (data && data.selectedBox === box.id);
  const [setSelectedBox] = useMutation(
    SET_SELECTED_BOX,
    { 
      variables: { id: activeCollapsible ? null : box.id }, 
      client: LocalClient 
    }
  );

  const [sheetTitle, setSheetTitle] = useState('');
  const toggleSheet = (title) => {
    setSheetTitle(title);
    toggleSheetActive();
  }

  return (
    <React.Fragment>
      <Sheet open={sheetActive} onClose={toggleSheetActive}>
        <SheetHelper
          title={`${sheetTitle} ${box.name}?`}
          toggle={toggleSheetActive}
        >
          { sheetTitle === 'Delete' ?
            <BoxDelete box={box} onComplete={toggleSheetActive} />
            :
            <BoxDuplicate box={box} onComplete={toggleSheetActive} />
          }
        </SheetHelper>
      </Sheet>
      <Card
        title={<BoxTitle />}
        key={box.id}
        actions={{
          content: <Icon source={activeCollapsible ? CaretUpMinor : CaretDownMinor} />,
          onAction: setSelectedBox,
          ariaControls: 'box-collapsible' + box.id,
        }}
        sectioned
      >
        <Collapsible
          open={activeCollapsible}
          id={'box-collapsible' + box.id}
          transition={{duration: '150ms', timingFuntion: 'ease'}}
        >
        <Stack>
          <ItemDatePicker
            mutation={BOX_UPDATE_DELIVERED}
            date={new Date(parseInt(box.delivered))}
            boxId={parseInt(box.id)}
          />
          <div style={{ width: "300px" }}>
            { box.products.length ? 
              <Stack vertical>
                <Button 
                  onClick={toggleProductsCollapsible}
                  ariaExpanded={productsCollapsible}
                  ariaControls="product-collapsible"
                  disclosure={!productsCollapsible ? 'down' : 'up'}
                >
                    Products
                </Button>
                <Collapsible
                  open={productsCollapsible}
                  id="product-collapsible"
                  transition={{duration: '150ms', timingFuntion: 'ease'}}
                >
                  { box.products.map(product => (
                    <Stack key={product.id}>
                      <ProductRemove
                        boxId={parseInt(box.id)}
                        product={product}
                        setActive={setProductsCollapsible}
                      />
                    </Stack>
                  )) }
                </Collapsible>
              </Stack>
              : <TextStyle variation="subdued">No products</TextStyle>
            }
              { productSelectActive ?
                  <ProductSelect boxId={parseInt(box.id)} toggleActive={toggleProductSelectActive} />
                  : null }
          </div>
          <ButtonGroup segmented>
            <Button
              primary
              onClick={toggleProductActions}
            >
              Add product
            </Button>
            <Button
              onClick={ () => toggleSheet('Duplicate') }
            >
              Duplicate box
            </Button>
            <Button
              destructive
              onClick={ () => toggleSheet('Delete') }
            >
              Delete box
            </Button>
          </ButtonGroup>
        </Stack>
        </Collapsible>
      </Card>
    </React.Fragment>
  );
}


