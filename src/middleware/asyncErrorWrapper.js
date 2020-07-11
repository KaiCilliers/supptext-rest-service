/**
 * Wraps all routes with a try catch
 * There is a module 'express-async-errors' that also does this
 *
 * Catch error and pass on to error module as defined in routes file
 */
module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  };
};
