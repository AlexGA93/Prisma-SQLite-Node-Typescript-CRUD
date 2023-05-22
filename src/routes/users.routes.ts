import { Router } from "express";
import {
  deleteUser,
  getASingleUserControllers,
  getAllUsersControllers,
  insertAUser,
  updateUser,
} from "../controllers/users.controllers";
const router: Router = Router();

// routes
router.post("/new", insertAUser);
router.get("/all", getAllUsersControllers);
router.get("/:id", getASingleUserControllers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
