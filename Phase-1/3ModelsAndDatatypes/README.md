# Models & DataTypes

## Explanation

- In Sequelize, models represent tables in your database.
- Each instance of a model represents a row.
- **DataTypes** define the kind of values each column can store.

- Think of a model as a **blueprint** for a table.
- If your app has `Users`, the `User` model defines what fields (columns) exist, what types they hold, and rules like `NOT NULL` or `UNIQUE`.

## Example

### Method 1: Using `sequelize.define`

```js
const { Sequelize, DataTypes, Model } = require("sequelize");

// Create Sequelize instance (connection)
const sequelize = new Sequelize("mydb", "myuser", "mypassword", {
  host: "localhost",
  dialect: "postgres",
});

const User = sequelize.define(
  "User",
  {
    // Primary Key (auto-increment)
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Username must be unique and not null
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Email with validation rule (must be a valid email)
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    // Age with default value
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 18,
    },
  },
  {
    // other model options
    sequelize, // Pass the connection instance
    modelName: "User", // Model name (used internally by Sequelize)
    tableName: "users", // Actual table name in DB
    timestamps: true, // Adds createdAt & updatedAt columns automatically
  }
);
```

---

### Method 2: Extending Model

```js
const { Sequelize, DataTypes, Model } = require("sequelize");

// Create Sequelize instance (connection)
const sequelize = new Sequelize("mydb", "myuser", "mypassword", {
  host: "localhost",
  dialect: "postgres",
});

// Define User model by extending Sequelize's Model class
class User extends Model {}

User.init(
  {
    // Primary Key (auto-increment)
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Username must be unique and not null
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Email with validation rule (must be a valid email)
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    // Age with default value
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 18,
    },
  },
  {
    sequelize, // Pass the connection instance
    modelName: "User", // Model name (used internally by Sequelize)
    freezeTableName: true, // Actual table name in DB will be 'User'
    timestamps: true, // Adds createdAt & updatedAt columns automatically
  }
);
```

## Common DataTypes

- `STRING` → VARCHAR
- `TEXT` → TEXT (large strings)
- `INTEGER`, `BIGINT`
- `BOOLEAN`
- `DATE`, `DATEONLY`
- `DECIMAL`, `FLOAT`
- `JSON`, `JSONB` (Postgres only)
- `ARRAY(DataTypes.STRING)` (Postgres only)

## Analogy

Think of DataTypes like **form fields** on a signup page:

- A text input → `STRING`
- A checkbox → `BOOLEAN`
- A date picker → `DATE`
- A multi-select dropdown → `ARRAY`

The database enforces these rules just like the browser enforces form input types.

## Common Pitfalls & Debugging Tips

- Forgetting `allowNull: false` when a field must be required.
- Using `STRING` for long text → better use `TEXT`.
- Mixing up `DATE` (includes time) vs `DATEONLY` (just YYYY-MM-DD).
- Postgres-only types (like `ARRAY` or `JSONB`) won’t work in MySQL.
- Always give your model a `tableName` explicitly in larger apps to avoid pluralization confusion.
