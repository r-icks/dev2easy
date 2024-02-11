import express from "express";
const router = express.Router();

import multer, { memoryStorage } from "multer";
import { readPrescription } from "../controllers/docsController.js";
import auth from "../middleware/auth.js";

const storage = memoryStorage();
const upload = multer({ storage });

router.route("/").post(auth, upload.single("file"), readPrescription);

export default router;
