import userModel from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// login
export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const getuser = await userModel.findOne({ username: username });

    if (!getuser) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, getuser.password);

    if (isPasswordMatch) {
      const token = jwt.sign({ userId: getuser._id }, process.env.JWT_SECRET);

      return res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .json({ token: token, message: "Login successful" });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const userLogout = async (req, res) => {
  try {
    if (!req.cookies.token) {
      return res
        .status(400)
        .json({ success: false, Message: "no token found" });
    }
    res.clearCookie("token").status(200).send("logged out");
  } catch (e) {
    console.log(e);
    res.status(500).json({ e: "internl server error" });
  }
};
