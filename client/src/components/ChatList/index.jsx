import { Avatar } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' +
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

function ChatList({ chats, setActiveChat, activeChat, isLoading}) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const sortedChats = [...chats].sort((a, b) => {
    const lastMessageA = a.messages[a.messages.length - 1];
    const lastMessageB = b.messages[b.messages.length - 1];
    
    const timestampA = lastMessageA ? new Date(lastMessageA.timestamp).getTime() : 0;
    const timestampB = lastMessageB ? new Date(lastMessageB.timestamp).getTime() : 0;
    
    return timestampB - timestampA; 
  });

  if (isLoading) {
    return (
      <div className={`h-full overflow-y-auto ${isDarkMode ? 'bg-black border-r border-gray-700 text-white' : 'bg-white border-r border-gray-300 text-black'}`}>
            <h2 className="text-2xl font-bold p-4">Messages</h2>

        <div className="animate-pulse px-2">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="flex items-center mb-4">
              <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
              <div className="ml-4 flex-1">
                <div className={`h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`mt-2 h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sortedChats.length === 0) {
    return (
      <h1 className={`text-center p-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>No chats</h1>
    );
  }

  return (
    <div className={`h-full overflow-y-auto ${isDarkMode ? 'bg-black border-r border-gray-700 text-white' : 'bg-white border-r border-gray-300 text-black'}`}>
      <h2 className="text-2xl font-bold p-4">Messages</h2>
      <ul>
        {sortedChats.map((chat) => (
          <li
            key={chat._id}
            className={`p-4 cursor-pointer ${activeChat && activeChat._id === chat._id ? isDarkMode ? 'bg-gray-700' : 'bg-blue-200' : 'hover:bg-blue-400'}`}
            onClick={() => setActiveChat(chat)}
          >
            <div className='flex w-full justify-between items-center'>
              <Avatar  alt={chat.studentId?.name} />
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{chat.studentId?.username}</h3>
                  <span className="text-sm">
                    {chat.messages.length > 0 ? formatTimestamp(chat.messages[chat.messages.length - 1]?.timestamp) : "Start chat"}
                  </span>
                </div>
                <p className="text-sm truncate">
                  {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1]?.text : "No messages yet"}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default ChatList;
