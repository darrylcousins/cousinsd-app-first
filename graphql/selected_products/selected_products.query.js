const { resolver } = require( 'graphql-sequelize');
const { SelectedProducts } = require( '../../models');

const Query = {
    getSelectedProducts: resolver(SelectedProducts),
};

module.exports = Query;
