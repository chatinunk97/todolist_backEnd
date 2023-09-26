const prisma = require("../models/prisma");
exports.createTodo = async (req, res, next) => {
  try {
    const { title, completed, dueDate } = req.body;

    /// Validation here

    await prisma.todo.create({
      data: {
        title,
        completed,
        due_date: dueDate,
        //user=> the key in Todo model not the Columnname userId
        //When we insert this it will auto create userId accordingly to the inserted Obj
        userId: req.user.id,
      },
    });
    res.status(201).json({ message: "created" });
  } catch (error) {
    next(error);
  }
};
