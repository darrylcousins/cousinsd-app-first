import React from 'react';
import {
  Button,
} from '@shopify/polaris';
import gql from 'graphql-tag';
import { LocalClient } from '../../LocalClient';

export const printCache = () => {
  console.log(LocalClient.cache);
  const key = 'getBoxes({"delivered":"2020-05-28 00:00:00","shopId":1})';
  //console.log(LocalClient.getData(key));

  const Boxes = Object.values(LocalClient.cache.extract())
    .filter(item => item.__typename === 'Box')
    .map(item => item.id);
  console.log(Boxes);
}

