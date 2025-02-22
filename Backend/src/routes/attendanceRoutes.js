import express from "express";
import attendanceController from "../controllers/attendanceController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/faculties",authMiddleware(), attendanceController.getFaculties);
router.get("/getAttendance",authMiddleware(), attendanceController.getAttendance);
router.get("/getMembers",authMiddleware(), attendanceController.getMembers);
router.get("/getData/:faculty",authMiddleware(), attendanceController.getData);
router.post("/submit",authMiddleware(), attendanceController.submit);
router.get("/check",authMiddleware(), attendanceController.check);

export default router;