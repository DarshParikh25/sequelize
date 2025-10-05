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
      api.get("/jobs").then((res) => setJobs(res.data));
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
      api.get(`/jobs/${id}`).then((res) => setJob(res.data));
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
- Routing
- API connection placeholder
