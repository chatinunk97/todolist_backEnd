const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ message: "You are unauthenticated" });
    }
    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "You are unauthenticated" });
    }
    const token = authorization.split(" ")[1];

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "defaultsecret"
    );
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "unauthenticated" });
    }
   req.user = user
    next();
  } catch (error) {
    next(error);
  }
};
