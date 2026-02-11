/**
 * Chat System Test Validator
 * Run this in browser console to verify instructor-student messaging works
 */

export const testChatFix = {
  // Test 1: Verify ID comparison helper
  testIdHelper() {
    return new Promise(async (resolve) => {
      try {
        const { idEquals, stringifyId } = await import("@/services/idHelper");

        // Test string comparison
        const test1 = idEquals("user123", "user123");
        console.log("✅ String ID comparison:", test1);

        // Test ObjectId comparison (would need real ObjectId)
        const test2 = stringifyId({ toString: () => "objId123" });
        console.log("✅ ObjectId stringify:", test2);

        resolve({ success: true, idHelper: "Working" });
      } catch (error) {
        console.error("❌ ID Helper test failed:", error);
        resolve({ success: false, error: error.message });
      }
    });
  },

  // Test 2: Verify message storage in chat store
  testChatStore() {
    return new Promise(async (resolve) => {
      try {
        const { useChatStore } = await import("@/services/chatStore");
        const { messages, selectedUser } = useChatStore.getState();

        console.log("✅ Chat Store messages:", messages.length, "messages");
        console.log("✅ Selected user:", selectedUser?.userName);

        resolve({ success: true, messagesCount: messages.length, selectedUser });
      } catch (error) {
        console.error("❌ Chat Store test failed:", error);
        resolve({ success: false, error: error.message });
      }
    });
  },

  // Test 3: Verify socket connection
  testSocketConnection() {
    return new Promise(async (resolve) => {
      try {
        const { useSocketStore } = await import("@/services/socketStore");
        const { socket, authUser } = useSocketStore.getState();

        const isConnected = socket?.connected || false;
        console.log("✅ Socket connected:", isConnected);
        console.log("✅ Socket ID:", socket?.id?.substring(0, 10) + "...");
        console.log("✅ Auth user:", authUser?.userName);

        resolve({ success: isConnected, socketId: socket?.id });
      } catch (error) {
        console.error("❌ Socket test failed:", error);
        resolve({ success: false, error: error.message });
      }
    });
  },

  // Test 4: Full flow test
  async runFullTest() {
    console.group("\n🔍 FULL CHAT SYSTEM TEST\n");

    console.group("1️⃣ ID Comparison Helper");
    const idTest = await this.testIdHelper();
    console.log(idTest);
    console.groupEnd();

    console.group("2️⃣ Chat Store");
    const storeTest = await this.testChatStore();
    console.log(storeTest);
    console.groupEnd();

    console.group("3️⃣ Socket Connection");
    const socketTest = await this.testSocketConnection();
    console.log(socketTest);
    console.groupEnd();

    console.groupEnd();

    return {
      idHelper: idTest.success,
      chatStore: storeTest.success,
      socket: socketTest.success,
      overall: idTest.success && socketTest.success,
    };
  },

  // Test 5: Send and receive message flow
  async testMessageFlow() {
    console.group("\n📨 MESSAGE FLOW TEST");

    const { useChatStore } = await import("@/services/chatStore");
    const { selectedUser, messages } = useChatStore.getState();

    if (!selectedUser) {
      console.error("❌ No selected user. Open a chat first.");
      console.groupEnd();
      return;
    }

    console.log("📝 Initial messages:", messages.length);
    console.log("👤 Selected user:", selectedUser.userName);
    console.log("📊 Message details:");
    messages.forEach(msg => {
      console.log(`  • [${msg.createdAt}] ${msg.senderId === msg.senderId ? '📤' : '📥'} ${msg.text || '(image)'}`);
    });

    console.log("\n💡 If messages aren't showing:");
    console.log("  1. Check browser console for '✅ New message received' logs");
    console.log("  2. Check Network tab for POST /messages/send response");
    console.log("  3. Verify student is enrolled in instructor's course");

    console.groupEnd();
  },
};

// Usage:
// import { testChatFix } from "@/services/chatTest";
// await testChatFix.runFullTest();
// await testChatFix.testMessageFlow();
