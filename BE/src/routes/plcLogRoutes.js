const express = require("express");

const router = express.Router();

const {
  createLog,
  getLogs,
} = require("../controllers/plcLogController");

// CREATE LOG

router.post("/", createLog);

// GET LOGS

router.get("/", getLogs);

module.exports = router;