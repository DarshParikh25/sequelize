# Eager Loading Patterns

## What is Eager Loading?

- Eager loading means **fetching related data (associations) at the same time as the main model**, instead of making multiple separate queries.
- This avoids the “N+1 query problem” and keeps queries efficient.

## Analogy

Think of it like ordering a burger meal combo.

- **Lazy Loading** → You first buy a burger, then go back again to order fries, then again for the drink (multiple trips).
- **Eager Loading** → You order the combo once, and you get burger, fries, and drink together in one go (single query with joins).

## 1. Basic Eager Loading (Single Include)

Fetch a model along with its directly associated model in one query.

Fetch users with their profile.

```js
User.findAll({
  include: [{ model: Profile, as: "profile" }],
});
```

SQL Equivalent

```sql
SELECT "Users".*, "profile".*
FROM "Users"
LEFT JOIN "Profiles" AS "profile"
ON "Users"."id" = "profile"."userId";
```

**Takeaway** → Simple `LEFT JOIN`.

## 2. Multiple Includes

Load multiple associations in the same query.

Fetch users with their profile and posts.

```js
User.findAll({
  include: [
    { model: Profile, as: "profile" },
    { model: Post, as: "posts" },
  ],
});
```

SQL Equivalent

```sql
SELECT "Users".*, "profile".*, "posts".*
FROM "Users"
LEFT JOIN "Profiles" AS "profile"
  ON "Users"."id" = "profile"."userId"
LEFT JOIN "Posts" AS "posts"
  ON "Users"."id" = "posts"."userId";
```

**Takeaway** → Multiple associations in one query.

## 3. Nested Eager Loading (Deep Include)

Include associations of associations.

Students → Courses → Teacher.

```js
Student.findAll({
  include: [
    {
      model: Course,
      as: "courses",
      include: [{ model: Teacher, as: "teacher" }],
    },
  ],
});
```

SQL Equivalent

```sql
SELECT "Students".*, "courses".*, "teacher".*
FROM "Students"
LEFT JOIN "Courses" AS "courses"
  ON "Students"."id" = "courses"."studentId"
LEFT JOIN "Teachers" AS "teacher"
  ON "courses"."teacherId" = "teacher"."id";
```

**Takeaway** → Build multi-level joins.

## 4. Required vs Optional Loading

Only fetch users who have posts.

```js
User.findAll({
  include: [
    {
      model: Post,
      as: "posts",
      required: true, // INNER JOIN
    },
  ],
});
```

SQL Equivalent

```sql
SELECT "Users".*, "posts".*
FROM "Users"
INNER JOIN "Posts" AS "posts"
ON "Users"."id" = "posts"."userId";
```

**Takeaway** → `required: true` = INNER JOIN, default = LEFT JOIN.

## 5. Scoped / Filtered Includes

Fetch users with only published posts.

```js
User.findAll({
  include: [
    {
      model: Post,
      as: "posts",
      where: { status: "published" },
    },
  ],
});
```

SQL Equivalent

```sql
SELECT "Users".*, "posts".*
FROM "Users"
INNER JOIN "Posts" AS "posts"
ON "Users"."id" = "posts"."userId"
WHERE "posts"."status" = 'published';
```

**Takeaway** → Add `where` conditions inside includes.

## 6. Limiting + Ordering in Includes

Fetch users with their latest 3 posts.

```js
User.findAll({
  include: [
    {
      model: Post,
      as: "posts",
      limit: 3,
      order: [["createdAt", "DESC"]],
    },
  ],
});
```

**SQL Equivalent (conceptual)**<br/>
Sequelize uses subqueries to limit posts per user.

**Takeaway** → Use`limit`+`order` for association data.

## 7. Through Table Eager Loading (Many-to-Many)

Students + Courses + Enrollment info.

```js
Student.findAll({
  include: [
    {
      model: Course,
      as: "courses",
      through: { attributes: ["grade", "semester"] },
    },
  ],
});
```

SQL Equivalent

```sql
SELECT "Students".*, "courses".*, "Enrollment"."grade", "Enrollment"."semester"
FROM "Students"
JOIN "Enrollments" ON "Students"."id" = "Enrollments"."studentId"
JOIN "Courses" AS "courses"
  ON "Enrollments"."courseId" = "courses"."id";
```

**Takeaway** → Use `through` to access join **table** columns.

## 8. Selecting / Excluding Attributes

Fetch users without password, posts with only titles.

```js
User.findAll({
  attributes: { exclude: ["password"] },
  include: [
    {
      model: Post,
      as: "posts",
      attributes: ["title"],
    },
  ],
});
```

SQL Equivalent

```sql
SELECT "Users"."id", "Users"."name", "posts"."title"
FROM "Users"
LEFT JOIN "Posts" AS "posts"
ON "Users"."id" = "posts"."userId";
```

**Takeaway** → Keep queries light by selecting only needed columns.

## Common Pitfalls & Debugging Tips

### Pitfalls<hr/>

1. Forgetting `as` → alias in include must match the one defined in association.
2. Using `required: true` when you want optional data → might filter out parent rows.
3. Over-fetching → don’t include everything; it slows queries.
4. `limit` inside include → works only with subqueries, can cause confusion.

### Debugging Tips<hr/>

1. Use `logging: console.log` in Sequelize config to see generated SQL.
2. Check if association is defined with the same `as` used in include.
3. Test SQL in a DB client (like pgAdmin) to confirm results.
4. If queries are slow, review includes and attributes to reduce joins.
