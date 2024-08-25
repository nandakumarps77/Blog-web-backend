import blogModel from "../models/blogSchema.js";
import { v4 as uuid } from "uuid";
import { imageUpload } from "../middleware/imageUpload.js";

export const createBlog = async (req, res) => {
  try {
    let coverImage;

    if (req.files && req.files.image) {
      const imageName = uuid() + req.files.image.name; // Ensure imageName is properly formatted
      const fileUploadCheck = await imageUpload(imageName, req.files.image);
      if (!fileUploadCheck) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload image. Please try again.",
        });
      }
      coverImage = imageName;
    }

    const tags = JSON.parse(req.body.tags || "[]");

    const blog = await blogModel.create({
      ...req.body,
      coverImage: coverImage,
      userId: req.userId,
      tags: tags,
    });

    res
      .status(200)
      .json({ success: true, message: "Blog added successfully", data: blog });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Failed to add blog" });
  }
};

export const getBlog = async (req, res) => {
  try {
    const blog = await blogModel.find();
    res.status(200).json({
      success: true,
      message: "Successfully retrieved blogs",
      data: blog,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "Failed to retrieve blogs" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await blogModel
      .findOne({ _id: req.params.id, userId: req.userId })
      .populate("userId");
    res.status(200).json({
      success: true,
      message: "Successfully retrieved blog",
      data: blog,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "Failed to retrieve blog" });
  }
};

export const updateBlog = async (req, res) => {
  const id = req.params.id;
  try {
    let updateFields = { ...req.body };

    if (req.files && req.files.image) {
      const imageName = uuid() + req.files.image.name; 
      const fileUploadCheck = await imageUpload(imageName, req.files.image);
      if (!fileUploadCheck) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload image. Please try again.",
        });
      }
      updateFields.coverImage = imageName;
    }

    // Handle tags
    if (req.body.tags) {
      updateFields.tags = JSON.parse(req.body.tags);
    }

    const editBlog = await blogModel.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!editBlog) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Blog not found or unauthorized to update",
        });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Successfully updated blog",
        data: editBlog,
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Failed to update blog" });
  }
};

export const deleteBlog = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedBlog = await blogModel.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Failed to delete blog" });
  }
};

export const addComment = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    
    if (!Array.isArray(blog.comments)) {
      blog.comments = [];
    }

    // Add the new comment
    blog.comments.push({
      userId: req.userId,
      content: req.body.content,
    });

    await blog.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Successfully added comment",
        data: blog,
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Failed to add comment" });
  }
};
