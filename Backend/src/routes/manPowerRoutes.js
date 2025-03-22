import express from "express";
import manPowerController from "../controllers/manPowerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/fetch-category",authMiddleware(['admin']), manPowerController.getCategory);
router.get("/fetch-category-wing",authMiddleware(['admin']), manPowerController.getCategoryWing);
router.get("/fetch-non-ind-central",authMiddleware(['admin']), manPowerController.getNonIndCentral);
router.get("/fetch-non-ind-unit",authMiddleware(['admin']), manPowerController.getNonIndUnit);
router.get("/fetch-ind-unit",authMiddleware(['admin']), manPowerController.getIndUnit);
router.get("/fetch-fire-staff",authMiddleware(['admin']), manPowerController.getFireStaff);
router.get("/trade-info",authMiddleware(['admin']), manPowerController.getTradeInfo);

export default router;