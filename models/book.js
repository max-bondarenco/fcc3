const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  comments: {
    type: [String],
  },

  commentcount: {
    type: Number,
    default: 0,
  },
});

bookSchema.pre(/find*/, function (next) {
  this.select("-__v");
  next();
});

module.exports = mongoose.model("Book", bookSchema);
