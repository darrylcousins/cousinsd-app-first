import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  ButtonGroup,
  Heading,
  Loading,
  Stack,
  Sheet,
  TextStyle,
} from '@shopify/polaris';
import { Mutation } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { execute, makePromise } from 'apollo-link';
import { LocalApolloClient, LocalHttpLink } from '../../graphql/local-client';
import { dateToISOString, findErrorMessage } from '../../lib';
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
  const [dateMessage, setDateMessage] = useState(true);

  useEffect(() => {
    setInstance(box);
    setSheetOpen(open);
  }, [open, box]);

  const addProducts = async (variables) => {
    const query = BOX_ADD_PRODUCTS;
    const result = await makePromise(execute(LocalHttpLink, { query, variables }));
    return result;
  };

  return (
    <Sheet open={sheetOpen} onClose={onCancel}>
      <SheetHelper title={`Duplicate ${instance.title}`} toggle={toggleSheetOpen}>
        <Mutation
          client={LocalApolloClient}
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
              makePromise(execute(LocalHttpLink, { query, variables }))
                .then(({ data }) => {
                  let { getBoxProducts } = data;
                  return getBoxProducts;
                })
                .then((getBoxProducts) => {
                  productGids = getBoxProducts.products
                    .map((item) => item.shopify_gid);
                  isAddOn = false;
                  input = {
                    boxId,
                    productGids,
                    isAddOn
                  };
                  addProducts({ input });
                  productGids = getBoxProducts.addOnProducts
                    .map((item) => item.shopify_gid);
                  isAddOn = true;
                  input = {
                    boxId,
                    productGids,
                    isAddOn
                  };
                  addProducts({ input });
                  onComplete();
                })
                .catch(err => console.log(err))
                .finally(console.log('Got all the way here'));
            };

            const handleBoxDuplicate = (e) => {
              setDuplicateLoading(true);
              if (selectedDate.getTime() == parseInt(instance.delivered)) {
                setDateError(true);
                setDuplicateLoading(false);
                e.stopPropagation();
                return false;
              };
              const tempDate = selectedDate;
              const delivered = tempDate.toDateString();
              const shopify_gid = instance.shopify_gid;
              const shopify_title = instance.shopify_title;
              const shopify_handle = instance.shopify_handle;
              const shopify_id = instance.shopify_id;
              const title = instance.title;
              const input = { ShopId, title, shopify_handle, delivered, shopify_title, shopify_gid, shopify_id };
              console.log(JSON.stringify(input, null, 2));
              boxAdd({ variables: { input } }).then((value) => {
                console.log('success', value);
                console.log('and now the products!');
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
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    primary
                    loading={duplicateLoading}
                    onClick={handleBoxDuplicate}
                  >
                    Duplicate
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

