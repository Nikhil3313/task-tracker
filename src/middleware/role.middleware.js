const allowRoles =
(...roles) => {

  return (
    req,
    res,
    next
  ) => {

    if (
      !roles.includes(
        req.user.role
      )
    ) {

      return res.status(403)
      .json({
        status: 403,
        code: "FORBIDDEN",
        message:
        "Permission denied"
      });

    }

    next();
  };
};

export default allowRoles;