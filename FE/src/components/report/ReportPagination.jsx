export default function ReportPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {

  return (

    <div className="flex justify-center gap-4 mt-8">

      <button
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage(currentPage - 1)
        }
        className="bg-[#111c36] px-5 py-3 rounded-xl"
      >
        Prev
      </button>

      <div className="px-5 py-3">

        {currentPage} / {totalPages}

      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() =>
          setCurrentPage(currentPage + 1)
        }
        className="bg-[#111c36] px-5 py-3 rounded-xl"
      >
        Next
      </button>

    </div>

  );

}