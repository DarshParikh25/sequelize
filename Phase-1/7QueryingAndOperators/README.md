# Querying & Operators

Sequelize provides a **rich query API** so that instead of writing raw SQL, you can use **JavaScript objects** and **Sequelize operators**.

## 1. Basic Querying

```js
import { User } from "../models/index.js";

// Find all users
const users = await User.findAll();
// SELECT * FROM "Users";
```

```js
// Find one user
const user = await User.findOne({ where: { email: "test@example.com" } });
// SELECT * FROM "Users" WHERE "email" = 'test@example.com' LIMIT 1;
```

```js
// Find by primary key
const userById = await User.findByPk(1);
// SELECT * FROM "Users" WHERE "id" = 1;
```

## 2. Query Operators (`Op`)

Sequelize provides operators (like `=, >, <, LIKE, IN`) via `Sequelize.Op`.

```js
import { Op } from "sequelize";

// Find all users older than 18
const adults = await User.findAll({
  where: {
    age: { [Op.gt]: 18 }, // greater than 18
  },
});
```

---

### Common Operators

| Operator  | Sequelize                                 | SQL Equivalent         |
| --------- | ----------------------------------------- | ---------------------- |
| `Op.eq`   | `{ age: { [Op.eq]: 18 } }`                | `age = 18`             |
| `Op.ne`   | `{ age: { [Op.ne]: 18 } }`                | `age != 18`            |
| `Op.gt`   | `{ age: { [Op.gt]: 18 } }`                | `age > 18`             |
| `Op.gte`  | `{ age: { [Op.gte]: 18 } }`               | `age >= 18`            |
| `Op.lt`   | `{ age: { [Op.lt]: 18 } }`                | `age < 18`             |
| `Op.lte`  | `{ age: { [Op.lte]: 18 } }`               | `age <= 18`            |
| `Op.like` | `{ name: { [Op.like]: "%john%" } }`       | `name LIKE '%john%'`   |
| `Op.in`   | `{ age: { [Op.in]: [18, 21, 25] } }`      | `age IN (18,21,25)`    |
| `Op.or`   | `{ [Op.or]: [{ age: 18 }, { age: 21 }] }` | `age = 18 OR age = 21` |

## 3. Selecting Specific Columns

```js
// Only return name and email
const users = await User.findAll({
  attributes: ["name", "email"],
});
```

## 4. Ordering & Limiting

```js
// Order by age descending
const users = await User.findAll({
  order: [["age", "DESC"]],
});

// Limit results to 5
const users = await User.findAll({
  limit: 5,
});
```

## 5. Combining Conditions

```js
// Find users whose age is between 18 and 30 and name starts with "J"
const users = await User.findAll({
  where: {
    age: { [Op.between]: [18, 30] },
    name: { [Op.like]: "J%" },
  },
});
```

## 6. Including Associations

```js
// Fetch user along with posts
const users = await User.findAll({
  include: [{ model: Post }],
});
```

### SQL equivalent:

```sql
SELECT * FROM "Users"
LEFT OUTER JOIN "Posts" ON "Users"."id" = "Posts"."userId";
```

## Common Pitfalls

1. **Forgetting to import** `Op`:

   ```js
   import { Op } from "sequelize";
   ```

   Without this, Sequelize won’t understand operators.

2. **Confusing** `{}` vs `[]`:
   - `where: { age: 18 }` → exact match
   - `where: { age: { [Op.gt]: 18 } }` → greater than 18
3. **Not using** `include` **for relations**:
   - Simply querying `User.findAll()` won’t fetch related posts. You must explicitly `include`.
4. `findOne` vs `findAll`:
   - `findOne` returns a single object (or null), `findAll` always returns an array.
