// ...existing code...
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin-view/layout";
import { Search, Eye } from "lucide-react";
import { fetchAllOrders } from "../../services/adminService";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const result = await fetchAllOrders(1, 50);
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.userName || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 bg-[#F4F7FA]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#142C52]">
          Orders Management
        </h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm sm:text-base">
            Error: {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 border border-[#E0E7F1]">
          <div className="flex items-center gap-2">
            <Search size={20} className="text-[#142C52]/60 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-[#142C52] text-sm sm:text-base"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-[#142C52]">
            Loading orders...
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto border border-[#E0E7F1]">
            <table className="w-full min-w-max sm:min-w-full">
              <thead className="bg-[#F4F7FA] border-b">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Order ID
                  </th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Customer
                  </th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Course
                  </th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Status
                  </th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#F4F7FA] transition">
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-[#142C52]">
                      <div className="flex flex-col">
                        <span className="truncate">
                          {order._id.slice(0, 8)}
                        </span>
                        <span className="md:hidden text-xs text-[#142C52]/60 mt-1">
                          {order.userName || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm text-[#142C52]/70">
                      {order.userName || "N/A"}
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm text-[#142C52]/70">
                      {order.courseTitle || "N/A"}
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-[#142C52]">
                      ${order.coursePricing}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus || "pending")}`}
                      >
                        {order.paymentStatus || "pending"}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm text-[#142C52]/70">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                      <button className="text-[#16808D] hover:text-[#142C52] transition p-1">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;
// ...existing code...
