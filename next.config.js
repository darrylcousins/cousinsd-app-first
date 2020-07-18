require("dotenv").config();
const path = require("path")
const withCSS = require('@zeit/next-css');
const webpack = require('webpack');
const fetch = require('isomorphic-fetch');

// next-css needed for polaris to load css files
// XXX next now has another way of creating globals - catch up!
const withTM = require('next-transpile-modules')(['@cousinsd/shopify-boxes-client']);
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([
  [
    withCSS
  ],
  [
    withTM({
      webpack: (config) => {
        config.resolve.alias['react'] = path.resolve(__dirname, '.', 'node_modules', 'react');
        config.resolve.alias['react-dom'] = path.resolve(__dirname, '.', 'node_modules', 'react-dom');
        const env = { 
          API_KEY: JSON.stringify(process.env.SHOPIFY_API_KEY),
          API_VERSION: JSON.stringify(process.env.API_VERSION),
          SHOP_ID: JSON.stringify(process.env.SHOP_ID),
          SHOP_PASSWORD: JSON.stringify(process.env.SHOP_PASSWORD),
          SHOP_USERNAME: JSON.stringify(process.env.SHOP_USERNAME),
          SHOP_NAME: JSON.stringify(process.env.SHOP_NAME),
          HOST: JSON.stringify(process.env.HOST),
          LABELKEYS: JSON.stringify([
            'Delivery Date', 
            'Including', 
            'Add on items', 
            'Removed items', 
            'Subscription',
            'Add on product to'
          ]),
          REACT1: require('react'),
          fetch: fetch,
        };
        config.plugins.push(new webpack.DefinePlugin(env));
        return config
      },
    })
  ],
]);
/*
 * should be reading now from .env.local
API_KEY: JSON.stringify(process.env.SHOPIFY_API_KEY),
API_VERSION: JSON.stringify(process.env.API_VERSION),
SHOP_ID: JSON.stringify(process.env.SHOP_ID),
SHOP_PASSWORD: JSON.stringify(process.env.SHOP_PASSWORD),
SHOP_USERNAME: JSON.stringify(process.env.SHOP_USERNAME),
SHOP_NAME: JSON.stringify(process.env.SHOP_NAME),
HOST: JSON.stringify(process.env.HOST),
*/
