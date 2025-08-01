import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthProvider";
import MessageBubble from "../Pages/conversation/Conversation";
import { getGlobalGroup, getPaginatedMessages, markMessageAsSeen, } from "../service/conversation";
import useNotificationSocket from "../service/socket";

const GlobalChat = () => {
  const [groupId, setGroupId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messageEndRef = useRef(null);
  const { user } = useContext(AuthContext);
  const currentUserId = user;
  const socket = useNotificationSocket();
const [typingUsers, setTypingUsers] = useState([]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
  if (socket && groupId) {
    socket.emit('joinGroup', groupId);
    return () => {
      socket.emit('leaveGroup', groupId);
    };
  }
}, [socket, groupId]);
  useEffect(() => {
  if (!socket) return;

  const handleNewMessage = (message) => {
    if (message.groupId === groupId) {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    }
  };

  socket.on('newMessage', handleNewMessage);

  return () => {
    socket.off('newMessage', handleNewMessage);
  };
}, [socket, groupId]);

  useEffect(() => {
    const loadGroup = async () => {
      const group = await getGlobalGroup();
      setGroupId(group._id);
    };
    loadGroup();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!groupId) return;
      setLoading(true);
      const data = await getPaginatedMessages(groupId);
      setMessages(data.messages);
      data.messages.forEach(msg => {
        if (!msg.seenBy?.includes(currentUserId)) {
          markMessageAsSeen(msg._id);
        }
      });
      setLoading(false);
      scrollToBottom();
    };
    if (open) loadMessages();
  }, [groupId, open]);

const handleSend = async () => {
  if (!newMessage.trim()) return;

  const messageData = {
    content: newMessage,
    groupId,
    senderId: currentUserId,
  };
  socket.emit('sendMessage', messageData);
  setNewMessage("");
};
const handleTyping = () => {
  if (socket && groupId) {
    socket.emit('typing', { groupId, userId: currentUserId });
  }
};
useEffect(() => {
  if (!socket) return;

  const handleUserTyping = (data) => {
    if (data.groupId === groupId && data.userId !== currentUserId) {
      setTypingUsers((prev) => [...new Set([...prev, data.userId])]);
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter(id => id !== data.userId));
      }, 3000);
    }
  };

  socket.on('userTyping', handleUserTyping);

  return () => {
    socket.off('userTyping', handleUserTyping);
  };
}, [socket, groupId]);


  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-700"
        aria-label="Open Global Chat"
      >
        💬
      </button>
    );
  }

  return (
  <div className="fixed bottom-4 right-4 w-80 h-[500px] shadow-lg rounded-xl flex flex-col bg-white border border-gray-300 z-50">
    <div className="bg-blue-600 text-white px-4 py-3 text-lg font-bold rounded-t-xl flex justify-between items-center">
      <span>🌍 Global Chat</span>
      <button
        onClick={() => setOpen(false)}
        className="text-white text-xl font-bold hover:text-gray-200"
        aria-label="Close Global Chat"
      >
        ✖
      </button>
    </div>

    <div className="flex-1 overflow-y-auto px-4 py-2">
      {loading ? (
        <p>Loading...</p>
      ) : (
        messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={msg.sender?._id === currentUserId}
          />
        ))
      )}
      <div ref={messageEndRef}></div>
    </div>
    <div className="px-4 py-1 text-sm text-gray-500">
      {typingUsers.length > 0 && <em>Someone is typing...</em>}
    </div>
    <div className="p-2 flex gap-2 border-t border-gray-200">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm"
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value);
          handleTyping();
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        aria-label="Type your message"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  </div>
);

};

export default GlobalChat;
