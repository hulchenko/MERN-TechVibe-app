import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getTestCredentials,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(protect, admin, getUsers).post(registerUser); // protect + admin middleware to ensure admin permissions only
router.post("/logout", logoutUser);
router.post("/auth", authUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile); // protect middleware for additional auth step
router.route("/:id").delete(protect, admin, deleteUser).get(protect, admin, getUser).put(protect, admin, updateUser);
router.route("/test/:user").get(getTestCredentials);

export default router;
