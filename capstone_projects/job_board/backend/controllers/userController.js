import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/index.js";

// Create a user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(404).json({
        message: "All fields are required!",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered!",
      });
    }

    if (password.length < 8 || password.length > 15) {
      return res.status(400).json({
        message: "Password must be minimum of 8 and maximum of 15 characters.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    return res.status(201).json({
      message: "User created successfully!",
      user: {
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    let existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(404).json({
        message: "Email is not registered!",
      });
    }

    const userPassword = await bcrypt.compare(password, existingUser.password);
    if (!userPassword) {
      return res.status(401).json({
        message: "Incorrect password!",
      });
    }

    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    return res.status(200).json({
      message: "Login successfully!",
      user: {
        name: existingUser.name,
        email: existingUser.email,
      },
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Internal server error!",
    });
  }
};

// Get all users
export const _getAllUsers = async (_req, res) => {
  try {
    const users = await User.findAll({ attributes: ["name", "email"] });

    if (users.length === 0) {
      return res.status(200).json({
        message: "No user found!",
      });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error!" });
  }
};

// Get user by id
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, { attributes: ["name", "email"] });

    if (!user) {
      return res.status(404).json({
        message: "Cannot find the user!",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error!" });
  }
};
