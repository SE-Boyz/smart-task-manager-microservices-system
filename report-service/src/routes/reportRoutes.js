const express = require("express");
const reportController = require("../controllers/reportController");

const router = express.Router();

/**
 * @swagger
 * /summary:
 *   get:
 *     summary: Get task summary statistics
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Task summary
 */
router.get("/summary", reportController.getSummary);

module.exports = router;
