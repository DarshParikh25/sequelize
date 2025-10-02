# Transactions (essential)

## What is a Transaction?

A **transaction** is like a **safety box**:

- You put multiple operations inside it.
- Either **all succeed** (COMMIT) or **none succeed** (ROLLBACK).
- This prevents inconsistent data when something fails halfway.

### Analogy<hr/>

Imagine buying multiple items at a store. If your card payment fails, the cashier won’t let you leave with half the items — the whole purchase is canceled.

## Why Transactions?

Without transactions:

- You could insert a record into one table but fail in another → database inconsistency.

With transactions:

- All changes are atomic (all-or-nothing).

## Types in Sequelize

### 1. Unmanaged Transaction (Manual Control)<hr/>

You control commit/rollback.

```js
const t = await sequelize.transaction();

try {
  const user = await User.create(
    { name: "Jin", email: "jin@example.com" },
    { transaction: t }
  );

  await Post.create({ title: "My Post", userId: user.id }, { transaction: t });

  await t.commit(); // must commit manually
  console.log("Transaction committed!");
} catch (error) {
  await t.rollback(); // must rollback manually
  console.error("Transaction rolled back:", error.message);
}
```

### 2. Managed Transaction (Recommended)<hr/>

Sequelize controls commit/rollback for you.

```js
try {
  const result = await sequelize.transaction(async (t) => {
    const user = await User.create(
      { name: "Alice", email: "alice@example.com" },
      { transaction: t }
    );

    await Post.create(
      { title: "Hello World", userId: user.id },
      { transaction: t }
    );

    return user; // auto COMMIT happens if no error
  });

  console.log("Transaction committed:", result.toJSON());
} catch (error) {
  console.error("Transaction rolled back:", error.message);
}
```

- If all operations succeed → COMMIT.
- If an error occurs → ROLLBACK.

### SQL Equivalent<hr/>

```sql
BEGIN;

INSERT INTO "Users" ("name","email") VALUES ('Alice','alice@example.com');
INSERT INTO "Posts" ("title","userId") VALUES ('Hello World', 1);

COMMIT;
-- If error happens:
ROLLBACK;
```

### 3. SAVEPOINT (Rollback to a checkpoint)<hr/>

If you mess up, you don’t restart the whole game — you just return to the checkpoint.

### Analogy:<br/>

Like a video game checkpoint.

```js
const t = await sequelize.transaction();

try {
  const user = await User.create(
    { name: "Charlie", email: "charlie@example.com" },
    { transaction: t }
  );

  // Create a SAVEPOINT
  const sp = await t.transaction();

  try {
    await Post.create(
      { title: "First Post", userId: user.id },
      { transaction: sp }
    );

    await sp.commit(); // commit the savepoint
  } catch (err) {
    await sp.rollback(); // rollback only the savepoint
    console.log("Rolled back to savepoint:", err.message);
  }

  await t.commit(); // outer transaction still succeeds
} catch (error) {
  await t.rollback(); // rollback everything
}
```

### SQL Equivalent<hr/>

```sql
BEGIN;

INSERT INTO "Users" ("name","email") VALUES ('Charlie','charlie@example.com');

SAVEPOINT sp1;

INSERT INTO "Posts" ("title","userId") VALUES ('First Post', 2);

-- If error occurs:
ROLLBACK TO SAVEPOINT sp1;

-- Continue with outer transaction
COMMIT;
```

## Common Pitfalls & Debugging Tips

1. Forgetting `{ transaction: t }` → query runs outside the transaction.
2. Using transactions without `try/catch` → can leave hanging connections.
3. Always log errors to see why rollback happened.
4. Keep transactions short (avoid long-running logic inside).
