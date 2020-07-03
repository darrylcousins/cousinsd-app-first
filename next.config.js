require("dotenv").config();
const path = require("path")
const withCSS = require('@zeit/next-css');
const webpack = require('webpack');
const merge = require('webpack-merge');
const fetch = require('node-fetch');

// next-css needed for polaris to load css files
// XXX next now has another way of creating globals - catch up!

module.exports = withCSS({
  webpack: (config, options) => {
    const env = { 
      API_KEY: JSON.stringify(process.env.SHOPIFY_API_KEY),
      SHOP_ID: JSON.stringify(process.env.SHOP_ID),
      SHOP_PASSWORD: JSON.stringify(process.env.SHOP_PASSWORD),
      SHOP_USERNAME: JSON.stringify(process.env.SHOP_USERNAME),
      SHOP_NAME: JSON.stringify(process.env.SHOP_NAME),
      HOST: JSON.stringify(process.env.HOST),
      LABELKEYS: JSON.stringify(['Delivery Date', 'Including', 'Add on items', 'Removed items', 'Subscription']),
      fetch: fetch,
    };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
});
