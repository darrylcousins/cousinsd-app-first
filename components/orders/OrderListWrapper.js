import React, { useEffect, useState, useCallback } from 'react';
import fetch from 'isomorphic-fetch';
import {
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  Modal,
  Pagination,
  TextField,
} from '@shopify/polaris';
import { useQuery, execute } from '@apollo/client';
import { ShopifyHttpLink } from '../../graphql/shopify-client';
import { LocalApolloClient, LocalHttpLink } from '../../graphql/local-client';
import { dateToISOString, makePromise, makeThrottledPromise, getPdf } from '../../lib';
import DateSelector from '../common/DateSelector';
import BoxSelector from './BoxSelector';
import OrderList from './OrderList';
import NoteWrapper from './NoteWrapper';
import createDocDefinition from './docdefinition';
import createPickingDoc from './pickinglist';
import { getQuery, getFullQuery } from './shopify-queries';
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

  /* modal stuff */
  const [modalOpen, setModalOpen] = useState(open);
  /* end modal stuff */

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

  /* feedback on actions */
  const [feedbackText, setFeedbackText] = useState('');
  /* end feedback on actions */

  /* query stuff */
  const [query, setQuery] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [input, setInput] = useState({ ShopId, delivered });
  /* end query stuff */

  /* filters */
  const [box, setBox] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [nameSearchTerm, setNameSearchTerm] = useState('');
  const [searchButtonLoading, setSearchButtonLoading] = useState(false);

  const handleNameSearchTermChange = useCallback((value) => {
    setNameSearchTerm(value);
    }, [nameSearchTerm]);

  const handleNameSearchClear = useCallback(() => {
    setNameSearchTerm('');
    setSearchTerm('');
    }, [searchTerm, nameSearchTerm]);

  const handleNameSearch = () => {
    setSearchTerm(nameSearchTerm);
    setInput({ ...input });
    //setLoading(true);
    //setSearchButtonLoading(true);
  };

  const handleDateChange = (date) => {
    setDelivered(date);
    setInput({ ShopId, delivered: date });
  };

  const handleBoxSelected = (box) => {
    // filters query by box product (i.e. Small Box)
    setBox(box);
  };
  /* end filters */
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
        shopify_name: searchTerm.length ? searchTerm : null,
        ...input
      }
    }
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
          setTotalCount(count);
          setLoading(false);
          setSearchButtonLoading(false);
        },
        error: (err) => console.log('get orders error', err),
      });
  }, [input, delivered, offset, box, searchTerm]);

  /* collect data for the date selection */
  useEffect(() => {
    execute(LocalHttpLink, { query: GET_ORDER_DATES })
      .subscribe({
        next: (res) => {
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
        },
        error: (err) => console.log('get order dates error', err),
      });
  }, [delivered]);
  /* end collect data for the box filter selection */

  /* pdf labels */
  const printLabels = () => {
    setLabelLoading(true);
    const query = getQuery(checkedIds);
    makePromise(execute(ShopifyHttpLink, { query }))
      .then(data => createDocDefinition({ data, delivered }))
      .then(dd => {
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

  /* create the picking list */
  const preparePrintPickingList = () => {
    if (checkedIds.length) {
      // show modal and ask the question
      setModalOpen(true);
    } else {
      printPickingList(false);
    }
  };

  const printPickingList = (useSelected) => {
    setModalOpen(false)
    setPickingLoading(true);
    setFeedbackText('Requesting data ... ');
    const variables = {
      input: {
        ShopId,
        offset: 0,
        limit: totalCount,
        delivered: input.delivered,
      }
    }
    execute(LocalHttpLink, { query: GET_ORDERS, variables })
      .subscribe({
        next: (res) => {
          const promises = [];
          if (useSelected) {
            const orderids = checkedIds; // always less than limit
            const query = getFullQuery(orderids);
            promises.push(makePromise(execute(ShopifyHttpLink, { query })));
          } else {
            const orderids = res.data.getOrders.rows.map(el => el.shopify_order_id);
            // need to split this up
            //for (let i=0; i<pageCount; i++) {
            for (let i=0; i<1; i++) {
              const query = getFullQuery(orderids.slice(i*limit, i*limit+limit));
              // note the i for count - this multiplies the time
              promises.push(makeThrottledPromise(execute(ShopifyHttpLink, { query }), i+1));
            }
          }
          const response = Promise.all(promises)
            .then(data => {
              setFeedbackText('Creating pdf ...');
              return createPickingDoc({ data });
            })
            .then(dd => {
              //console.log(JSON.stringify(dd, null, 2));
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
              setFeedbackText('');
            })
            .catch(err => console.log(err));
        },
        error: (err) => console.log('get orders error', err),
      });
  };
  /* end create the picking list */

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
        <NoteWrapper segmentedLeft={true}>
          { `Page ${pageNumber} of ${pageCount} pages (${totalCount} orders)` }
        </NoteWrapper>
      );
    };
    return null;
  };
  /* end pagination objects */

  /* feedback banner */
  const FeedbackBanner = () => {
    return (
      <Banner status='info'>{ feedbackText }</Banner>
    );
  }
  /* end feedback banner */

  return (
    <React.Fragment>
      { feedbackText && <FeedbackBanner /> }
      <div style={{ padding: '1.6rem' }}>
        <ButtonGroup segmented >
          <Button
            disabled={totalCount === 0}
            primary={checkedIds.length > 0}
            onClick={preparePrintPickingList}
            loading={pickingLoading}
          >
            Print Picking List
          </Button>
          <Button
            disabled={checkedIds.length === 0}
            primary={checkedIds.length > 0}
            onClick={printLabels}
            loading={labelLoading}
          >
            Print Labels
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
            <NoteWrapper segmentedRight={true}>
              Filters:
            </NoteWrapper>
            <BoxSelector 
              handleBoxSelected={handleBoxSelected}
              boxes={boxes}
              box={ box }
              disabled={ loading || boxes.length === 0 }
            />
            <TextField
              value={nameSearchTerm}
              placeholder='Search by order number...'
              onChange={handleNameSearchTermChange}
              clearButton={true}
              onClearButtonClick={ handleNameSearchClear }
            />
            <Button
              disabled={nameSearchTerm === ''}
              primary={nameSearchTerm !== ''}
              onClick={handleNameSearch}
              loading={searchButtonLoading}
            >
              Search
            </Button>
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
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title='Print picking list for selected orders only?'
        primaryAction={{
          content: 'Only selected orders',
          onAction: () => printPickingList(true),
        }}
        secondaryActions={[
          {
            content: 'All orders',
            onAction: () => printPickingList(false),
          },
        ]}
      />
    </React.Fragment>
  );
}
