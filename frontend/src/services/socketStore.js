import { create } from "zustand";

export const useSocketStore = create(() => ({
    authUser: null,
    socket: null,
    onlineUsers: [],
}));
