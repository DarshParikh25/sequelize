# Bulk Operations & Performance

## What are Bulk Operations?

- Bulk operations = performing many **inserts**, **updates**, or **deletes** in a single query instead of looping one-by-one.
- They improve performance by **reducing database round-trips**.

## Analogy

Think of posting letters:

- **Without bulk** → you take **one letter at a time** to the post office (inefficient).
- **With bulk** → you carry a **bag of letters** and send them all together in one trip (efficient).

## 1. Bulk Create

Insert multiple rows at once.

```js
await User.bulkCreate([
  { name: "Alice", email: "alice@example.com", age: 22 },
  { name: "Bob", email: "bob@example.com", age: 25 },
  { name: "Charlie", email: "charlie@example.com", age: 28 },
]);
```

SQL Equivalent

```sql
INSERT INTO "Users" ("name","email","age")
VALUES
('Alice','alice@example.com',22),
('Bob','bob@example.com',25),
('Charlie','charlie@example.com',28);
```

## 2. Bulk Update

Update multiple rows matching a condition.

```js
await User.update(
  { age: 30 }, // new values
  { where: { age: { [Op.lt]: 18 } } } // condition
);
```

SQL Equivalent

```sql
UPDATE "Users" SET "age" = 30 WHERE "age" < 18;
```

## 3. Bulk Delete

Delete multiple rows at once.

```js
await User.destroy({
  where: { age: { [Op.gt]: 60 } },
});
```

SQL Equivalent

```sql
DELETE FROM "Users" WHERE "age" > 60;
```

## 4. Upsert (Insert or Update)

Insert a new row OR update if it already exists (based on unique key).

```js
await User.upsert({
  id: 1,
  name: "Alice Updated",
  email: "alice@example.com",
  age: 24,
});
```

SQL Equivalent

```sql
INSERT INTO "Users" (id, name, email, age)
VALUES (1, 'Alice Updated', 'alice@example.com', 24)
ON CONFLICT (id)
DO UPDATE SET "name"='Alice Updated', "age"=24;
```

## Performance Tips

1. Use `bulkCreate` instead of looping `create()`.
2. Use `{ returning: true }` if you need inserted rows back.
3. Batch huge inserts (e.g., 10k rows → insert in chunks of 1k).
4. Use **indexes** on columns used in bulk `update`/`destroy` conditions.
5. Use `logging: false` in production bulk operations (to avoid console overhead).

## Common Pitfalls & Debugging Tips

### Pitfalls<hr/>

1. `bulkCreate` skips **hooks/validations** by default unless `{ validate: true }` is passed.
2. `bulkCreate` does not automatically update fields like `updatedAt` unless explicitly set.
3. Using `bulkCreate` on massive datasets without batching can still cause memory/timeout issues.

### Debugging Tips<hr/>

1. Pass `{ individualHooks: true }` if you want hooks to run per row.
2. Use `.upsert()` for conflict handling instead of writing manual logic.
3. Monitor SQL queries with `.logging` to ensure Sequelize is batching correctly.
