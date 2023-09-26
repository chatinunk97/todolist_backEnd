const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password} = req.body;
    console.log(username ,email , password)
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: true });
  } catch (error) {
    res.json({ message: error.message });
    next(error);
  }
};

exports.login = async (req, res, next) => {

  try {
    const { username, password } = req.body;
    console.log(req.body);
    const result = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!result) {
      return res.json({ message: "User not found" });
    }
    if (await bcrypt.compare(password, result.password)) {
      const payload = { id: result.id };
      const accessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY || "secret",
        {
          expiresIn: process.env.JWT_EXPIRE || "0",
        }
      );
      return res.json({ message: true, accessToken });
    }
    return res.json({ message: "Wrong Password" });
  } catch (error) {
    next(error);
  }
};
