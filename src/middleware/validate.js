'use strcit';
/**
 * A route passes it's model's sepcific
 * 'joiValidate' function to validate
 * the request's body.
 *
 * This removes code duplication
 *
 * A route has to explicitly state that
 * this middleware has to be used
 */
module.exports = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next();
  };
};
