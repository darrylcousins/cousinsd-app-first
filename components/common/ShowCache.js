import React from 'react';
import {
  Button,
} from '@shopify/polaris';
import gql from 'graphql-tag';
import { LocalApolloClient } from '../../graphql/local-client';

export const printCache = () => {
  console.log(LocalApolloClient.cache.data.data);
  const key = 'getBoxes({"delivered":"2020-05-28 00:00:00","shopId":1})';
  //console.log(LocalApolloClient.getData(key));

  const Boxes = Object.values(LocalApolloClient.cache.extract())
    .filter(item => item.__typename === 'Box')
    .map(item => item.id);
  console.log(Boxes);
}

