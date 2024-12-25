module.exports = (fn) => {
  // we can use "catch" since this function is async
  // it returns a promise
  return (req, res, next) => {
    // fn(req, res, next).catch(err => next(err));
    fn(req, res, next).catch(next);
  };
};