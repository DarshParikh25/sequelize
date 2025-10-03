# Raw Queries & SQL Security

## What are Raw Queries?

- Sequelize provides high-level APIs (`findAll`, `create`, `update`, etc.).
- But sometimes, you need **direct SQL queries** (for performance or special use cases).
- Sequelize lets you execute raw SQL safely using `sequelize.query`.

## Analogy

Think of Sequelize like a **restaurant menu**:

- Normally, you order from the **menu** (models & ORM methods).
- Sometimes, you want a **custom dish** not on the menu → you ask the chef directly (raw SQL).

## Executing Raw Queries

### Example 1: Simple SELECT<hr/>

```js
const [results, metadata] = await sequelize.query(
  "SELECT * FROM Users WHERE age > 25"
);

console.log(results); // rows returned
console.log(metadata); // query details (row count, etc.)
```

### Example 2: Using Replacements (safe way)<hr/>

```js
const [results] = await sequelize.query(
  "SELECT * FROM Users WHERE age > :ageLimit",
  {
    replacements: { ageLimit: 25 },
    type: sequelize.QueryTypes.SELECT,
  }
);
```

> Prevents SQL injection.

### Example 3: Insert Query<hr/>

```js
await sequelize.query(
  "INSERT INTO Users (name, email, age) VALUES (:name, :email, :age)",
  {
    replacements: { name: "John", email: "john@example.com", age: 30 },
  }
);
```

## Query Types

Sequelize provides query type hints:

```js
const users = await sequelize.query("SELECT * FROM Users", {
  type: sequelize.QueryTypes.SELECT,
});

await sequelize.query("UPDATE Users SET age = 40 WHERE id = 1", {
  type: sequelize.QueryTypes.UPDATE,
});
```

> Ensures Sequelize interprets the result correctly.

## SQL Injection Risks & Security

### Wrong (vulnerable to SQL injection)<hr/>

```js
const [results] = await sequelize.query(
  `SELECT * FROM Users WHERE email = '${userInput}'`
);
```

If `userInput = "'; DROP TABLE Users; --"`, your table is gone.

### Correct (safe)<hr/>

```js
const [results] = await sequelize.query(
  "SELECT * FROM Users WHERE email = :email",
  {
    replacements: { email: userInput },
  }
);
```

## Performance Considerations

1. Raw queries can be **faster** than ORM when:
   - Complex joins or aggregations
   - Heavy reporting queries
2. But ORM is **safer and cleaner** for regular CRUD.

## Common Pitfalls & Debugging Tips

### Pitfalls<hr/>

1. Forgetting replacements → leads to SQL injection risk.
2. Hardcoding values in query string → not reusable.
3. Using raw queries everywhere → defeats the purpose of Sequelize ORM.

### Debugging Tips<hr/>

1. Use `logging: console.log` to check the actual SQL executed.
2. Use `QueryTypes` to avoid confusion with metadata.
3. Test raw queries directly in **DB console** (e.g., psql, MySQL shell) before using in Sequelize.
