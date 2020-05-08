require('isomorphic-fetch');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const Router = require('koa-router');
const {receiveWebhook, registerWebhook} = require('@shopify/koa-shopify-webhooks');
const graphiql = require("koa-graphiql").default;

const ENV = require('./config');
const { graphQLServer } = require('./graphql');

const port = parseInt(ENV.PORT, 10) || 3000;
const dev = ENV.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

console.log('connecting as ', ENV.HOST, '\n');

app.prepare().then(() => {
  const server = new Koa();

  graphQLServer.applyMiddleware({
    app: server,
    path: '/local_graphql'
  });


  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [ENV.SHOPIFY_API_SECRET_KEY];

  server.use(

  // If you have a private shopify app, you can than skip over the auth step and use this library directly for setting up graphql proxy.
  // https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-graphql-proxy
    createShopifyAuth({
      apiKey: ENV.SHOPIFY_API_KEY,
      secret: ENV.SHOPIFY_API_SECRET_KEY,
      scopes: [
        'read_products',
        'write_products',
        'read_script_tags',
        'write_script_tags',
      ],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set('shopOrigin', shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });

        const registration = await registerWebhook({
          address: `${ENV.HOST}/webhooks/products/create`,
          topic: 'PRODUCTS_CREATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.October19
        });

        if (registration.success) {
          console.log('Successfully registered webhook!');
        } else {
          console.log('Failed to register webhook', registration.result);
        }

        ctx.redirect('/');
      },
    }),
  );

  server.use(graphQLProxy({version: ApiVersion.October19}))
  server.use(verifyRequest());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;

  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
