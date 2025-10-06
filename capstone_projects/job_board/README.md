# Capstone Project

> **Project**: JobQuest — A Modern Job Board Platform

> Stack: **React (Vite + Tailwind)** + **Express.js** + **Sequelize(PostgreSQL)**

## JobQuest — Full-Stack Job Board (Project Overview)

### Project Flow<hr/>

1. Frontend (React + Vite + Tailwind)

   - Built with Vite for fast dev experience.
   - TailwindCSS for styling.
   - Axios for backend communication.
   - React Router for page navigation.
   - Pages: Home, Job Listings, Post a Job, Job Details, Login/Register.

2. Backend (Node.js + Express.js)

   - RESTful API with routes for:
     - **/auth** → signup, login
     - **/jobs** → CRUD operations (create, list, update, delete)
     - **/applications** → apply for jobs
   - Middleware: validation, authentication, and error handling.

3. Database (PostgreSQL via Sequelize)

   - Models:
     - **User** → job seekers & employers
     - **Job** → job postings
     - **Application** → track who applied to what
   - Relations:
     - `User.hasMany(Job)` (employers create jobs)
     - `Job.belongsTo(User)`
     - `User.belongsToMany(Job, { through: Application })`
     - `Job.belongsToMany(User, { through: Application })`

### Full Learning Roadmap (Phase-wise)<hr/>

| Phase | Focus                | Description                                                           |
| ----- | -------------------- | --------------------------------------------------------------------- |
| **1** | Frontend Setup       | React + Vite + Tailwind project setup, folder structure, pages layout |
| **2** | Backend Setup        | Express + Sequelize setup, config, DB connection                      |
| **3** | Database Design      | Define models (User, Job, Application) and associations               |
| **4** | Controllers & Routes | CRUD APIs for jobs and user authentication                            |
| **5** | Frontend Integration | Connect frontend (Axios) → backend (API calls)                        |
| **6** | Advanced Features    | Pagination, search, filters, auth middleware                          |
| **7** | Testing & Deployment | Postman testing, local DB sync, environment setup                     |

### Phase 1 — Frontend Setup (React + Vite + TailwindCSS)<hr/>

#### Goal<hr/>

Create a responsive frontend for JobQuest using React (Vite) and Tailwind CSS — our backend and DB will come later.

#### Step 1 — Initialize Project<hr/>

```bash
npm create vite@latest jobquest-frontend -- --template react
cd jobquest-frontend
npm install
```

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` to confirm the setup.

#### Step 2 — Install TailwindCSS<hr/>

```bash
npm install tailwindcss @tailwindcss/vite
```

Add the `@tailwindcss/vite` plugin to your Vite configuration.

```js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

Add an `@import` to your CSS file that imports Tailwind CSS.

```css
@import "tailwindcss";
```

#### Step 3 — Folder Structure<hr/>

```css
jobquest-frontend/
 ├── src/
 │   ├── components/
 │   │   ├── Navbar.jsx
 │   │   ├── JobCard.jsx
 │   │   ├── JobForm.jsx
 │   ├── pages/
 │   │   ├── Home.jsx
 │   │   ├── JobDetails.jsx
 │   │   ├── PostJob.jsx
 │   │   ├── Login.jsx
 │   │   └── Register.jsx
 │   ├── services/
 │   │   └── api.js
 │   ├── App.jsx
 │   ├── index.css
 │   └── main.jsx
 ├── package.json
 └── tailwind.config.js
```

#### Step 4 — Axios Setup<hr/>

Install:

```bash
npm install axios react-router-dom
```

`src/services/api.js`

```js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});
```

#### Step 5 — Components<hr/>

Navbar.jsx

```jsx
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-blue-600 text-white flex justify-between px-6 py-3">
    <Link to="/" className="text-xl font-semibold">
      JobQuest
    </Link>
    <div className="flex gap-4">
      <Link to="/post-job">Post a Job</Link>
      <Link to="/login">Login</Link>
    </div>
  </nav>
);
export default Navbar;
```

JobCard.jsx

```jsx
import { Link } from "react-router-dom";

const JobCard = ({ job }) => (
  <div className="bg-gray-100 rounded p-4 flex justify-between items-center">
    <div>
      <h3 className="text-xl font-semibold">{job.title}</h3>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500">{job.location}</p>
    </div>
    <Link
      to={`/jobs/${job.id}`}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      View
    </Link>
  </div>
);
export default JobCard;
```

JobForm.jsx

```jsx
import { useState } from "react";
import { api } from "../services/api";

const JobForm = () => {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/jobs", form);
    alert("Job Posted!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      {["title", "company", "location"].map((field) => (
        <input
          key={field}
          name={field}
          value={form[field]}
          onChange={handleChange}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          className="w-full border p-2 rounded"
          required
        />
      ))}
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Job Description"
        className="w-full border p-2 rounded"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Post Job
      </button>
    </form>
  );
};
export default JobForm;
```

Pages Setup

- Home.jsx

  ```jsx
  import Navbar from "../components/Navbar";
  import JobCard from "../components/JobCard";
  import { useEffect, useState } from "react";
  import { api } from "../services/api";

  const Home = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
      (async () => {
        try {
          const res = await api.get("/jobs");
          setJobs(res.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }, []);

    return (
      <div>
        <Navbar />
        <div className="max-w-3xl mx-auto mt-6 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Latest Jobs</h2>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    );
  };

  export default Home;
  ```

- PostJob.jsx

  ```jsx
  import Navbar from "../components/Navbar";
  import JobForm from "../components/JobForm";

  const PostJob = () => {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Post a New Job
          </h2>
          <JobForm />
        </div>
      </div>
    );
  };

  export default PostJob;
  ```

- JobDetails.jsx

  ```jsx
  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import Navbar from "../components/Navbar";
  import { api } from "../services/api";

  const JobDetails = () => {
    const { id } = useParams(); // get job ID from the URL
    const [job, setJob] = useState(null);

    useEffect(() => {
      (async () => {
        try {
          const res = await api.get(`/jobs/${id}`);
          setJob(res.data);
        } catch (error) {
          console.log(error?.message);
        }
      })();
    }, [id]);

    if (!job)
      return <p className="text-center mt-10">Loading job details...</p>;

    return (
      <div>
        <Navbar />
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">{job.title}</h1>
          <p className="text-gray-700 text-lg mb-1">{job.company}</p>
          <p className="text-gray-500 mb-4">{job.location}</p>
          <p className="text-gray-800 leading-relaxed">{job.description}</p>

          <button className="mt-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
            Apply Now
          </button>
        </div>
      </div>
    );
  };

  export default JobDetails;
  ```

- Login.jsx

  ```jsx
  import { useState } from "react";
  import { useNavigate, Link } from "react-router-dom";
  import Navbar from "../components/Navbar";
  import { api } from "../services/api";

  const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await api.post("/auth/login", formData);
        localStorage.setItem("token", res.data.token);
        alert("Login successful!");
        navigate("/");
      } catch (err) {
        alert(err.response?.data?.message || "Login failed!");
      }
    };

    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg p-6 rounded-lg w-96"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  };

  export default Login;
  ```

- Register.jsx

  ```jsx
  import { useState } from "react";
  import { useNavigate, Link } from "react-router-dom";
  import Navbar from "../components/Navbar";
  import { api } from "../services/api";

  const Register = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await api.post("/auth/register", formData);
        alert("Registration successful! You can now log in.");
        navigate("/login");
      } catch (err) {
        alert(err.response?.data?.message || "Registration failed!");
      }
    };

    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg p-6 rounded-lg w-96"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
              Register
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  };

  export default Register;
  ```

Routing — `App.jsx`

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostJob from "./pages/PostJob";
import JobDetails from "./pages/JobDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Routes>
    </Router>
  );
}
export default App;
```

---

Frontend Ready!

We now have:

- Job listing page
- Post job form
- Login & Register forms
- Job Details page
- Routing
- API connection placeholder

### Phase 2: Backend Setup (Express + Sequelize + PostgreSQL)<hr/>

#### Goal<hr/>

Set up a clean Express backend connected to PostgreSQL via Sequelize, ready for defining models and routes.

#### 1. Initialize the backend project<hr/>

Create a separate backend folder:

```bash
mkdir backend
cd backend
npm init -y
```

Install all necessary packages:

```bash
npm install express sequelize pg pg-hstore cors dotenv
npm install --save-dev nodemon
```

Explanation:

| Package            | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `express`          | Web framework for API routes                  |
| `sequelize`        | ORM for SQL databases                         |
| `pg` & `pg-hstore` | PostgreSQL dialect dependencies for Sequelize |
| `cors`             | Enables frontend–backend communication        |
| `dotenv`           | For environment variables                     |
| `nodemon`          | Auto restarts the server during development   |

#### 2. Initialize Sequelize Project<hr/>

Install sequelize-cli:

```bash
npm install --save-dev sequelize-cli
```

Run this command:

```bash
npx sequelize-cli init
```

#### 3. Folder structure<hr/>

```bash
backend/
│
├── config/
│   └── config.js           # DB configuration
│
├── migrations/
│
├── seeders/
│
├── models/
│   └── index.js             # Sequelize initialization
│
├── .env                    # Environment variables
├── server.js               # Entry point
└── package.json
```

#### 4. Setup environment variables (.env)<hr/>

```bash
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=job_board
DB_DIALECT=postgres
```

#### 5. Setup Express server (server.js)<hr/>

```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic route to check API
app.get("/", (req, res) => {
  res.send("Job Board API is running...");
});

// Database connection test
try {
  await sequelize.authenticate();
  console.log("Database connected successfully");
} catch (err) {
  console.error("DB connection failed:", err);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### 6. Configure Sequelize connection (config/config.js)<hr/>

```js
import dotenv from "dotenv";

dotenv.config();

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};
```

#### 7. Initialize Sequelize (models/index.js)<hr/>

```js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // Disable SQL query logs for cleaner console
  }
);

// Test connection
try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
```

#### 8. Create the DB<hr/>

If you have setup `config/config.json`, simply run:

```bash
npx sequelize-cli db:create
```

If you have setup `config/config.js` instead and have only `development` environment, run:

```bash
npx sequelize-cli db:create --config config/config.js
```

If you have setup `config/config.js` and have only different environments (`development`, `test`, `production`), run:

```bash
npx sequelize-cli db:create --config config/config.js --env development
```

#### 9. Run the server<hr/>

```bash
npx nodemon server.js
```

If everything’s correct, you’ll see:

```arduino
Database connected successfully
Server running on port 5000
```

### Phase 3 — Database Design (with Migrations)<hr/>

#### Goal<hr/>

Define `User`, `Job`, and `Application` models, create their migration files, and establish associations — using Sequelize CLI migrations

#### 1. Generate Models & Migrations (via CLI)<hr/>

We’ll use Sequelize CLI to auto-generate both model + migration files.

**User**<hr/>

```bash
npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string
```

**Job**<hr/>

```bash
npx sequelize-cli model:generate --name Job --attributes title:string,description:text,company:string,location:string
```

**Application**<hr/>

```bash
npx sequelize-cli model:generate --name Application --attributes userId:integer,jobId:integer,status:string
```

Each command creates:

```pgsql
/models/user.js
/migrations/XXXXXXXXXXXX-create-user.js

/models/job.js
/migrations/XXXXXXXXXXXX-create-job.js

/models/application.js
/migrations/XXXXXXXXXXXX-create-application.js
```

#### 2. Adjust Migration and Module Files (optional but recommended)<hr/>

1. **/models/user.js**

```js
"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      // No foreign key columns
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [8, 15],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
```

2. **/migrations/XXXXXXXXXXXX-create-user.js**

```js
"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Users");
}
```

3. **/models/job.js**

```js
"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Job extends Model {}
  Job.init(
    {
      // No foreign key columns
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      company: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      location: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Job",
    }
  );
  return Job;
};
```

4. **/migrations/XXXXXXXXXXXX-create-job.js**

```js
"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Jobs", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    company: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Jobs");
}
```

5. **/models/application.js**

```js
"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Application extends Model {}
  Application.init(
    {
      // No foreign key columns
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Application",
    }
  );
  return Application;
};
```

6. **/migrations/XXXXXXXXXXXX-create-application.js**

```js
"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Applications", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      // Foreign key
      reference: {
        model: "Users",
        key: "id",
      },
    },
    jobId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      // Foreign key
      reference: {
        model: "Jobs",
        key: "id",
      },
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Applications");
}
```

#### Define Associations<hr/>

`index.js`

```js
import User from "./user";
import Job from "./job";
import Application from "./application";
import { sequelize } from "../config/db";

User.hasMany(Application, { foreignKey: "userId" });
Application.belongsTo(User, { foreignKey: "userId" });

Job.hasMany(Application, { foreignKey: "jobId" });
Application.belongsTo(Job, { foreignKey: "jobId" });

export { sequelize, User, Job, Application };
```

#### Run Migrations<hr/>

Now actually create tables in PostgreSQL:

```bash
npx sequelize-cli db:migrate
```

Output will confirm creation:

```sql
Loaded configuration file "config\config.js".
Using environment "development".
== xxxxxxxxxxxxxx-create-user: migrating =======
== xxxxxxxxxxxxxx-create-user: migrated (0.042s)

== xxxxxxxxxxxxxx-create-job: migrating =======
== xxxxxxxxxxxxxx-create-job: migrated (0.021s)

== xxxxxxxxxxxxxx-create-application: migrating =======
== xxxxxxxxxxxxxx-create-application: migrated (0.018s)
```

#### Verify Table Structure<hr/>

Open your Postgres client (like `psql` or pgAdmin) and check:

```sql
\d "Users";
\d "Jobs";
\d "Applications";
```

You’ll see all columns + foreign keys properly applied.

#### Schema Rollback (if needed)<hr/>

Undo last migration:

```bash
npx sequelize-cli db:migrate:undo
```

Undo all:

```bash
npx sequelize-cli db:migrate:undo:all
```
