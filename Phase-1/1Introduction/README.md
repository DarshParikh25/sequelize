# What is Sequelize & when to use it?

## Explanation

Sequelize is an Object-Relational Mapper (ORM) for Node.js. Instead of writing raw SQL for every database action, you work with JavaScript objects and methods, and Sequelize translates them into SQL queries that PostgreSQL understands.

## Why it helps?

- Saves time — you don’t need to hand‑craft SQL for common tasks like inserting or updating.
- Increases safety — uses parameterized queries, reducing SQL injection risks.
- Organizes code — keeps your database logic structured alongside your app logic.
- Cross‑dialect — works with different SQL databases (though in our roadmap we’ll focus only on PostgreSQL, as it will be similar for other languages).

## Analogy

Imagine you’re in a foreign country (PostgreSQL land) and you only speak JavaScript. Sequelize is your translator. You tell it: “Find all users older than 18”, and Sequelize translates that into the proper SQL command for Postgres.
