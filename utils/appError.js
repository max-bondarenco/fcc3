module.exports = class extends Error {
  constructor(message) {
    super(message);

    this.custom = true;

    Error.captureStackTrace(this, this.constructor);
  }
};
