const express = require("express");
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const authorBooks = [];

  for (const book in books) {
    if (books[book].author === author) {
      authorBooks.push(books[book]);
    }
  }

  if (authorBooks.length > 0) {
    res.send(authorBooks);
  } else {
    res.status(404).send("No books found for author");
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  const filteredBooks = Object.values(books).filter((book) =>
    book.title.toLowerCase().includes(title)
  );
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  const reviews = books[isbn].reviews;
  return res.status(200).json({ reviews: reviews });
});

async function getBooks() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 100); // Simulate async delay
  });
}

public_users.get("/asyncbooks", async function (req, res) {
  try {
    // Simulate an asynchronous operation (e.g., fetching from a database)
    const bookData = await getBooks(); // Assuming `getBooks` is an async function
    res.json(bookData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports.general = public_users;
