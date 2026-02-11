import axiosInstance from "../api/axiosInstance";

// Dashboard
export const fetchDashboardStats = async () => {
    const response = await axiosInstance.get("/admin/dashboard/stats");
    return response.data;
};

// Users Management
export const fetchAllUsers = async (page = 1, limit = 10) => {
    const response = await axiosInstance.get("/admin/users", {
        params: { page, limit }
    });
    return response.data;
};

export const fetchUserById = async (userId) => {
    const response = await axiosInstance.get(`/admin/users/${userId}`);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await axiosInstance.put(`/admin/users/${userId}/role`, { role });
    return response.data;
};

// Courses Management
export const fetchAllCourses = async (page = 1, limit = 10) => {
    const response = await axiosInstance.get("/admin/courses", {
        params: { page, limit }
    });
    return response.data;
};

export const fetchCourseById = async (courseId) => {
    const response = await axiosInstance.get(`/admin/courses/${courseId}`);
    return response.data;
};

export const deleteCourse = async (courseId) => {
    const response = await axiosInstance.delete(`/admin/courses/${courseId}`);
    return response.data;
};

// Orders Management
export const fetchAllOrders = async (page = 1, limit = 10) => {
    const response = await axiosInstance.get("/admin/orders", {
        params: { page, limit }
    });
    return response.data;
};

// Analytics
export const fetchAnalytics = async () => {
    const response = await axiosInstance.get("/admin/analytics");
    return response.data;
};
