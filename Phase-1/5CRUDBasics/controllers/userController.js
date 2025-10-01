// controllers/userController.js
import { User } from "../models";

// Create
export async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    // const user = await User.create({ // req data
    //    name: "Jack",
    //    email: "jck32@example.com",
    //    age: 25,
    //  });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Read
export async function getAllUsers(_req, res) {
  const allUsers = await User.findAll();
  res.json(allUsers);
}

export async function getAUser(req, res) {
  const oneUser = await User.findOne({
    where: req.body,
  });
  // const oneUser = await User.findOne({
  //    where: { email: "jck32@example.com" }, // req.body
  //  });
  res.json(oneUser);
}

export async function getUserByPK(req, res) {
  const { pk } = req.body;

  const userByPk = await User.findByPk(pk);
  // const userByPk = await User.findByPk(1); // req.body
  res.json(userByPk);
}

// Update
export async function updateUser(req, res) {
  const { id } = req.params;

  await User.update(req.body, { where: { id } });
  // const updated = await User.update(
  //    { age: 26 }, // req.body
  //    { where: { id: 1 } } // req.params
  // );
  res.json({ message: "User updated" });
}

// Delete
export async function deleteUser(req, res) {
  await User.destroy({ where: req.body });
  // const deleted = await User.destroy({
  //    where: { email: "jck32@example.com" }, // req.body
  // });
  res.json({ message: "User deleted" });
}
