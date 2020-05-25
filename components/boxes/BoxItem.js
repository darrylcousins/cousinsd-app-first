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
import { Query } from 'react-apollo';
import LocalClient from '../../LocalClient';
import ItemDatePicker from '../common/ItemDatePicker';
import SheetHelper from '../common/SheetHelper';
import ProductAdd from '../products/ProductAdd';
import ProductSelect from '../products/ProductSelect';
import BoxDelete from './BoxDelete';
import { GET_BOXES, BOX_UPDATE_DELIVERED } from './queries';

export default function BoxItem({ box }) {

  const shopId = SHOP_ID;

  const [productsCollapsible, setProductsCollapsible] = useState(false);
  const toggleProductsCollapsible = useCallback(() => setProductsCollapsible(!productsCollapsible), [productsCollapsible]);

  const [activeCollapsible, setActiveCollapsible] = useState(false);
  const toggleActiveCollapsible = useCallback(() => setActiveCollapsible(!activeCollapsible), [activeCollapsible]);

  const [activeSelectForm, setActiveSelectForm] = useState(false);
  const toggleActiveSelectForm = useCallback(() => setActiveSelectForm(!activeSelectForm), [activeSelectForm]);

  const [sheetActive, setSheetActive] = useState(false);
  const toggleSheetActive = useCallback(() => setSheetActive(!sheetActive), [sheetActive]);

  const ProductRemoveButton = ({ id }) => {
    return (
      <Button
        key={ id }
        plain
        destructive={true}
        onClick={ () => console.log('clicked remove button', id)}>
        <TextStyle variation="negative">
          <Icon destructive source={DeleteMinor} />
        </TextStyle>
      </Button>
    )
  }

  //{ active ? <ProductSelect boxId={parseInt(item.id)} /> : null }
  const BoxRemoveButton = ({ id }) => {
    return (
      <TextStyle variation="negative">
        Delete box
      </TextStyle>
    )
  }

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

  return (
    <React.Fragment>
      <Sheet open={sheetActive} onClose={toggleSheetActive}>
        <SheetHelper
          title={`Delete ${box.name}?`}
          toggle={toggleSheetActive}
        >
          <BoxDelete box={box} onComplete={toggleSheetActive} />
        </SheetHelper>
      </Sheet>
      <Card
        title={<BoxTitle />}
        key={box.id}
        actions={{
          content: <Icon source={activeCollapsible ? CaretUpMinor : CaretDownMinor} />,
          onAction: toggleActiveCollapsible,
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
                      <ProductRemoveButton id={product.id} />
                      <TextContainer>
                        {product.name}
                      </TextContainer>
                    </Stack>
                  )) }
                </Collapsible>
              </Stack>
              : <TextStyle variation="subdued">No products</TextStyle>
            }
          </div>
          <ButtonGroup>
            <Button
              primary
              onClick={() => console.log('clicked add button' + box.id)}
            >
              Add product
            </Button>
            <Button
              destructive
              onClick={toggleSheetActive}
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


