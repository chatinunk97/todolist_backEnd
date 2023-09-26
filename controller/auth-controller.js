const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ msg: "Registeration Completed !" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!result) {
      return res.json({ msg: "User not found" });
    }
    if (await bcrypt.compare(password, result.password)) {
      const payload = { id: result.id };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || "secret", {
        expiresIn: process.env.JWT_EXPIRE || "0",
      });
      return res.json({ message: "Login Successfully", accessToken });
    }
    return res.json({ msg: "Wrong Password" });
  } catch (error) {
    next(error);
  }
};
