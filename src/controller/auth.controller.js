import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Organization from "../models/Organization.js";
import RefreshToken from "../models/RefreshToken.js";

import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/jwt.js";

export const register = async (
  req,
  res,
  next
) => {
  try {

    const {
      name,
      email,
      password,
      role,
      organizationName
    } = req.body;

    const existingUser =
    await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        code: "USER_EXISTS",
        message: "User already exists"
      });
    }

    let organization =
    await Organization.findOne({
      name: organizationName
    });

    if (!organization) {

      organization =
      await Organization.create({
        name: organizationName
      });

    }

    const hashedPassword =
    await bcrypt.hash(password, 10);

    const user =
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "MEMBER",
      organization: organization._id
    });

    res.status(201).json({
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

export const login = async (
  req,
  res,
  next
) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
    await User.findOne({
      email
    });

    if (!user) {
      return res.status(401).json({
        status: 401,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password"
      });
    }

    const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(401).json({
        status: 401,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password"
      });

    }

    const accessToken =
    generateAccessToken(user);

    const refreshToken =
    generateRefreshToken(user);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken
    });

    res.status(200).json({
      accessToken,
      refreshToken
    });

  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req,
  res,
  next
) => {

  try {

    const {
      refreshToken
    } = req.body;

    const storedToken =
    await RefreshToken.findOne({
      token: refreshToken
    });

    if (!storedToken) {

      return res.status(401).json({
        status: 401,
        code: "INVALID_REFRESH_TOKEN",
        message: "Refresh token invalid"
      });

    }

    const decoded =
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET
    );

    const user =
    await User.findById(
      decoded.id
    );

    if (!user) {
      return res.status(401).json({
        status: 401,
        code: "INVALID_REFRESH_TOKEN",
        message: "Refresh token invalid"
      });
    }

    await RefreshToken.deleteOne({
      token: refreshToken
    });

    const newAccessToken =
    generateAccessToken(user);

    const newRefreshToken =
    generateRefreshToken(user);

    await RefreshToken.create({
      userId: user._id,
      token: newRefreshToken
    });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    next(error);
  }
};
