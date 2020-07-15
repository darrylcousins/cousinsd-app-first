require('isomorphic-fetch');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const Router = require('@koa/router');
const {receiveWebhook, registerWebhook} = require('@shopify/koa-shopify-webhooks');
const bodyParser = require('koa-body');
const pdfMakePrinter = require('pdfmake/src/printer');
const csv = require('csv');

const ENV = require('./config');
const { graphQLServer } = require('./graphql');
const getSubscriptionUrl = require('./server/getSubscriptionUrl');
const productCreate = require('./webhooks/products/create');
const productDelete = require('./webhooks/products/delete');
const productUpdate = require('./webhooks/products/update');
const orderCreate = require('./webhooks/orders/create');
const orderUpdated = require('./webhooks/orders/updated');
const orderDelete = require('./webhooks/orders/delete');
const shopRedact = require('./webhooks/shops/redact');
const customerRedact = require('./webhooks/customers/redact');
const customerDataRequest = require('./webhooks/customers/data-request');
const authCallback = require('./webhooks/auth/callback');

const port = parseInt(ENV.PORT, 10) || 3000;
const dev = ENV.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const ApiVer = ApiVersion.April20;

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
          apiVersion: ApiVer
        });

        await registerWebhook({
          address: `${ENV.HOST}/webhooks/products/delete`,
          topic: 'PRODUCTS_DELETE',
          accessToken,
          shop,
          apiVersion: ApiVer
        });

        await registerWebhook({
          address: `${ENV.HOST}/webhooks/products/update`,
          topic: 'PRODUCTS_UPDATE',
          accessToken,
          shop,
          apiVersion: ApiVer
        });

        await registerWebhook({
          address: `${ENV.HOST}/webhooks/orders/create`,
          topic: 'ORDERS_CREATE',
          accessToken,
          shop,
          apiVersion: ApiVer
        });

        await registerWebhook({
          address: `${ENV.HOST}/webhooks/orders/delete`,
          topic: 'ORDERS_DELETE',
          accessToken,
          shop,
          apiVersion: ApiVer
        });

        await registerWebhook({
          address: `${ENV.HOST}/webhooks/orders/updated`,
          topic: 'ORDERS_UPDATED',
          accessToken,
          shop,
          apiVersion: ApiVer
        });

        //await getSubscriptionUrl(ctx, accessToken, shop);
        ctx.redirect("/");
      }
    })
  );

  server.use(graphQLProxy({version: ApiVer}))

  server.use(async (ctx, next) => {
    if (ctx.path === '/graphql' || ctx.path.includes('/webhooks')) {
      return await next();
    }
    await bodyParser()(ctx, next);
  });


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
  // end mandatory webhooks

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

  // order webhooks
  router.post('/webhooks/orders/create', webhook, (ctx) => {
    orderCreate(ctx.state.webhook, ENV.SHOP_ID);
  });

  router.post('/webhooks/orders/updated', webhook, (ctx) => {
    orderUpdated(ctx.state.webhook, ENV.SHOP_ID);
  });

  router.post('/webhooks/orders/delete', webhook, (ctx) => {
    orderDelete(ctx.state.webhook);
  });

  /* handle object getters */
  router.get('/api/:object', verifyRequest(), async (ctx, next) => {
    const type = ctx.params.object;
    const { shop, accessToken } = ctx.session;
    const url = `https://${shop}/admin/api/${ApiVer}/${type}.json?limit=250`;
    const result = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    })
    .then(response => response.json())
    .catch(err => console.log(err));

    ctx.body = result;
    ctx.set('Content-Type', 'application/json');
    ctx.respond = true;
    ctx.res.statusCode = 200;
  });
  /* end handle object getters */

  /* handle object create */
  router.post('/api/:object', verifyRequest(), async (ctx, next) => {
    const type = ctx.params.object;
    const data = ctx.request.body;
    const { shop, accessToken } = ctx.session;
    const url = `https://${shop}/admin/api/${ApiVer}/${type}.json`;
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .catch(err => console.log(err));

    ctx.body = result;
    ctx.set('Content-Type', 'application/json');
    ctx.respond = true;
    ctx.res.statusCode = 200;
  });
  /* end handle object create */

  /* handle order get by id */
  router.get('/api/:object/:id', verifyRequest(), async (ctx) => {
    const id = ctx.params.id;
    const type = ctx.params.object;
    const { shop, accessToken } = ctx.session;
    const url = `https://${shop}/admin/api/${ApiVer}/${type}/${id}.json`;
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    })
    .then(response => response.json())
    .catch(err => console.log(err));

    ctx.body = result;
    ctx.set('Content-Type', 'application/json');
    ctx.respond = true;
    ctx.res.statusCode = 200;
  });
  /* end handle order get by id */

  /* handle order delete */
  router.delete('/api/:object/:id', verifyRequest(), async (ctx) => {
    const id = ctx.params.id;
    const type = ctx.params.object;
    const { shop, accessToken } = ctx.session;
    const url = `https://${shop}/admin/api/${ApiVer}/${type}/${id}.json`;
    const result = await fetch(url, {
      method: 'DELETE',
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    })
    .then(response => response.json())
    .catch(err => console.log(err));

    ctx.body = result;
    ctx.set('Content-Type', 'application/json');
    ctx.respond = true;
    ctx.res.statusCode = 200;
  });
  /* end handle order delete */

  /* handle pdf creation */
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
    ctx.set('Content-Type', 'application/pdf');
    ctx.set('Content-Disposition', 'application; filename=labels.pdf');
    ctx.respond = true;
    ctx.res.statusCode = 200;
    return new Promise(resolve => ctx.res.on('finish', resolve));
  });
  /* end handle pdf creation */

  /* handle csv creation */
  router.post('/csv', verifyRequest(), async (ctx) => {
    const rows = ctx.request.body;
    const t = csv.stringify(rows, {quoted_string: true, delimiter: ';'});
    t.pipe(ctx.res);
    ctx.set('Content-Type', 'text/csv');
    ctx.set('Content-Disposition', 'attachment; filename=export.csv');
    ctx.respond = true;
    ctx.res.statusCode = 200;
    return new Promise(resolve => ctx.res.on('end', resolve));
  });
  /* end handle pdf creation */

  router.get('/(.*)', verifyRequest(), async (ctx, next) => {
    ctx.req.locals = {};
    ctx.req.locals.context = {};
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;

    //try {
      // Provide react-router static router with a context object
      // https://reacttraining.com/react-router/web/guides/server-rendering
      // console.log(ctx);
    //  ctx.req.locals = {};
    //  ctx.req.locals.context = {};
    //  ctx.respond = false;
    //  ctx.res.statusCode = 200;
    //  app.render(ctx.req, ctx.res, '/');
    //} catch(e) {
    //  console.log(e);
    //  next(e);
    //}
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
