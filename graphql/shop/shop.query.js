const { resolver } = require( 'graphql-sequelize');
const { Shop } = require( '../../models');

const Query = {
    getShop: resolver(Shop),
};

module.exports = Query;
