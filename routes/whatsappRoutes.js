import express from "express";
import { webhookVerification, receiveMessage } from "../controllers/whatsAppController.js";

const router = express.Router();

router.get("/webhook", webhookVerification);
router.post("/webhook", receiveMessage);

export default router;