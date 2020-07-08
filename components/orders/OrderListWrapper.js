import React, { useEffect, useState, useCallback } from 'react';
import fetch from 'isomorphic-fetch';
import {
  Button,
  ButtonGroup,
  Checkbox,
  Pagination,
  TextField,
} from '@shopify/polaris';
import { useQuery, execute } from '@apollo/client';
import { ShopifyHttpLink } from '../../graphql/shopify-client';
import { LocalApolloClient, LocalHttpLink } from '../../graphql/local-client';
import { dateToISOString, makePromise } from '../../lib';
import DateSelector from '../common/DateSelector';
import BoxSelector from './BoxSelector';
import OrderList from './OrderList';
import createDocDefinition from './docdefinition';
import createPickingDoc from './pickinglist';
import { getQuery } from './shopify-queries';
import { GET_ORDERS, GET_ORDER_DATES, GET_BOXES } from './queries';
import { GET_SELECTED_DATE } from '../boxes/queries';
import './order.css';

export default function OrderListWrapper({ shopUrl }) {

  const ShopId = SHOP_ID;

  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalApolloClient });
  const [delivered, setDelivered] = useState(data.selectedDate);
  const [labelLoading, setLabelLoading] = useState(false);
  const [pickingLoading, setPickingLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  /* filters */
  const [box, setBox] = useState(null);
  const [boxes, setBoxes] = useState([]);
  /* end filters */

  /* checkbox stuff */
  const [checkedIds, setCheckedIds] = useState([]);
  const [ids, setIds] = useState([]);
  const [dates, setDates] = useState([]);

  const handleCheckedChange = useCallback((newChecked, id) => {
    if (newChecked) {
      setCheckedIds(checkedIds.concat([id]));
    } else {
      setCheckedIds(checkedIds.filter(el => el != id));
    }
    }, [checkedIds]);

  const handleCheckAll = useCallback((checked) => {
    if (checked) setCheckedIds(ids);
    if (!checked) setCheckedIds([]);
  }, [ids, checkedIds]);
  /* end checkbox stuff */

  /* query stuff */
  const [query, setQuery] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [input, setInput] = useState({ ShopId, delivered });

  /* page stuff */
  const handleNextPage = useCallback(() => {
    setLoading(true);
    setOffset(offset+limit);
  }, [offset]);
  const handlePreviousPage = useCallback(() => {
    setLoading(true);
    setOffset(offset-limit);
  }, [offset]);

  /* collect orders and pageInfo: hasNextPage and hasPreviousPage */
  useEffect(() => {
    const variables = { input: {
        offset,
        limit,
        shopify_product_id: box ? box.shopify_id : null,
        ...input
      }
    }
    console.log('variable', variables);
    execute(LocalHttpLink, { query: GET_ORDERS, variables })
      .subscribe({
        next: (res) => {
          const rows = res.data.getOrders.rows;
          const count = res.data.getOrders.count;
          const orderids = res.data.getOrders.rows.map(el => el.shopify_order_id);
          if (orderids.length > 0) {
            setQuery(getQuery(orderids));
            setIds(orderids.map(el => el.toString()));
          } else {
            setQuery(null);
            setIds([]);
          }

          setPageCount(parseInt((count/limit) + ((count/limit)%1 !== 0 ? 1 : 0)));
          setPageNumber(Math.round((offset + limit)/limit));
          setLoading(false);
        },
        error: (err) => console.log('get orders error', err),
      });
  }, [input, delivered, offset, box]);

  /* collect data for the date selection */
  useEffect(() => {
    execute(LocalHttpLink, { query: GET_ORDER_DATES })
      .subscribe({
        next: (res) => {
          //console.log('got order dates', res);
          setDates(res.data.getOrderDates.map(el => ({ delivered: el.delivered, count: el.count })));
        },
        error: (err) => console.log('get order dates error', err),
      });
  }, []);
  /* end query stuff */

  /* collect data for the box filter selection */
  useEffect(() => {
    const variables = { input: {
        ShopId,
        delivered,
      }
    };
    execute(LocalHttpLink, { query: GET_BOXES, variables })
      .subscribe({
        next: (res) => {
          setBoxes(res.data.getBoxes);
          console.log('got boxes by  date', res.data.getBoxes);
        },
        error: (err) => console.log('get order dates error', err),
      });
  }, [delivered]);
  /* end collect data for the box filter selection */

  /* pdf labels */
  const getPdf = (dd) => {
    return fetch(`${HOST}/pdf`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dd),
    })
  };

  const createPdf = () => {
    setLabelLoading(true);
    const query = getQuery(checkedIds);
    makePromise(execute(ShopifyHttpLink, { query }))
      .then(data => createDocDefinition({ data, delivered }))
      .then(dd => {
        console.log(JSON.stringify(dd, null, 2));
        const pdf = getPdf(dd);
        return pdf;
      })
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url => {
        var link = document.createElement('a');
        link.href = url;
        link.download = `labels-${dateToISOString(new Date())}.pdf`;
        link.click();
        setLabelLoading(false);
        handleCheckAll(false);
      })
      .catch(err => console.log(err));
  };
  /* end pdf labels */

  const createPickingList = () => {
    setPickingLoading(true);
    const query = getQuery(checkedIds);
    makePromise(execute(ShopifyHttpLink, { query }))
      .then(data => createPickingDoc({ data }))
      .then(dd => {
        console.log(JSON.stringify(dd, null, 2));
        const pdf = getPdf(dd);
        return pdf;
      })
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url => {
        var link = document.createElement('a');
        link.href = url;
        link.download = `picking-list-${dateToISOString(new Date(Date.parse(delivered)))}.pdf`;
        link.click();
        setPickingLoading(false);
        handleCheckAll(false);
      })
      .catch(err => console.log(err));
  };

  /* filters */
  const handleDateChange = (date) => {
    setDelivered(date);
    setInput({ ShopId, delivered: date });
  };

  const handleBoxSelected = (box) => {
    console.log('got box', box);
    setBox(box);
  };
  /* end filters */

  /* checkboxes for the list */
  const checkbox = (
    <Checkbox 
      id='all'
      label='Select/deselect all'
      labelHidden={true}
      onChange={handleCheckAll}
      checked={checkedIds.length > 0}
    />
  );

  const LineCheckbox = ({ id, name }) => {
    return (
      <Checkbox 
        id={id}
        label={name}
        labelHidden={true}
        onChange={handleCheckedChange}
        checked={checkedIds.indexOf(id) > -1}
      />
    );
  };
  /* end checkboxes for the list */

  /* pagination objects */
  const DisplayPageInfo = () => {
    if (pageCount > 1) {
      return (
        <Button
          disabled
        >
          { `Page ${pageNumber} of ${pageCount} pages (offset: ${offset})` }
        </Button>
      );
    };
    return null;
  };
  /* end pagination objects */

  return (
    <React.Fragment>
      <div style={{ padding: '1.6rem' }}>
        <ButtonGroup segmented >
          <Button
            disabled={checkedIds.length == 0}
            primary={checkedIds.length > 0}
            onClick={createPdf}
            loading={labelLoading}
          >
            Print Labels
          </Button>
          <Button
            disabled={checkedIds.length == 0}
            primary={checkedIds.length > 0}
            onClick={createPickingList}
            loading={pickingLoading}
          >
            Print Picking List
          </Button>
          <DateSelector 
            handleDateChange={handleDateChange}
            dates={dates}
            disabled={ loading }
          />
          { pageCount > 0 &&
              <Pagination
                hasPrevious={ pageNumber > 1 && !loading }
                onPrevious={() => {
                  handlePreviousPage();
                }}
                hasNext={ pageNumber < pageCount && !loading }
                onNext={() => {
                  handleNextPage();
                }}
              />
          }
          <DisplayPageInfo />
        </ButtonGroup>
        <div style={{ padding: '1.6rem 0 0 0' }}>
          <ButtonGroup segmented >
            <Button
              disabled
            >
              Filters
            </Button>
            <BoxSelector 
              handleBoxSelected={handleBoxSelected}
              boxes={boxes}
              box={ box }
              disabled={ loading || boxes.length === 0 }
            />
          </ButtonGroup>
        </div>
      </div>
      { query ? (
        <OrderList 
          shopUrl={shopUrl}
          input={input}
          checkbox={checkbox}
          LineCheckbox={LineCheckbox}
          query={query} />
      ) : (
        <div className='emptystate'>
          <h5>{`No box orders for delivery on ${delivered}.`}</h5>
          <ul>
            <li>
              Have boxes been created for { delivered }?
            </li>
            <li>
              Are there any orders for delivery on { delivered }?
            </li>
          </ul>
        </div>
      )}
    </React.Fragment>
  );
}
