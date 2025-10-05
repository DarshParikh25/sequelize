import { Link } from "react-router-dom";
import React from "react";

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
