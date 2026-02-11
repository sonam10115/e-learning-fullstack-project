import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin-view/layout";
import { Users, BookOpen, ShoppingCart, TrendingUp } from "lucide-react";
import { fetchDashboardStats } from "../../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await fetchDashboardStats();
        if (result?.success) setStats(result.data);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-5 flex items-center gap-4 border border-[#E0E7F1]">
      <div
        className="p-3 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-[#142C52]/70">{label}</p>
        <p className="text-2xl font-semibold text-[#142C52]">{value}</p>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F4F7FA] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#142C52]">
            Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button className="bg-[#1B9AAA] hover:bg-[#16808D] text-white px-4 py-2 rounded-lg transition text-sm sm:text-base">
              View Users
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-[#142C52]">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats.totalUsers}
                color="#16808D"
              />
              <StatCard
                icon={BookOpen}
                label="Total Courses"
                value={stats.totalCourses}
                color="#1B9AAA"
              />
              <StatCard
                icon={ShoppingCart}
                label="Total Orders"
                value={stats.totalOrders}
                color="#142C52"
              />
              <StatCard
                icon={TrendingUp}
                label="Total Revenue"
                value={`$${stats.totalRevenue}`}
                color="#0f5f66"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E0E7F1]">
                <h2 className="text-lg font-semibold text-[#142C52] mb-4">
                  Monthly Revenue
                </h2>
                <div className="space-y-3">
                  {(stats.monthlyRevenue || []).slice(0, 6).map((m, i) => {
                    const label = m._id
                      ? `${m._id.year}-${String(m._id.month).padStart(2, "0")}`
                      : `M${i + 1}`;
                    const value = m.revenue || 0;
                    const pct = Math.min(
                      100,
                      (value / (stats.totalRevenue || 1)) * 100,
                    );
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm text-[#142C52] mb-1">
                          <span>{label}</span>
                          <span className="font-medium">${value}</span>
                        </div>
                        <div className="w-full bg-[#F4F7FA] rounded-full h-2">
                          <div
                            className="bg-[#16808D] h-2 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E0E7F1]">
                <h2 className="text-lg font-semibold text-[#142C52] mb-4">
                  Top Courses
                </h2>
                <div className="space-y-3">
                  {(stats.topCourses || []).slice(0, 6).map((c, idx) => {
                    const title = c.course?.[0]?.title || "Untitled";
                    const enroll = c.enrollments || 0;
                    const pct = Math.min(100, (enroll / 150) * 100);
                    return (
                      <div key={idx}>
                        <div className="flex justify-between text-sm text-[#142C52] mb-1">
                          <span>{title}</span>
                          <span className="font-medium">{enroll}</span>
                        </div>
                        <div className="w-full bg-[#F4F7FA] rounded-full h-2">
                          <div
                            className="bg-[#1B9AAA] h-2 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E0E7F1]">
              <h2 className="text-lg font-semibold text-[#142C52] mb-4">
                Recent Activity
              </h2>
              <div className="text-[#142C52]/70 text-sm">
                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.slice(0, 5).map((a, i) => (
                    <div
                      key={i}
                      className="py-2 border-b last:border-b-0 border-[#E0E7F1]"
                    >
                      <div className="text-sm">{a.message}</div>
                      <div className="text-xs text-[#142C52]/60">
                        {new Date(a.date).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[#142C52]/70">
                    No recent activity to display.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
