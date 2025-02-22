import express from "express";
import { getEmployeeById } from "../controllers/getEmployeeController.js";

const router = express.Router();

router.get('/:id', getEmployeeById);

export default router;