import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Loading,
  Stack,
  Sheet,
  TextStyle,
} from '@shopify/polaris';
import { Mutation } from '@apollo/react-components';
import { execute } from '@apollo/client';
import { LocalHttpLink } from '../../graphql/client';
import SheetHelper from '../common/SheetHelper';
import BoxAddSelectDate from './BoxAddSelectDate';
import { 
  CREATE_BOX, 
  GET_BOX_PRODUCTS,
  BOX_ADD_PRODUCTS,
} from './queries';

export default function BoxDuplicate({ open, box, onComplete, onCancel }) {

  const ShopId = SHOP_ID;

  const [instance, setInstance] = useState(box);
  const [selectedDate, setSelectedDate] = useState(new Date(parseInt(box.delivered)));

  const [sheetOpen, setSheetOpen] = useState(open);
  const toggleSheetOpen = useCallback(() => setSheetOpen(!sheetOpen), [sheetOpen]);

  const [duplicateLoading, setDuplicateLoading] = useState(false);

  const [dateError, setDateError] = useState(false);
  //const [dateMessage, setDateMessage] = useState(true);
  const dateMessage = true; // eslint

  useEffect(() => {
    setInstance(box);
    setSheetOpen(open);
  }, [open, box]);

  const addProducts = (variables) => {
    let result;
    execute(LocalHttpLink, { query: BOX_ADD_PRODUCTS, variables })
      .subscribe({
        next: (res) => {
          console.log('box duplicate', res);
        },
        error: (err) => console.log('box duplicate add products', err),
        complete: () => console.log('box duplicate add products'),
      });
  };

  return (
    <Sheet open={sheetOpen} onClose={onCancel}>
      <SheetHelper title={`Duplicate Box`} toggle={toggleSheetOpen}>
        <Mutation
          mutation={CREATE_BOX}
        >
          {(boxAdd, { loading, error, data }) => {
            if (loading) { return <Loading />; }
            const isError = error && (
              <Banner status="critical">{error.message}</Banner>
            );

            if (!loading && data) {
              const boxId = data.createBox.id;
              const query = GET_BOX_PRODUCTS;
              const variables = { input: { id: instance.id }};
              var input, productGids, isAddOn;
              execute(LocalHttpLink, { query: GET_BOX_PRODUCTS, variables })
                .subscribe({
                  next: (res) => {
                    const newBox = res.data.getBoxProducts;
                    productGids = newBox.products
                      .map((item) => item.shopify_gid);
                    isAddOn = false;
                    input = {
                      boxId,
                      productGids,
                      isAddOn
                    };
                    addProducts({ input });
                    productGids = newBox.addOnProducts
                      .map((item) => item.shopify_gid);
                    isAddOn = true;
                    input = {
                      boxId,
                      productGids,
                      isAddOn
                    };
                    addProducts({ input });
                    onComplete();
                  },
                  //complete: () => console.log('execute orders complete'),
                });
            }

            const handleBoxDuplicate = (e) => {
              setDuplicateLoading(true);
              if (selectedDate.getTime() == parseInt(instance.delivered)) {
                setDateError(true);
                setDuplicateLoading(false);
                e.stopPropagation();
                return false;
              }
              const variables = {
                input: {
                  ShopId,
                  delivered: selectedDate.toDateString(),
                  shopify_title: instance.shopify_title,
                  shopify_gid: instance.shopify_gid,
                  shopify_id: instance.shopify_id,
                  shopify_handle: instance.shopify_handle,
                  shopify_price: instance.shopify_price,
                  shopify_variant_id: instance.shopify_variant_id,
                }
              };
              boxAdd({ variables }).then((value) => {
              }).catch((error) => {
                console.log('error', error);
              });
              e.stopPropagation();
            }

            return (
              <Stack vertical>
                <TextStyle variation="subdued"><i>{ instance.shopify_title }</i></TextStyle>
                { dateMessage && (
                  <Banner status="info">Please select a new date</Banner>
                )} 
                { isError && isError } 
                { dateError && (
                  <Banner status="critical">Duplicated box cannot have same delivery date!</Banner>
                )} 
                <BoxAddSelectDate date={selectedDate} onSelect={setSelectedDate} />
                <ButtonGroup
                  segmented
                  fullWidth
                >
                  <Button
                    primary
                    loading={duplicateLoading}
                    onClick={handleBoxDuplicate}
                  >
                    Duplicate
                  </Button>
                  <Button
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </Stack>
            );
          }}
        </Mutation>
      </SheetHelper>
    </Sheet>
  );
}

