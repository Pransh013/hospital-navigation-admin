import { getTestsByHospitalAction } from "@/actions/test";
import { Card } from "@/components/ui/card";

export default async function TestPage() {
  const { success, data: tests, error } = await getTestsByHospitalAction();

  if (!success || !tests) {
    return <div className="text-red-500">Error: {error}</div>;
  }

    return (
      <div className="container mx-auto py-8 px-24">
        <Card className="p-4 overflow-auto w-full">
          <h2 className="text-xl font-semibold mb-4">Lab Tests</h2>
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-100 text-center">
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Floor No.</th>
                <th className="p-2">Room No.</th>
                <th className="p-2">Created at</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.testId} className="border-b hover:bg-gray-50 text-center">
                  <td className="p-2">{test.name}</td>
                  <td className="p-2">₹{test.price}</td>
                  <td className="p-2">{test.floorNumber}</td>
                  <td className="p-2">{test.roomNumber}</td>
                  <td className="p-2">
                    {new Date(test.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
}
