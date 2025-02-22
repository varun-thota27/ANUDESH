import express from "express";
import leaveController from "../controllers/leaveController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/fetch-employees",authMiddleware(), leaveController.getEmployees);
router.post("/submit-form",leaveController.submitForm);
router.get('/getRequests',authMiddleware(),leaveController.getRequests);
router.get('/fetch-at-admin',authMiddleware('admin'),leaveController.fetchAtAdmin);
router.get('/leave-records',leaveController.fetchRecords);
router.post('/update-details/:id',leaveController.updateDetails);
router.get('/get-data-at-admin/:id',authMiddleware('admin'),leaveController.getData);
router.get('/:id',leaveController.getById);


export default router;