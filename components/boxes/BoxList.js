import React, { useState, useCallback } from 'react';
import {
  Banner,
  DataTable,
  Loading,
} from '@shopify/polaris';
import { Query, Mutation } from 'react-apollo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LocalClient } from '../../LocalClient';
import { 
  GET_BOXES,
  GET_SELECTED_DATE,
} from './queries';

export default function BoxList() {

  const shopId = SHOP_ID;

  /* boxes datatable stuff */
  const { data } = useQuery(GET_SELECTED_DATE, { client: LocalClient });
  const [delivered, setDelivered] = useState(data.selectedDate);

  const [selectedDate, setSelectedDate] = useState(new Date(Date.parse(delivered)));

  const [input, setInput] = useState({ delivered, shopId });
  /* end boxes datatable stuff */

  return (
    <Query
      client={LocalClient}
      query={GET_BOXES}
      variables={ { input } }
    >
      {({ loading, error, data }) => {
        if (loading) { return <Loading />; }
        if (error) { 
          console.log(error);
          return (
            <Banner status="critical">{error.message}</Banner>
          )
        }
        console.log(data);
        /* datatable stuff */
        const rows = data.getBoxes.map((box) => (
          [
            box.title,
            box.shopify_gid,
            new Date(parseInt(box.delivered)).toDateString(),
            'the product list'
          ]
        ));
        /* end datatable stuff */

        return (
          <DataTable
            columnContentTypes={Array(4).fill('text')}
            headings={[
              <strong>Title</strong>,
              <strong>Store Product</strong>,
              <strong>Delivery Date</strong>,
              <strong>Produce</strong>,
            ]}
            rows={rows}
          />
        );
      }}
    </Query>
  );
}

