import axios from "axios";

const API_URL =
  "http://localhost:5000/api/plc-logs";

// =====================================
// GET REPORTS
// =====================================

export const getReports = async () => {

  try {

    const res = await axios.get(API_URL);

    return res.data;

  } catch (error) {

    console.log(error);

    return [];

  }

};