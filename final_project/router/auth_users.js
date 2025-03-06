const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

JWT_SECRET = "Taha";
let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  return true;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.username;
  const password = req.password;

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ error: "invalid" });
  }
  const token = jwt.sign({ password: password }, JWT_SECRET, {
    expiresIn: 60 * 60,
  });
  return res.status(200).json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  const isbn = req.params.isbn;
  const review = req.query.review;
  if (!review) {
    return res.status(400).json({ message: "Missing review" });
  }
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = review;
    return res.json({ message: "Review modified successfully" });
  }
  books[isbn].reviews[username] = review;
  return res.json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(400).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
