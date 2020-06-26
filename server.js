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
const bodyParser = require('koa-body');
const pdfMakePrinter = require('pdfmake/src/printer');

const ENV = require('./config');
const { graphQLServer } = require('./graphql');
const getSubscriptionUrl = require('./server/getSubscriptionUrl');
const productCreate = require('./webhooks/products/create');
const productDelete = require('./webhooks/products/delete');
const productUpdate = require('./webhooks/products/update');
const shopRedact = require('./webhooks/shops/redact');
const customerRedact = require('./webhooks/customers/redact');
const customerDataRequest = require('./webhooks/customers/data-request');
const authCallback = require('./webhooks/auth/callback');
const generatePdf = require('./webhooks/pdf');

const port = parseInt(ENV.PORT, 10) || 3000;
const dev = ENV.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

console.log('connecting as ', ENV.HOST, '\n');

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  graphQLServer.applyMiddleware({
    app: server,
    path: '/local_graphql'
  });

  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [ENV.SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: ENV.SHOPIFY_API_KEY,
      secret: ENV.SHOPIFY_API_SECRET_KEY,
      scopes: [
        'read_products',
        'write_products',
        'read_customers',
        'write_customers',
        'read_checkouts',
        'write_checkouts',
        'read_orders',
        'write_orders',
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

        await registerWebhook({
          address: `${ENV.HOST}/webhooks/products/create`,
          topic: 'PRODUCTS_CREATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.October19
        });

        await registerWebhook({
          address: `${ENV.HOST}/webhooks/products/delete`,
          topic: 'PRODUCTS_DELETE',
          accessToken,
          shop,
          apiVersion: ApiVersion.October19
        });

        await registerWebhook({
          address: `${ENV.HOST}/webhooks/products/update`,
          topic: 'PRODUCTS_UPDATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.October19
        });

        //await getSubscriptionUrl(ctx, accessToken, shop);
        ctx.redirect("/");
      }
    })
  );

  server.use(graphQLProxy({version: ApiVersion.October19}))

  const webhook = receiveWebhook({ secret: ENV.SHOPIFY_API_SECRET_KEY });

  // mandatory webhooks
  router.post('/webhooks/customers/redact', webhook, (ctx) => {
    customerRedact(ctx.state.webhook);
  });

  router.post('/webhooks/customers/data_request', webhook, (ctx) => {
    customerDataRequest(ctx.state.webhook);
  });

  router.post('/webhooks/shops/redact', webhook, (ctx) => {
    shopRedact(ctx.state.webhook);
  });

  router.post('/webhooks/auth/callback', webhook, (ctx) => {
    authCallback(ctx.state.webhook);
  });

  /* Headers are:
  X-Shopify-Topic: orders/create
  X-Shopify-Hmac-Sha256: XWmrwMey6OsLMeiZKwP4FppHH3cmAiiJJAweH5Jo4bM=
  X-Shopify-Shop-Domain: johns-apparel.myshopify.com
  X-Shopify-API-Version: 2019-04
  */

  // product webhooks
  router.post('/webhooks/products/create', webhook, (ctx) => {
    productCreate(ctx.state.webhook, ENV.SHOP_ID);
  });

  router.post('/webhooks/products/update', webhook, (ctx) => {
    productUpdate(ctx.state.webhook, ENV.SHOP_ID);
  });

  router.post('/webhooks/products/delete', webhook, (ctx) => {
    productDelete(ctx.state.webhook);
  });

  server.use(bodyParser());

  router.post('/pdf', verifyRequest(), async (ctx) => {
    const dd = ctx.request.body;

    const fonts = {
      Roboto: {
        normal: './fonts/Lato-Regular.ttf',
        bold: './fonts/Lato-Medium.ttf',
        italics: './fonts/Lato-Italic.ttf',
        bolditalics: './fonts/Lato-MediumItalic.ttf'
      }
    };
    const printer = new pdfMakePrinter(fonts);
    const doc = printer.createPdfKitDocument(dd);

    doc.pipe(ctx.res);
    doc.end();

    console.log(doc);

    ctx.set('Content-Type', 'application/pdf');
    ctx.set('Content-Disposition', 'application; filename=labels.pdf');
    ctx.respond = true;
    ctx.res.statusCode = 200;

    return new Promise(resolve => ctx.res.on('finish', resolve));

  });

  router.get('*', verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
