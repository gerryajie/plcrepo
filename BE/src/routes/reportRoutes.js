const router = require("express").Router();

const reportController = require("../controllers/reportController");

router.get(
  "/excel",
  reportController.exportExcel
);
router.get(
  "/pdf",
  reportController.exportPDF
);

module.exports = router;