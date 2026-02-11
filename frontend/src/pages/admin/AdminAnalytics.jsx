// ...existing code...
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin-view/layout";
import { TrendingUp, Users, BookOpen, ShoppingCart } from "lucide-react";
import { fetchAnalytics } from "../../services/adminService";

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    monthlyRevenue: [],
    topCourses: [],
    userGrowth: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const result = await fetchAnalytics();
      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const StatItem = ({ icon: Icon, label, value, trend }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E0E7F1]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#142C52] text-sm mb-2">{label}</p>
          <p className="text-2xl font-bold text-[#142C52]">{value}</p>
          {trend && (
            <p className="text-[#1B9AAA] text-sm mt-2">
              ↑ {trend}% from last month
            </p>
          )}
        </div>
        <div className="bg-[#16808D] p-3 rounded-lg">
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6 bg-[#F4F7FA]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#142C52]">
          Analytics
        </h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm sm:text-base">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-[#142C52]">
            Loading analytics...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatItem
                icon={TrendingUp}
                label="Monthly Revenue"
                value="$18,000"
                trend={20}
              />
              <StatItem icon={Users} label="New Users" value="200" trend={15} />
              <StatItem
                icon={BookOpen}
                label="Active Courses"
                value="24"
                trend={8}
              />
              <StatItem
                icon={ShoppingCart}
                label="Monthly Orders"
                value="45"
                trend={12}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E0E7F1]">
                <h2 className="text-lg font-bold mb-4 text-[#142C52]">
                  Monthly Revenue
                </h2>
                <div className="space-y-4">
                  {analytics.monthlyRevenue?.slice(0, 5).map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-[#142C52]">
                          {item._id?.year}-
                          {String(item._id?.month).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-medium text-[#142C52]">
                          ${item.revenue}
                        </span>
                      </div>
                      <div className="w-full bg-[#F4F7FA] rounded-full h-2">
                        <div
                          className="bg-[#16808D] h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (item.revenue / 50000) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E0E7F1]">
                <h2 className="text-lg font-bold mb-4 text-[#142C52]">
                  Top Courses
                </h2>
                <div className="space-y-4">
                  {analytics.topCourses?.slice(0, 5).map((course, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-[#142C52]">
                          {course.course?.[0]?.title || "Course"}
                        </span>
                        <span className="text-sm font-medium text-[#142C52]">
                          {course.enrollments}
                        </span>
                      </div>
                      <div className="w-full bg-[#F4F7FA] rounded-full h-2">
                        <div
                          className="bg-[#1B9AAA] h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (course.enrollments / 150) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E0E7F1]">
              <h2 className="text-lg font-bold mb-4 text-[#142C52]">
                User Growth
              </h2>
              <div className="space-y-4">
                {analytics.userGrowthByMonth?.slice(0, 5).map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs sm:text-sm font-medium text-[#142C52]">
                        {item._id?.year}-
                        {String(item._id?.month).padStart(2, "0")}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-[#142C52]">
                        {item.newUsers}
                      </span>
                    </div>
                    <div className="w-full bg-[#F4F7FA] rounded-full h-2">
                      <div
                        className="bg-[#16808D] h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (item.newUsers / 100) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminAnalytics;
// ...existing code...
