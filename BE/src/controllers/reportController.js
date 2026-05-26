const ExcelJS = require("exceljs");

const PDFDocument = require("pdfkit");

const PlcLog = require("../models/PlcLog");

exports.exportExcel = async (
  req,
  res
) => {
  const logs = await PlcLog.findAll();

  const workbook = new ExcelJS.Workbook();

  const sheet =
    workbook.addWorksheet("PLC Report");

  sheet.columns = [
    {
      header: "Temperature",
      key: "temperature",
    },
    {
      header: "Pressure",
      key: "pressure",
    },
    {
      header: "RPM",
      key: "rpm",
    },
    {
      header: "Output",
      key: "output",
    },
  ];

  logs.forEach((log) => {
    sheet.addRow(log.dataValues);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=report.xlsx"
  );

  await workbook.xlsx.write(res);

  res.end();
};

exports.exportPDF = async (
  req,
  res
) => {
  const logs = await PlcLog.findAll();

  const doc = new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=report.pdf"
  );

  doc.pipe(res);

  doc
    .fontSize(24)
    .text("PLC Monitoring Report");

  doc.moveDown();

  logs.forEach((log, index) => {
    doc.text(
      `${index + 1}. Temp: ${
        log.temperature
      } | RPM: ${log.rpm} | Output: ${
        log.output
      }`
    );
  });

  doc.end();
};
