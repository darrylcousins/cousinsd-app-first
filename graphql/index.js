const glue = require('schemaglue');
const options = {
  js: '**/*.js', // default
  ignore: '**/somefileyoudonotwant.js'
}
const { schema, resolver } = glue('graphql', options);

module.exports = {
  schema: schema,
  resolver: resolver
}

