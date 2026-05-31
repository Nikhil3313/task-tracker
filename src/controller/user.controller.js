import User from "../models/User.js";

const publicUserFields = "name email role organization createdAt updatedAt";

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find({
      organization: req.user.organization
    }).select(publicUserFields);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "User not found"
      });
    }

    user.role = req.body.role;
    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Admins cannot delete their own account"
      });
    }

    const user = await User.findOne({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "User not found"
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted"
    });
  } catch (error) {
    next(error);
  }
};
