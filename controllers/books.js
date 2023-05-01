const Book = require("../models/book");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//response will contain new book object including atleast _id and title
exports.createBook = catchAsync(async (req, res, next) => {
  const title = req.body.title;
  if (!title) return next(new AppError("missing required field title"));

  const book = await Book.create(req.body);

  book.comments = undefined;
  book.commentcount = undefined;

  res.status(200).json(book);
});

//response will be array of book objects
//json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
exports.getAllBooks = catchAsync(async (req, res, next) => {
  const books = await Book.find().select("-__v").select("-comments");

  res.status(200).json(books);
});

//if successful response will be 'complete delete successful'
exports.deleteAllBooks = catchAsync(async (req, res, next) => {
  await Book.deleteMany();

  res.status(200).type("text").send("complete delete successful");
});

//json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
exports.getBook = catchAsync(async (req, res, next) => {
  const bookid = req.params.id;
  const book = await Book.findById(bookid).select("-commentcount");

  if (!book) return next(new AppError("no book exists"));

  res.status(200).json(book);
});

//json res format same as .get
exports.addComment = catchAsync(async (req, res, next) => {
  const comment = req.body.comment;
  const bookid = req.params.id;
  if (!comment) return next(new AppError("missing required field comment"));

  const book = await Book.findByIdAndUpdate(
    bookid,
    {
      $push: { comments: comment },
      $inc: { commentcount: 1 },
    },
    { new: true }
  );

  if (!book) return next(new AppError("no book exists"));

  book.commentcount = undefined;
  res.status(200).json(book);
});

//if successful response will be 'delete successful'
exports.deleteBook = catchAsync(async (req, res, next) => {
  let bookid = req.params.id;
  const book = await Book.findByIdAndDelete(bookid);

  if (!book) return next(new AppError("no book exists"));

  res.status(200).type("text").send("delete successful");
});
