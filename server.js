const path = require("path");
const express = require("express");
const app = express();
const route = express.Router();
const userRoute = require("./routes/users");
const blogRouter = require("./routes/blog");
const Blog = require("./models/blog");
const PORT = 8000;
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then((e) => console.log("Connected Successfully"))
  .catch((e) => console.log("Db Connection Error:-", e));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlog = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlog,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`Server Started @${PORT}`);
});
