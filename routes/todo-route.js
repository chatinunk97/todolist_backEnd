const express = require("express");
const router = express.Router();

const todoController = require('../controller/todo-controller')
const authenticateMiddleware = require('../middleware/authenticate')

router.use(authenticateMiddleware)
router.get('/',todoController.getTodo)
router.post('/',todoController.createTodo)


module.exports = router