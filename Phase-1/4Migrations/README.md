# Migrations (Why & How)

## What are migrations?

Migrations are version control for your database schema. Instead of manually editing tables, you define step-by-step instructions for creating or updating them.

## Installing the CLI

```bash
# Install CLI if not already
npm install --save-dev sequelize-cli
```

## Project bootstrapping

```bash
npx sequelize-cli init
```

This creates:

- `config`, contains config file, which tells CLI how to connect with database
- `models`, contains all models for your project
- `migrations`, contains all migration files
- `seeders`, contains all seed files

## Generating a model + migration

```bash
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
```

This creates:

- `models/user.js` → Defines User model.
- `migrations/xxxx-create-user.js` → Instructions to build `Users` table.

## Comparison and Usage of `model:generate`, `migrate:generate` and `seed:generate`

| Command              | Creates                     | Used for                              | Example                      |
| -------------------- | --------------------------- | ------------------------------------- | ---------------------------- |
| `model:generate`     | Model file + Migration file | **New table + model definition**      | `User` table with attributes |
| `migration:generate` | Migration file only         | **Schema changes** in existing tables | Add `age` to `Users`         |
| `seed:generate`      | Seeder file                 | **Insert demo/sample data**           | Insert `Admin` user          |

---

## Migration file example (auto-generated):

```js
"use strict";

module.exports = {
  // Runs when migration is applied
  async up(queryInterface, Sequelize) {
    // logic for transforming into the new state
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true, // email must be unique
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  // Runs when rollback is applied
  async down(queryInterface, Sequelize) {
    // logic for reverting the changes
    await queryInterface.dropTable("Users");
  },
};
```

## Running migrations

```bash
npx sequelize-cli db:migrate
```

This command will execute these steps:

1. Will ensure a table called `SequelizeMeta` in database. This table is used to record which migrations have run on the current database
2. Start looking for any migration files which haven't run yet. This is possible by checking `SequelizeMeta` table. In this case it will run `XXXXXXXXXXXXXX-create-user.js` migration, which we created in last step.
3. Creates a table called `Users` with all columns as specified in its migration file.

## Undoing last migration

- You can use `db:migrate:undo`, this command will revert the most recent migration.

  ```bash
  npx sequelize-cli db:migrate:undo
  ```

- You can revert back to the initial state by undoing all migrations with the `db:migrate:undo:all` command.

  ```bash
  npx sequelize-cli db:migrate:undo:all
  ```

- You can also revert back to a specific migration by passing its name with the `--to` flag including the passed name as well.

  ```bash
  npx sequelize-cli db:migrate:undo --to xxxxxxxxxx-create-posts.js
  ```

- You can revert back till a specific migration by using both `db:migrate:undo:all` command and passing its name with the `--to` flag.
  ```bash
  npx sequelize-cli db:migrate:undo:all --to xxxxxxxxxx-create-posts.js
  ```

## Step-by-Step Walkthrough

1. `sequelize-cli init` sets up project folders.
2. `model:generate` creates both **model** and **migration file**.
3. Inside migration:
   - `up` → defines how to apply the migration.
   - `down` → defines how to revert it.
4. `db:migrate` executes up methods in order.
5. If something goes wrong, `db:migrate:undo` executes the down method to rollback.

## Analogy

Think of migrations like Git commits but for your database structure. Each migration is a change (like "add column X") that can be applied (up) or rolled back (down).

## Common Pitfalls & Debugging Tips

- **Using `sync({ force: true })` in production**: this drops and recreates all tables → data loss risk. Always use migrations.
- **Forgetting to write down method**: makes rollback impossible. Always include it.
- **Changing migration files after running them**: Avoid this. Instead, create a new migration to modify schema.
- **Tip**: If migration fails, check the database table `SequelizeMeta`. It tracks which migrations have run.
