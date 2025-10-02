# Hooks and Validations

## Hooks (Lifecycle Events)

- Think of **hooks** like "event listeners" on your models.
- They run **before** or **after** certain Sequelize operations.

### Analogy:<hr/>

Hooks are like the **check-in and check-out** staff at a hotel:

- Before you check in → they verify your ID.
- After you check out → they clean up the room.

### Common Hooks<hr/>

- `beforeCreate`, `afterCreate`
- `beforeUpdate`, `afterUpdate`
- `beforeDestroy`, `afterDestroy`
- `beforeValidate`, `afterValidate`
- `beforeSave` (runs for both create & update)

### Example Code (User model)<hr/>

```js
User.init(
  {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    hooks: {
      beforeCreate: (user, options) => {
        console.log("Before creating:", user.name);
      },
      afterCreate: (user, options) => {
        console.log("After creating:", user.email);
      },
    },
  }
);
```

When you run:

```js
await User.create({ name: "Jack", email: "jack@example.com" });
```

Console:

```js
Before creating: Jack
After creating: jack@example.com
```

## Validations

- Sequelize supports **built-in** and **custom** validations.
- They run **before saving** to the database.

### Built-in Validations<hr/>

```js
email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: {
    isEmail: true,   // must be valid email format
    notEmpty: true,  // cannot be empty string
    len: [5, 50],    // must be between 5–50 chars
  },
},
```

### Custom Validation<hr/>

```js
age: {
  type: DataTypes.INTEGER,
  validate: {
    isAdult(value) {
      if (value < 18) {
        throw new Error("User must be at least 18 years old");
      }
    },
  },
},
```

### Quick Example Run<hr/>

```js
try {
  await User.create({ name: "Tom", email: "not-an-email", age: 15 });
} catch (err) {
  console.error(err.errors.map((e) => e.message));
}
```

Output:

```bash
["Validation isEmail on email failed", "User must be at least 18 years old"];
```

## Key Difference

- **Hooks** = trigger extra logic before/after Sequelize actions.
- **Validations** = enforce data rules before saving into DB.
