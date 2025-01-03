import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../model/user.model.js";
import Listing from "../model/listing.model.js";
export const test = (req, res) => {
  res.json({ message: "hello from dave" });
};
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (Array.isArray(req.body.username)) {
      req.body.username = req.body.username[0];
    }
    const updatedUserDB = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    console.log(updatedUserDB);
    res.status(200).json(updatedUserDB);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your account"));
  }
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return next(errorHandler(404, "User not found!"));
    }
    res.clearCookie("access_token"); // clear the token

    res.status(200).json({
      message: "User account has been deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
export const getUserListing = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "you can only view youe own listings"));
  }
};

export const getUser = async (req, res, next) => {
  const getuser = await User.findById(req.params.id);
  if (!getuser) {
    return next(errorHandler(404, "User not found"));
  }
  const { password, ...rest } = getuser._doc;
  res.status(200).json(rest);
};
