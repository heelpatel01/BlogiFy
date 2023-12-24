const User = require("../models/user");
const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Blog = require("../models/blog");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userDirectory = path.resolve(`./public/uploads/${req.user._id}`);

    // Create the user's directory if it doesn't exist
    if (!fs.existsSync(userDirectory)) {
      fs.mkdirSync(userDirectory, { recursive: true });
    }

    cb(null, userDirectory);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  console.log("User", blog);
  return res.render("blog", {
    user: req.user,
    blog,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const Body = req.body;
  const File = req.file;

  const userDirectory = `/uploads/${req.user._id}`;
  const coverImageURL = `${userDirectory}/${File.filename}`;

  const blog = await Blog.create({
    title: Body.title,
    body: Body.body,
    createdBy: req.user._id,
    coverImageURL: coverImageURL,
  });
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
