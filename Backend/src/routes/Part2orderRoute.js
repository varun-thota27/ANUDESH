import express from 'express';
const router = express.Router();
import part2orderController  from '../controllers/Part2orderController.js';
import authMiddleware from "../middlewares/authMiddleware.js";

router.get('/leave-records',authMiddleware(['admin']), part2orderController.fetchLeaveRecords);

export default router;