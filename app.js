const express = require("express");

const connectDB = require("./config/db");
const psychiatrist = require("./routes/psychiatrist/psychiatrist");
const users = require("./routes/users/user");
const task = require("./routes/Task/task");
const article = require("./routes/article/article");
const auth = require("./routes/psychiatrist/auth");
const app = express();

app.use(express.json({ extended: false }));

connectDB();

app.use((req,res,next) => {

  res.header("Access-Control-Allow-Credentials",true);

  res.header("Access-Control-Allow-Orgin","http://localhost:3000")

  res.header("Access-Control-Allow-Methods","OPTIONS,GET,PUT,POST,DELETE");

  res.header("Access-Control-Allow-Headers","X-Requested-With,X-HTTP-Method-Override, Content-Type,Accept, X-XSRF-TOKEN")

    next();
});

// const checkUserType = (req,res,next) => {
//   console.log(req.originalUrl.split("/"));
//   next();
// }

// app.use(checkUserType);


app.use("/vp/psychiatrist", psychiatrist);
app.use("/vp/users", users);
app.use("/vp/psychiatrist/auth", auth);
app.use("/vp/task", task);
app.use("/vp/article",article);

app.get("/vp", (req, res) => {
   res.json([{id:0,title:"FirstChapter",body:"aboutFirst"},{id:1,title:"secondChapter",body:"aboutSecond"}]);
    // res.json({work:"yay it worked"})
});

app.listen(5000, () => {
  console.log("Server is up on port 5000");
});

// const Task = require("./models/Task");
// const User = require("./models/User");
// const main = async () => {
//   const task = await Task.findById("5dd1131fce9772204cd910ca");
//   await task.populate("owner").execPopulate();
//   console.log(task.owner.name);

// const user = await User.findById("5dd1119fb3c8c52c982c0384");
// await user.populate("tasks").execPopulate();
// console.log(user.tasks);

// };

// main();

// const Article = require("./models/Article");


// const main = async () => {
//   const article = await Article.findById("5e69cdf6d930d0e6480e00c3");
//   await article.populate("owner").execPopulate();
//   console.log(article.owner)
// }

// main();