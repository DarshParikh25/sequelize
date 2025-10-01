# CRUD Basics

## Explanation

CRUD = Create, Read, Update, Delete → the 4 fundamental operations for working with data in any database.

- Sequelize provides simple methods to do each of these while writing JavaScript code instead of raw SQL.

## Analogy

Think of it like using a **remote control for a TV**:

- You could walk up and press buttons on the TV (raw SQL),
- But instead you use the remote (Sequelize methods).

The result is the same, but easier and less error-prone.

## Code Example

1. Create (INSERT new record) - `create`

   ```js
   const newUser = await User.create({
     name: "Alice",
     email: "alice@example.com",
     age: 25,
   });
   // SQL equivalent: INSERT INTO Users (name, email, age) VALUES (...);
   ```

2. Read (SELECT records) - `findAll` / `findOne` / `findByPk`

   ```js
   const allUsers = await User.findAll();
   // SQL equivalent: SELECT * FROM Users;

   const oneUser = await User.findOne({
     where: { email: "alice@example.com" },
   });
   // SQL equivalent: SELECT * FROM Users WHERE email='alice@example.com' LIMIT 1;

   const userByPk = await User.findByPk(1);
   // SQL equivalent: SELECT * FROM Users WHERE id=1;
   ```

3. Update (UPDATE record) - `update`

   ```js
   const updated = await User.update(
     { age: 26 }, // new values
     { where: { email: "alice@example.com" } } // condition
   );
   // SQL equivalent: UPDATE Users SET age=26 WHERE email='alice@example.com';
   ```

4. Delete (DELETE record) - `destroy`

   ```js
   const deleted = await User.destroy({
     where: { email: "alice@example.com" },
   });
   // SQL equivalent: DELETE FROM Users WHERE email='alice@example.com';
   ```

## Common Pitfalls & Debugging Tips

1. **Forgetting** `await` → Sequelize methods return Promises. Always use `await` (or `.then()` if not using async/await).
2. **Wrong** `where` **condition** → If you forget `where`, an update or delete might affect all rows!
   - Example: `User.update({ age: 30 })` (without where) → updates all users!
3. **Not checking return values**:
   - `update` and `destroy` return the number of affected rows, not the updated/deleted object.
   - Use `findOne` or `findByPk` to fetch after updating.
4. **Unique constraints**: Inserting a duplicate email (if `unique: true`) will throw an error → handle with try/catch.
5. **Using** `findAll` **without filters** in large tables → may crash memory by fetching thousands of rows at once. Always use `limit` for pagination in real apps.
