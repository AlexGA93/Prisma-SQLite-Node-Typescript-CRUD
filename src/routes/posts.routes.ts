import { Router } from "express";
import {
  getAllPosts,
  insertPost,
  getSinglePost,
  deletePost,
  updatePost,
} from "../controllers/posts.controllers";
const router: Router = Router();

// routes

router.post("/new", insertPost);
router.get("/all", getAllPosts);
router.get("/:id", getSinglePost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
