// ...existing code...
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin-view/layout";
import { Trash2, Edit, Search } from "lucide-react";
import { fetchAllUsers, deleteUser } from "../../services/adminService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const result = await fetchAllUsers(1, 50);
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
        setError(error.message);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-6 bg-[#F4F7FA]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#142C52]">
            Users Management
          </h1>
          <button className="bg-[#16808D] text-white px-4 py-2 rounded-lg hover:bg-[#142C52] transition text-sm sm:text-base w-full sm:w-auto">
            Add New User
          </button>
        </div>

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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-[#142C52] text-sm sm:text-base"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-[#142C52]">
            Loading users...
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto border border-[#E0E7F1]">
            <table className="w-full min-w-max sm:min-w-full">
              <thead className="bg-[#F4F7FA] border-b">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Name
                  </th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Email
                  </th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Role
                  </th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Join Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#F4F7FA] transition">
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-[#142C52] font-medium">
                      <div className="flex flex-col">
                        <span>{user.userName}</span>
                        <span className="sm:hidden text-xs text-[#142C52]/60 mt-1">
                          {user.userEmail}
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm text-[#142C52]/70">
                      {user.userEmail}
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "teacher" ? "bg-[#1B9AAA]/20 text-[#142C52]" : "bg-[#16808D]/10 text-[#142C52]"}`}
                      >
                        {user.role === "teacher" ? "Instructor" : "Student"}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm text-[#142C52]/70">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm flex gap-2">
                      <button className="text-[#142C52] hover:text-[#16808D] transition p-1">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-800 transition p-1"
                      >
                        <Trash2 size={16} />
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

export default AdminUsers;
// ...existing code...
