# Pagination (Offset & Cursor-based)

## What is Pagination?

Pagination is the process of splitting large sets of data into smaller, manageable chunks when fetching from the database.

Instead of loading all rows (which is heavy and slow), we request only a portion (page) of the data.

## Analogy

Think of a big book :

- **Offset pagination** = you flip pages by skipping a fixed number (e.g., go to page 5 → skip first 40 results if 10 per page).
- **Cursor pagination** = instead of counting pages, you keep a bookmark (cursor) at the last read position (e.g., “start from the last seen user ID and fetch the next 10”).

## Offset Pagination

Good for small datasets but gets slower with millions of rows (because the DB still scans skipped rows).

```js
// Fetch page 2, 10 users per page
const page = 2;
const limit = 10;
const offset = (page - 1) * limit;

const users = await User.findAll({
  limit,
  offset,
  order: [["createdAt", "DESC"]], // recent first
  attributes: ["id", "name", "email"],
});

console.log(users.map((u) => u.toJSON()));
```

**SQL Equivalent:**

```sql
SELECT id, name, email
FROM "Users"
ORDER BY "createdAt" DESC
LIMIT 10 OFFSET 10;
```

## Cursor-Based Pagination

More efficient for large data or infinite scrolling (social media feeds, chats).

Instead of `offset`, you use a **cursor (like last ID or timestamp)**.

```js
// Assume client gives us last seen userId = 50
const lastSeenId = 50;

const users = await User.findAll({
  where: {
    id: { [Op.gt]: lastSeenId }, // fetch users with ID > 50
  },
  limit: 10,
  order: [["id", "ASC"]],
});
```

**SQL Equivalent:**

```sql
SELECT *
FROM "Users"
WHERE id > 50
ORDER BY id ASC
LIMIT 10;
```

## When to Use Which

- **Offset pagination** → good for admin dashboards, small datasets, or where total count matters.
- **Cursor pagination** → better for APIs, infinite scrolling, or huge datasets (avoids heavy `OFFSET` scans).

## Common Pitfalls & Debugging Tips

1. Offset pagination slows down for large pages (`OFFSET 100000` is very expensive).
2. Cursor pagination requires **stable ordering** (e.g., by `id` or `createdAt`).
3. Always add an **ORDER BY** clause, or results may shuffle between pages.
4. Test both approaches with sample data to see performance differences.
5. For APIs, return both `data` and **pagination metadata** (like `nextCursor` or `totalPages`).
