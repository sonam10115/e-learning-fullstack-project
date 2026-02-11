// ...existing code...
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin-view/layout";
import { Trash2, Edit, Search, Plus } from "lucide-react";
import { fetchAllCourses, deleteCourse } from "../../services/adminService";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const result = await fetchAllCourses(1, 50);
      if (result.success) {
        setCourses(result.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter((course) => course._id !== id));
      } catch (error) {
        console.error("Error deleting course:", error);
        setError(error.message);
      }
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-6 bg-[#F4F7FA]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#142C52]">
            Courses Management
          </h1>
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
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-[#142C52] text-sm sm:text-base"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-[#142C52]">
            Loading courses...
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto border border-[#E0E7F1]">
            <table className="w-full min-w-max sm:min-w-full">
              <thead className="bg-[#F4F7FA] border-b">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Title
                  </th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Instructor
                  </th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Price
                  </th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#142C52]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCourses.map((course) => (
                  <tr
                    key={course._id}
                    className="hover:bg-[#F4F7FA] transition"
                  >
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-[#142C52]">
                      <div className="flex flex-col">
                        <span className="truncate">{course.title}</span>
                        <span className="sm:hidden text-xs text-[#142C52]/60 mt-1">
                          ${course.pricing}
                        </span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm text-[#142C52]/70">
                      {course.instructorID?.userName || "N/A"}
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-[#142C52]">
                      ${course.pricing}
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#1B9AAA]/20 text-[#142C52]">
                        Active
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm flex gap-2">
                      <button className="text-[#142C52] hover:text-[#16808D] transition p-1">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
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

export default AdminCourses;
// ...existing code...
