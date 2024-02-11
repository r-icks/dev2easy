import express from "express";
const router = express.Router();

import {
  createMedicineGroup,
  editMedicineGroup,
  medicineList,
} from "../controllers/medicineController.js";
import authenticateUser from "../middleware/auth.js";

router.route("/medicineGroup").post(authenticateUser, createMedicineGroup);
router.route("/medicineGroup/:id").get(authenticateUser, medicineList);
router.route("/medicineGroup/:id").patch(authenticateUser, editMedicineGroup);

export default router;
