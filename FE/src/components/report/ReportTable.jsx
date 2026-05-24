export default function ReportTable({
  currentData,
}) {

  return (

    <div className="overflow-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b border-[#1e293b]">

            <th className="text-left p-4">
              Time
            </th>

            <th className="text-left p-4">
              Username
            </th>

            <th className="text-left p-4">
              Event
            </th>

          </tr>

        </thead>

        <tbody>

          {currentData.map((item) => (

            <tr
              key={item.id}
              className="border-b border-[#1e293b]"
            >

              <td className="p-4">

                {new Date(
                  item.createdAt
                ).toLocaleString()}

              </td>

              <td className="p-4 text-green-400 font-bold">

                {item.username}

              </td>

              <td className="p-4">

                {item.message}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}