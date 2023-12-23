// users.ts
import express from "express";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { User } from "../models/user";

const router = express.Router();
let users: User[] = [
  //   {
  //     id:uuidv4(),
  //     username: 'Maaz Sandarwale',
  //     age: 25,
  //     hobbies: ['Programming', 'Movies'],
  //   },
  //   {
  //     id: uuidv4(),
  //     username: 'Baxture Employee',
  //     age: 30,
  //     hobbies: ['Web Development', 'Travelling'],
  //   },
];

router.post("/users", (req, res) => {
  const { username, age, hobbies } = req.body;

  // Validate request body
  if (!username || !age || !hobbies) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // Create a new user
  const newUser: User = {
    id: uuidv4(),
    username,
    age,
    hobbies,
  };

  // Add the new user to the array (In a real app, you'd save it to a database)
  users.push(newUser);

  res.status(201).json(newUser);
});

// PUT endpoint to update an existing user
router.put("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const { username, age, hobbies } = req.body;

  // Validate UUID
  if (!uuidValidate(userId)) {
    res.status(400).json({ error: "Invalid userId" });
    return;
  }

  // Find the index of the user in the array based on ID
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex !== -1) {
    // Update the user if found
    users[userIndex] = {
      ...users[userIndex],
      username: username || users[userIndex].username,
      age: age || users[userIndex].age,
      hobbies: hobbies || users[userIndex].hobbies,
    };
    res.status(200).json(users[userIndex]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

router.delete("/users/:userId", (req, res) => {
  const userId = req.params.userId;

  // Validate UUID
  if (!uuidValidate(userId)) {
    res.status(400).json({ error: "Invalid userId" });
    return;
  }

  // Find the index of the user in the array based on ID
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex !== -1) {
    // Remove the user if found
    const deletedUser = users.splice(userIndex, 1)[0];
    res.status(204).json({ message: "User deleted successfully", deletedUser }); // 204 No Content for successful deletion
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

router.get("/users", (req, res) => {
  res.status(200).json(users);
});

router.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;
  // Validate UUID
  if (!uuidValidate(userId)) {
    res.status(400).json({ error: `Invalid userId, Status code: 400` });
    return;
  }
  // Find the user in the array based on ID
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: "User not found, Status code: 404" });
  }
});

export default router;
