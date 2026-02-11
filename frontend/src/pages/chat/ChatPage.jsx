import { useChatStore } from "@/services/chatStore";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import BorderAnimatedContainer from "@/components/common-chat/BorderAnimatedContainer";
import ProfileHeader from "@/components/common-chat/ProfileHeader";
import ActiveTabSwitch from "@/components/common-chat/ActiveTabSwitch";
import ChatsList from "@/components/common-chat/ChatsList";
import ContactList from "@/components/common-chat/ContactList";
import ChatContainer from "@/components/common-chat/ChatContainer";
import NoConversationPlaceholder from "@/components/common-chat/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser, setSelectedUser } = useChatStore();
  const location = useLocation();

  useEffect(() => {
    // allow opening chat with preselected user via navigation state
    const pre = location.state?.selectedUser;
    if (pre) setSelectedUser(pre);
  }, [location.state, setSelectedUser]);

  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
