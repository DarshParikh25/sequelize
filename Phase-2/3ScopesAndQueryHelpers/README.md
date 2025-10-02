# Scopes & Query Helpers

## What are Scopes & Query Helpers?

- **Scopes**: Predefined query options (like filters, limits, ordering) that you can reuse across queries.
- **Query Helpers**: Tools like `where`, `Op` operators, `attributes`, `order` etc. that help you build custom queries.

Think of scopes as **saved query templates**, and query helpers as **building blocks** for ad-hoc queries.

## Analogy

Imagine you’re at a coffee shop:

- **Scope** = a preset menu item (like “Latte” → always means coffee + milk). You don’t need to re-explain what Latte means.
- **Query Helper** = asking the barista to **customize** (“add 2 sugars”, “extra hot”, etc.).

Together, they give you **flexibility** + **reusability**.

## Scopes

### 1. Default Scope<hr/>

A scope that **always applies automatically** to model queries unless overridden.

```js
class User extends Model {}
User.init(
  {
    name: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    modelName: "User",
    defaultScope: {
      where: { isActive: true },
    },
  }
);

// Will always fetch only active users
await User.findAll();
```

**SQL Equivalent**

```sql
SELECT * FROM "Users" WHERE "isActive" = true;
```

### 2. Named Scopes<hr/>

Reusable, named filters.

```js
User.addScope("adults", {
  where: { age: { [Op.gte]: 18 } },
});

User.addScope("recent", {
  order: [["createdAt", "DESC"]],
});

// Use it
await User.scope("adults").findAll();
await User.scope(["adults", "recent"]).findAll();
```

**SQL Equivalent**

```sql
SELECT * FROM "Users" WHERE "age" >= 18 ORDER BY "createdAt" DESC;
```

### 3. Dynamic Scopes<hr/>

Scopes that take parameters.

```js
User.addScope("byAge", (min, max) => ({
  where: { age: { [Op.between]: [min, max] } },
}));

await User.scope({ method: ["byAge", 18, 30] }).findAll();
```

**SQL Equivalent**

```sql
SELECT * FROM "Users" WHERE "age" BETWEEN 18 AND 30;
```

## Query Helpers

These are **custom options** you can add directly in queries.

### 1. `attributes`<hr/>

Choose which columns to fetch.

```js
await User.findAll({ attributes: ["name", "email"] });
```

### 2. `where` with Operators<hr/>

Use `Op` helpers (`gt`, `lt`, `in`, etc.).

```js
await User.findAll({
  where: {
    age: { [Op.gt]: 18 },
    name: { [Op.like]: "%John%" },
  },
});
```

### 3. `order`<hr/>

```js
await User.findAll({
  order: [["createdAt", "DESC"]],
});
```

### 4. `limit` & `offset` (pagination)<hr/>

```js
await User.findAll({
  limit: 10,
  offset: 20,
});
```

### 5. Combining Helpers<hr/>

```js
await User.findAll({
  attributes: ["id", "name"],
  where: { age: { [Op.between]: [18, 30] } },
  order: [["name", "ASC"]],
  limit: 5,
});
```

## Common Pitfalls & Debugging Tips

### Pitfalls<hr/>

1. Forgetting to clear `defaultScope` when you need all rows. Use .`unscoped()`.
2. Overusing scopes → too many named scopes can become confusing.
3. Mixing scopes with direct query options → can override unexpectedly.
4. Dynamic scopes require `method` syntax, not just string.

### Debugging Tips<hr/>

1. Use `.scope(null)` or `.unscoped()` to bypass scopes.
2. Log SQL queries (`logging: console.log`) to see applied scopes.
3. Organize scopes logically (e.g., “active”, “recent”, “popular”).
4. Test scopes in isolation before chaining.
