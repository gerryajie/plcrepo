import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import ReportHeader from "../components/report/ReportHeader";

import ReportFilter from "../components/report/ReportFilter";

import ReportTable from "../components/report/ReportTable";

import ReportPagination from "../components/report/ReportPagination";

import ExportButtons from "../components/report/ExportButtons";

import {
  getReports,
} from "../services/reportService";

export default function Report() {

  // =====================================
  // STATE
  // =====================================

  const [logs, setLogs] =
    useState([]);

  const [eventFilter,
    setEventFilter] =
    useState("");

  const [dateFilter,
    setDateFilter] =
    useState("");

  const [period,
    setPeriod] =
    useState("daily");

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  // =====================================
  // FETCH REPORT
  // =====================================

  useEffect(() => {

    fetchReports();

  }, []);

  const fetchReports =
    async () => {

      try {

        const data =
          await getReports();

        // =====================================
        // ARRAY SAFETY
        // =====================================

        const rows =

          Array.isArray(data)

            ? data

            : data.rows || [];

        setLogs(rows);

      } catch (error) {

        console.log(error);

        setLogs([]);

      }

    };

  // =====================================
  // FILTER
  // =====================================

  const filteredLogs =
    (logs || []).filter(
      (item) => {

        // =====================================
        // EVENT FILTER
        // =====================================

        let eventMatch =
          true;

        if (
          eventFilter ===
          "START"
        ) {

          eventMatch =
            item.message?.includes(
              "START"
            );

        }

        if (
          eventFilter ===
          "BATTERY"
        ) {

          eventMatch =
            item.message?.includes(
              "BATTERY"
            );

        }

        if (
          eventFilter ===
          "SHORT"
        ) {

          eventMatch =
            item.message?.includes(
              "SHORT"
            );

        }

        if (
          eventFilter ===
          "TIME"
        ) {

          eventMatch =
            item.message?.includes(
              "TIME"
            );

        }

        // =====================================
        // DATE FILTER
        // =====================================

        const dateMatch =
          dateFilter

            ? item.createdAt
                ?.startsWith(
                  dateFilter
                )

            : true;

        return (
          eventMatch &&
          dateMatch
        );

      }
    );

  // =====================================
  // PAGINATION
  // =====================================

  const totalPages =
    Math.ceil(
      (filteredLogs?.length || 0)
      / itemsPerPage
    );

  const startIndex =
    (currentPage - 1)
    * itemsPerPage;

  const currentData =
    (filteredLogs || []).slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // =====================================
  // UI
  // =====================================

  return (

    <MainLayout>

      <div
        className="
        bg-[#081028]
        border
        border-[#1e293b]
        rounded-3xl
        p-8
      "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <div>

            <ReportHeader />

          </div>

          <div
            className="
              bg-[#101d44]
              border
              border-[#1f2f5c]
              rounded-2xl
              px-5
              py-3
            "
          >

            <p
              className="
                text-sm
                text-gray-400
              "
            >

              Report Type

            </p>

            <h2
              className="
                text-green-400
                font-bold
                text-xl
              "
            >

              {period.toUpperCase()}

            </h2>

          </div>

        </div>

        {/* FILTER */}

        <div
          className="
            grid
            grid-cols-3
            gap-4
            mb-6
          "
        >

          {/* EVENT */}

          <select

            value={eventFilter}

            onChange={(e) =>
              setEventFilter(
                e.target.value
              )
            }

            className="
              bg-[#101d44]
              border
              border-[#1f2f5c]
              rounded-xl
              px-4
              py-4
              text-white
              outline-none
            "
          >

            <option value="">
              All Events
            </option>

            <option value="START">
              START ENGINE
            </option>

            <option value="BATTERY">
              BATTERY LOW
            </option>

            <option value="SHORT">
              SHORT CIRCUIT
            </option>

            <option value="TIME">
              TIME PREVENTIVE
            </option>

          </select>

          {/* DATE */}

          <input

            type="date"

            value={dateFilter}

            onChange={(e) =>
              setDateFilter(
                e.target.value
              )
            }

            className="
              bg-[#101d44]
              border
              border-[#1f2f5c]
              rounded-xl
              px-4
              py-4
              text-white
              outline-none
            "
          />

          {/* PERIOD */}

          <select

            value={period}

            onChange={(e) =>
              setPeriod(
                e.target.value
              )
            }

            className="
              bg-[#101d44]
              border
              border-[#1f2f5c]
              rounded-xl
              px-4
              py-4
              text-white
              outline-none
            "
          >

            <option value="daily">
              Daily Report
            </option>

            <option value="weekly">
              Weekly Report
            </option>

            <option value="monthly">
              Monthly Report
            </option>

            <option value="yearly">
              Yearly Report
            </option>

          </select>

        </div>

        {/* EXPORT */}

        <ExportButtons
          data={filteredLogs}
        />

        {/* TABLE */}

        <ReportTable
          currentData={
            currentData
          }
        />

        {/* PAGINATION */}

        {

          totalPages > 0 && (

            <ReportPagination

              currentPage={
                currentPage
              }

              totalPages={
                totalPages
              }

              setCurrentPage={
                setCurrentPage
              }

            />

          )

        }

        {/* EMPTY */}

        {

          currentData.length === 0 && (

            <div
              className="
              text-center
              text-gray-400
              py-10
            "
            >

              No historian data found

            </div>

          )

        }

      </div>

    </MainLayout>

  );

}