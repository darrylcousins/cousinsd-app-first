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

    const original = config.entry;
    config.entry = function () {
      return original()
        .then((entry) => {
          // do something with it
          return Object.assign({}, entry, { 'boxes': './scripts/boxes.js'});
        }
      );
    };

    return config;
  },
});

  /*
    const original = config.entry;
    config.entry = function () {
      return original()
        .then((entry) => {
          // do something with it
          return Object.assign({}, entry, { 'boxes': './scripts/boxes.js'});
        }
      );
    };

    const c = merge(
      config, {
        name: "boxes",
        //entry: {
        //  'boxes': "./scripts/boxes.js"
        //},
        module: {
          rules: [
              {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [options.defaultLoaders.babel]
              }
            ]
        },
        output: {
          filename: "[name].bundle.js",
          path: path.resolve(__dirname, "public")
        }
      },
    );

    const original = config.entry;
    config.entry = function () {
      return original()
        .then((entry) => {
          // do something with it
          return Object.assign({}, entry, { 'boxes': './scripts/boxes.js'});
        }
      );
    };

module.exports = {
  entry: {
    'boxes': "./scripts/boxes.js"
  },
  module: {
    rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        }
      ]
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "assets")
    }
}
*/
