# Advanced Associations

## 1. One-to-One with Custom Foreign Key + Alias

```js
// User <-> Profile (1-to-1)
User.hasOne(Profile, { foreignKey: "userId", as: "profile" });
Profile.belongsTo(User, { foreignKey: "userId", as: "user" });
```

- `foreignKey: "userId"` → column in `Profiles` table.
- `as: "profile"` → alias used when including:

```js
const user = await User.findByPk(1, { include: "profile" });
```

## 2. One-to-Many with Aliases

```js
// User <-> Post (1-to-many)
User.hasMany(Post, { foreignKey: "authorId", as: "posts" });
Post.belongsTo(User, { foreignKey: "authorId", as: "author" });
```

Querying with alias:

```js
const userWithPosts = await User.findOne({
  where: { id: 1 },
  include: [{ model: Post, as: "posts" }],
});
```

## 3. Many-to-Many with through Table

```js
// Post <-> Tag (M-to-M)
Post.belongsToMany(Tag, {
  through: "PostTags",
  foreignKey: "postId",
  otherKey: "tagId",
  as: "tags",
});
Tag.belongsToMany(Post, {
  through: "PostTags",
  foreignKey: "tagId",
  otherKey: "postId",
  as: "posts",
});
```

- Sequelize auto-creates PostTags join table unless you define it manually.
- Querying:

```js
const post = await Post.findByPk(1, { include: "tags" });
```

## 4. Self-Referencing Association

Example: User following other Users.

```js
User.belongsToMany(User, {
  through: "UserFollowers",
  as: "followers",
  foreignKey: "followingId",
  otherKey: "followerId",
});

User.belongsToMany(User, {
  through: "UserFollowers",
  as: "following",
  foreignKey: "followerId",
  otherKey: "followingId",
});
```

## 5. Scoped / Filtered Associations

You can scope associations so they automatically filter results.

```js
User.hasMany(Post, {
  foreignKey: "userId",
  as: "publishedPosts",
  scope: { status: "published" },
});
```

Now:

```js
const user = await User.findByPk(1, { include: "publishedPosts" });
```

This will only bring posts where `status = 'published'`.

## 6. Through Model with Extra Fields

Instead of just a join table, you can make it a full model with additional columns (like `role`, `createdAt`).

```js
User.belongsToMany(Project, { through: Membership });
Project.belongsToMany(User, { through: Membership });
```

Where `Membership` is a separate model:

```js
Membership.init(
  {
    role: DataTypes.STRING,
  },
  { sequelize }
);
```

## 7. Nested Eager Loading

```js
const users = await User.findAll({
  include: [
    {
      model: Post,
      as: "posts",
      include: [{ model: Comment, as: "comments" }],
    },
  ],
});
```

## Common Pitfalls & Debugging Tips

- Forgetting `as` → If you defined `as: "courses"`, you must use the same alias in `include`.
- Not defining a custom join model → You won’t be able to store extra fields like `grade`.
- Wrong foreign keys → Ensure `studentId` and `courseId` match the join table columns.
- Debugging tip: Check generated SQL by enabling Sequelize logging to verify the joins.
