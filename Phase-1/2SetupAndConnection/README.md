# Project setup & connection

## Explanation

To use Sequelize with PostgreSQL in your Node.js + React project, you first need to set up Sequelize in the backend. This involves installing required packages, creating a connection to your Postgres database, and verifying that the connection works.

## Step 1: Install Required Packages

```bash
npm install sequelize pg pg-hstore
```

- `sequelize`: the ORM itself.
- `pg`: PostgreSQL driver for Node.js.
- `pg-hstore`: helper library for handling Postgres data type hstore.

## Step 2: Initialize Sequelize Instance

```js
const { Sequelize } = require(`sequelize`);

const sequelize = new Sequelize(`database`, `username`, `password`, {
  host: `localhost`,
  dialect: "postgres",
  logging: console.log,
});
```

- Replace `database`, `username`, and `password` with your actual Postgres database credentials.
- `dialect` is set to `postgres` since we’re focusing only on Postgres but can be one of `mysql`, `postgres`, `sqlite`, `mariadb`, `mssql`, `db2`, `snowflake`, `oracle`.

## Step 3: Test the Connection

```js
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();
```

- If everything is correct, you’ll see the success message.
- If not, check your credentials and make sure PostgreSQL is running on port `5432`.

## Analogy

Think of this step like introducing yourself at the gate before entering a building. You show your ID (credentials), and if valid, the guard (Postgres) lets you in.
