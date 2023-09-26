require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8888;
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error");
const authRoute = require("./routes/auth-route");
const todoRoute = require('./routes/todo-route')

let allowCrossDomain = function(req,res,next){
  res.header('Access-Control-Allow-Origin',"*"),
  res.header('Access-Control-Allow-Headers',"*")
  next()
}
app.use(allowCrossDomain)
app.use(express.json());

app.use("/user", authRoute);
app.use('/todo',todoRoute)

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log("Server is online on PORT", +port);
});
