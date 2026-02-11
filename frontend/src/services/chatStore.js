import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import toast from "react-hot-toast";
import { useSocketStore } from "./socketStore";
import { idEquals, stringifyId } from "./idHelper";

export const useChatStore = create((set, get) => ({
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data || [] });
            console.log("All contacts loaded:", res.data);
        } catch (error) {
            console.error('Error fetching all contacts:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to load contacts");
            set({ allContacts: [] });
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({ chats: res.data || [] });
            console.log("Chat partners loaded:", res.data);
        } catch (error) {
            console.error('Error fetching chat partners:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to load chat partners");
            set({ chats: [] });
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            console.log(`📥 Fetching messages with user: ${userId}`);
            const res = await axiosInstance.get(`/messages/${userId}`);
            const fetchedMessages = res.data || [];
            set({ messages: fetchedMessages });
            console.log(`✅ Messages loaded: ${fetchedMessages.length} messages`, fetchedMessages);
        } catch (error) {
            console.error('❌ Error fetching messages:', error.response?.data || error.message);
            if (error.response?.status === 403) {
                toast.error("Access denied: Not allowed to view messages with this user.");
            } else {
                toast.error(error.response?.data?.message || "Failed to load messages");
            }
            set({ messages: [] });
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const authUser = useSocketStore.getState().authUser;

        if (!authUser || !selectedUser) {
            console.error("❌ Cannot send message: authUser or selectedUser missing");
            return;
        }

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };

        console.log("📝 Sending optimistic message:", optimisticMessage);
        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            console.log("✅ Message sent successfully, server response:", res.data);

            set((state) => ({
                messages: state.messages
                    .filter((m) => m._id !== tempId)
                    .concat([res.data]),
            }));
        } catch (error) {
            console.error("❌ Failed to send message:", error.response?.data || error.message);
            // remove optimistic message on error
            set((state) => ({
                messages: state.messages.filter((m) => m._id !== tempId),
            }));
            if (error.response?.status === 403) {
                toast.error("Not allowed to message this user.");
            } else {
                toast.error(error.response?.data?.message || "Failed to send message");
            }
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useSocketStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            const { selectedUser: currSelected, messages } = get();
            if (!currSelected) return;

            const selectedUserId = stringifyId(currSelected._id);
            const senderId = stringifyId(newMessage.senderId);
            const receiverId = stringifyId(newMessage.receiverId);

            // Message is relevant if it's between current user and selected user
            const isRelevant = idEquals(senderId, selectedUserId) || idEquals(receiverId, selectedUserId);

            if (isRelevant) {
                // Check if message already exists to prevent duplicates
                const messageExists = messages.some((m) => idEquals(m._id, newMessage._id));
                if (!messageExists) {
                    console.log("✅ New message received via socket:", newMessage);
                    set((state) => ({
                        messages: [...state.messages, newMessage],
                    }));
                } else {
                    console.log("⚠️ Message duplicate prevented:", stringifyId(newMessage._id));
                }
            } else {
                console.log("⚠️ Message not for current chat. Sender:", senderId, "Receiver:", receiverId, "Selected:", selectedUserId);
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useSocketStore.getState().socket;
        if (socket) socket.off("newMessage");
    },
}));
