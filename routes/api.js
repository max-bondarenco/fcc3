"use strict";

const booksController = require("../controllers/books");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(booksController.getAllBooks)
    .post(booksController.createBook)
    .delete(booksController.deleteAllBooks);

  app
    .route("/api/books/:id")
    .get(booksController.getBook)
    .post(booksController.addComment)
    .delete(booksController.deleteBook);
};
