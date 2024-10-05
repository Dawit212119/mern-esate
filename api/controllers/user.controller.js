import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../model/user.model.js";
export const test = (req, res) => {
  res.json({ message: "hello from dave" });
};
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler("You can only update your account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
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
  } catch (error) {
    next(error);
  }
};
