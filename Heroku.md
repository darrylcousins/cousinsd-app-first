# Installing on Heroku

url: https://fast-spire-96062.herokuapp.com/
database: Created postgresql-reticulated-46490 as ``DATABASE_URL``

Drop and recreate the database with ``pg:reset``. Push local database data with ``pg:push``.

```bash
heroku pg:reset --confirm fast-spire-96062 DATABASE_URL
PGUSER=cousinsd PGPASSWORD=******** heroku pg:push shopify_app DATABASE_URL
```

process.ENV variables are set up with heroku dashboard.
