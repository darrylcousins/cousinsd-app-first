# shopify-app-first
First crack at a shopify app

# install

```bash
  npm install
  npx sequelize-cli db:migrate
```

# development

```bash
  npx ngrok http 3000
```

Check .env for correct tunnel url, i.e. HOST variable.

And in second terminal:

```bash
  npm run dev
```

# install (or reinstall) to shopify development server

Load url:

```
  https://NGROKADDRESS.io/auth?shop=TESTSTORE.myshopify.com
```
