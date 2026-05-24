import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

export default function ExportButtons({
  data,
}) {

  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "PLC Logs"
    );

    const excelBuffer = XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(fileData, "plc-report.xlsx");

  };

  const exportCSV = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const csv =
      XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    saveAs(blob, "plc-report.csv");

  };

  return (

    <div className="flex gap-4 mb-6">

      <button
        onClick={exportExcel}
        className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-2xl font-bold"
      >
        Export Excel
      </button>

      <button
        onClick={exportCSV}
        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl font-bold"
      >
        Export CSV
      </button>

    </div>

  );

}