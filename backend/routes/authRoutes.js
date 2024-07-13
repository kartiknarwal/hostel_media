import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/authControllers.js";
import UploadFile from "../middlewares/multer.js";

const router =express.Router()

router.post("/register",UploadFile,registerUser);
router.post("/login",loginUser);
router.get("/logout",logoutUser);

export default router;