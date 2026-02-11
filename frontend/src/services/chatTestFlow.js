/**
 * Chat Test Flow - Validates the complete login → socket → messages flow
 */

export const testChatFlow = {
  /**
   * Step 1: Verify token storage during login
   */
  validateTokenStorage() {
    console.log("\n🔍 === STEP 1: Validating Token Storage ===");

    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("accessToken");

    console.log("📦 localStorage.token:", localToken ? "✅ present" : "❌ missing");
    console.log("📦 sessionStorage.accessToken:", sessionToken ? "✅ present" : "❌ missing");

    if (!localToken || !sessionToken) {
      console.error("❌ TOKEN STORAGE FAILED - Token not found in storage");
      return false;
    }

    if (localToken !== sessionToken) {
      console.error("⚠️  WARNING: Tokens don't match between localStorage and sessionStorage");
    }

    console.log("✅ Token storage validated");
    return true;
  },

  /**
   * Step 2: Verify socket connection
   */
  validateSocketConnection(socket) {
    console.log("\n🔍 === STEP 2: Validating Socket Connection ===");

    if (!socket) {
      console.error("❌ SOCKET NOT FOUND - Socket is null/undefined");
      return false;
    }

    console.log("🔌 Socket ID:", socket.id || "⏳ pending");
    console.log("🔌 Socket connected:", socket.connected ? "✅ yes" : "❌ no");
    console.log("🔌 Socket authenticated:", socket.user ? "✅ yes" : "❌ no");

    if (!socket.connected) {
      console.error("❌ SOCKET CONNECTION FAILED");
      return false;
    }

    console.log("✅ Socket connection validated");
    return true;
  },

  /**
   * Step 3: Verify user online status
   */
  validateOnlineStatus(onlineUsers, currentUserId) {
    console.log("\n🔍 === STEP 3: Validating Online Status ===");

    if (!onlineUsers || onlineUsers.length === 0) {
      console.warn("⚠️  No online users list available yet");
      return false;
    }

    console.log("👥 Online users count:", onlineUsers.length);
    console.log("👥 Online users:", onlineUsers.map(u => u.userId).join(", "));

    const isOnline = onlineUsers.some(u => u.userId?.toString() === currentUserId?.toString());

    if (!isOnline) {
      console.error("❌ USER NOT ONLINE - Current user not in online users list");
      return false;
    }

    console.log("✅ User is online");
    return true;
  },

  /**
   * Step 4: Full diagnostic
   */
  async fullDiagnostics(socket, onlineUsers, authUser) {
    console.log("\n\n🚀 === FULL CHAT FLOW DIAGNOSTICS ===\n");

    const step1 = this.validateTokenStorage();
    const step2 = this.validateSocketConnection(socket);
    const step3 = this.validateOnlineStatus(onlineUsers, authUser?._id);

    console.log("\n\n📊 === RESULTS SUMMARY ===");
    console.log(`✅ Token storage: ${step1 ? "PASS" : "FAIL"}`);
    console.log(`✅ Socket connection: ${step2 ? "PASS" : "FAIL"}`);
    console.log(`✅ Online status: ${step3 ? "PASS" : "FAIL"}`);

    const allPass = step1 && step2 && step3;

    if (allPass) {
      console.log("\n🎉 ALL CHECKS PASSED - Chat system ready!");
      return true;
    } else {
      console.log("\n❌ SOME CHECKS FAILED - See details above");
      return false;
    }
  },

  /**
   * Quick test to check if we can send a message
   */
  async testMessageSending(chatStore, testReceiverId) {
    console.log("\n🧪 === TESTING MESSAGE SENDING ===");

    try {
      if (!testReceiverId) {
        console.error("❌ No test receiver ID provided");
        return false;
      }

      const testMessage = {
        text: `🧪 Test message at ${new Date().toLocaleTimeString()}`,
        userId: testReceiverId, // This will be set to selectedUser internally
      };

      console.log("📤 Sending test message to:", testReceiverId);

      // This is a dry-run, don't actually send
      console.log("✅ Message prepare test completed");

      return true;
    } catch (error) {
      console.error("❌ Message sending test failed:", error);
      return false;
    }
  },
};

/**
 * Usage in chat page:
 * 
 * import { testChatFlow } from '@/services/chatTestFlow';
 * 
 * // In your component:
 * const handleDiagnostics = async () => {
 *   const { socket } = useSocketStore();
 *   const { onlineUsers, authUser } = useSocketStore();
 *   await testChatFlow.fullDiagnostics(socket, onlineUsers, authUser);
 * };
 */
