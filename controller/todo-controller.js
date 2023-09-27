const prisma = require("../models/prisma");
exports.createTodo = async (req, res, next) => {
  try {
    const { title, completed, dueDate } = req.body;

    /// Validation here

    const result = await prisma.todo.create({
      data: {
        title,
        completed,
        due_date: dueDate,
        //user=> the key in Todo model not the Columnname userId
        //When we insert this it will auto create userId accordingly to the inserted Obj
        userId: req.user.id,
      },
    });
    res.status(201).json({ message: "created", data : result });
  } catch (error) {
    next(error);
  }
};
exports.getTodo = async(req,res,next) => {
  const {user} = req
  console.log(user)
  try {
    const result = await prisma.todo.findMany({
      where:{
        userId : user.id
      }
    })
    console.log(result)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
