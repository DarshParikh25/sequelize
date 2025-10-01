# Associations (Basic)

## What are Associations?

- In relational databases, tables are rarely isolated — they’re linked.
- Sequelize associations define **relationships between models** so you can query related data easily.

## Types of Associations

1. `hasOne` + `belongsTo` (1:1 relationship)

   - Example: A **User** has one **Profile**, and that Profile belongs to the User.
   - DB: Foreign key goes on the `Profile` table.

   ```js
   // models/user.js
   User.hasOne(Profile, { foreignKey: "userId" });

   // models/profile.js
   Profile.belongsTo(User, { foreignKey: "userId" });
   ```

2. `hasMany` + `belongsTo` (1:N relationship)

   - Example: A **User** has many **Posts**, each Post belongs to one User.
   - DB: Foreign key goes on the `Post` table.

   ```js
   // models/user.js
   User.hasMany(Post, { foreignKey: "userId" });

   // models/post.js
   Post.belongsTo(User, { foreignKey: "userId" });
   ```

3. `belongsToMany` (M:N relationship with join table)

   - Example: A **Post** can have many **Tags**, and a Tag can belong to many Posts.
   - DB: Sequelize auto-creates a join table (`PostTags`).

   ```js
   // models/post.js
   Post.belongsToMany(Tag, { through: "PostTags" });

   // models/tag.js
   Tag.belongsToMany(Post, { through: "PostTags" });
   ```

## Example

```js
// models/user.js
class User extends Model {
  static associate(models) {
    // One user -> many posts
    User.hasMany(models.Post, { foreignKey: "userId" });
  }
}

// models/post.js
class Post extends Model {
  static associate(models) {
    // Each Post belongs to one user
    Post.belongsTo(models.User, { foreignKey: "userId" });
  }
}

// controllers/postController.js
import { Post, User } from "../models/index.js";

// Create a post for a user
const post = await Post.create({ title: "First Post", userId: 1 });

// Fetch posts with user info included
const posts = await Post.findAll({
  include: User, // eager load associated user
});
```

## Common Pitfalls and Debugging Tips

1. **Forgetting** `foreignKey`
   - Sequelize will auto-generate one (`userId`, `authorId`) but it might not match your migration schema → always specify it for clarity.
2. **Mismatched table/column names**
   - If your migration calls it `author_id` but your model says `authorId`, Sequelize gets confused → fix using `foreignKey` + `underscored: true`.
3. **Forgetting to call** `associate`
   - If you don’t call the associations inside `models/index.js`, relations won’t exist.
   - Always ensure `models/index.js` calls `associate` for each model.
4. **N+1 queries**
   - If you forget `include`, Sequelize may run one query per row (slow). Always eager-load (`include`) when you need related data.
