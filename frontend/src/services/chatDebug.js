/**
 * Chat System Debug Helper
 * Use these functions to troubleshoot message issues
 */

import axiosInstance from "@/api/axiosInstance";

export const debugChat = {
  // Test 1: Check if backend is accessible
  async testBackendConnection() {
    try {
      const res = await axiosInstance.get("/messages/chats");
      console.log("✅ Backend connection OK. Chat partners:", res.data);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("❌ Backend connection failed:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Test 2: Fetch messages between two users
  async testFetchMessages(userId) {
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      console.log(`✅ Messages fetched with ${userId}:`, res.data);
      return { success: true, count: res.data.length, data: res.data };
    } catch (error) {
      console.error(`❌ Failed to fetch messages with ${userId}:`, error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Test 3: Send test message
  async testSendMessage(recipientId, testMessage = "Test message") {
    try {
      const res = await axiosInstance.post(`/messages/send/${recipientId}`, {
        text: testMessage,
        image: null,
      });
      console.log("✅ Test message sent:", res.data);
      return { success: true, messageId: res.data._id };
    } catch (error) {
      console.error("❌ Failed to send message:", error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Test 4: Auth check
  getAuthInfo() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No auth token found");
      return { authenticated: false };
    }
    try {
      // Decode JWT (first two parts)
      const parts = token.split(".");
      const payload = JSON.parse(atob(parts[1]));
      console.log("✅ Auth token decoded:", payload);
      return { authenticated: true, user: payload };
    } catch (e) {
      console.error("❌ Failed to decode token:", e);
      return { authenticated: false, error: e.message };
    }
  },

  // Test 5: Print all debug info
  async fullDiagnostics() {
    console.group("🔍 Chat System Diagnostics");

    console.group("Auth");
    const auth = this.getAuthInfo();
    console.log(auth);
    console.groupEnd();

    console.group("Backend Connection");
    const conn = await this.testBackendConnection();
    console.log(conn);
    console.groupEnd();

    console.groupEnd();
    return { auth, connection: conn };
  },
};

// Usage in browser console:
// import { debugChat } from "@/services/chatDebug";
// debugChat.fullDiagnostics();
// debugChat.testFetchMessages("instructor_user_id");
// debugChat.testSendMessage("recipient_id", "Hello!");
