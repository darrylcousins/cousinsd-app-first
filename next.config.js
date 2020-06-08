require("dotenv").config();
const path = require("path")
const withCSS = require('@zeit/next-css');
const webpack = require('webpack');
const merge = require('webpack-merge');

const apiKey =  JSON.stringify(process.env.SHOPIFY_API_KEY);
const shopID =  process.env.SHOP_ID;
const host =  JSON.stringify(process.env.HOST);

// next-css needed for polaris to load css files

module.exports = withCSS({
  webpack: (config, options) => {
    const env = { 
      API_KEY: apiKey,
      SHOP_ID: shopID,
      HOST: host,
    };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
});
