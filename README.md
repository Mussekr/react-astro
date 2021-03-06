# react-astro

## Development environment

1. Install nodejs@4 and postgres
2. Add a postgres db and a user
3. Backend: `PGUSER=... PGPASSWORD=... PGDATABASE=... npm start` (replace ... with correct values)
4. Frontend: `npm run watch`

## DB Migrations

When the DB schema changes, create migrations:

1. `npm run migrate -- create [migration-name-of-your-choice] --sql-file`
2. Navigate to `migrations/sqls`, edit SQL files ending with `[migration-name-of-your-choice]-down.sql` and `[migration-name-of-your-choice]-up.sql`
3. `PGUSER=... PGPASSWORD=... PGDATABASE=... npm run migrate up`

## Deployment

1. `git push heroku master`
2. (if db schema has changed:) `heroku run npm run prod-migrate`
