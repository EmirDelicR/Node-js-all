exports.errorHandler = (error, req, res, next) => {
  console.log(error);
  res.status(400).send({ error: error.message });
};
