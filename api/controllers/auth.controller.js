import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    //res.status(500).json(error.message);
    next(error);
  }
};
