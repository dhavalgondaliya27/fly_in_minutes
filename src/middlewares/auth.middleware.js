const User = require("../models/users.model");
import { decodeToken } from "../utils/jwt.utils";

export const verifyJWT = async (req, res, next) => {
  try {
    let token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.error(401, "Unauthorized request")
    }

    const decodedUser = await decodeToken(token);

    if (!decodedUser) {
      res.error(400, "Invalid token payload")
    }

    const user = await User.findById(decodedUser._id);
    if (!user) {
      res.error(404, "User not found")
    }

    req.user = user;
    next();
  } catch (error) {
    res.error(500, error?.message || "Something went wrong")
  }
};