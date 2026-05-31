const errorHandler =
(
  err,
  req,
  res,
  next
) => {

  console.error(err);

  res.status(
    err.status || 500
  )
  .json({

    status:
    err.status || 500,

    code:
    err.code ||
    "INTERNAL_ERROR",

    message:
    err.message ||
    "Internal Server Error"

  });
};

export default errorHandler;