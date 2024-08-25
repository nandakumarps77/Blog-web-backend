import express from "express";
import {
  addComment,
  createBlog,
  deleteBlog,
  getBlog,
  getBlogById,
  updateBlog,
} from "../controller/blogFunction.js";
import checkAuthorization from "../middleware/checkAuthorization.js";

const router = express.Router();

router.post("/createBlog", checkAuthorization, createBlog);
router.get("/getBlogs", checkAuthorization, getBlog);
router.get("/getBlogId", checkAuthorization, getBlogById);
router.put("/updateByid/:id", checkAuthorization, updateBlog);
router.delete("/deleteblog/:id", checkAuthorization, deleteBlog);
router.post("/addComment/:id", checkAuthorization, addComment);

export default router;
