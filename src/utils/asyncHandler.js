const asyncHandler = requestHandler => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(error => {
      res.error(500, error.message);
    });
  };
};

export { asyncHandler };
