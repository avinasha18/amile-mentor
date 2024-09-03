import React, { useState, useEffect, useRef } from "react";
import MessageInput from "../ChatInput";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Avatar, IconButton, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function ChatWindow({ activeChat, sendMessage, onBack, loadMoreMessages }) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [messages, setMessages] = useState([]);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.messages);
      setHasMoreMessages(activeChat.totalPages > currentPage);
      setCurrentPage(1);
    }
  }, [activeChat]);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesEndRef.current) {
        const scrollContainer = messagesEndRef.current;

        setShowScrollUp(
          scrollContainer.scrollTop <
            scrollContainer.scrollHeight - scrollContainer.clientHeight
        );

     
      }
    };

    const scrollContainer = messagesEndRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [hasMoreMessages, loadingMore]);

  const handleSendMessage = (message) => {
    sendMessage(message);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  const handleLoadMoreMessages = async () => {
    setLoadingMore(true);
    await loadMoreMessages(currentPage + 1);

    setCurrentPage((prevPage) => prevPage + 1);

    setLoadingMore(false);
  };

  if (!activeChat) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <h1 className="text-xl text-gray-500">
          Select a chat to start messaging
        </h1>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <IconButton onClick={onBack} className="mr-4">
          <ArrowBackIcon style={{ color: isDarkMode ? "#fff" : "#000" }} />
        </IconButton>
        <div className="flex items-center">
          {activeChat?.companyLogo && (
            <Avatar
              src={activeChat.companyLogo}
              alt="Company Logo"
              className="mr-2"
            />
          )}
          <h2 className="text-xl font-semibold">
            {activeChat?.studentId?.name}
          </h2>
        </div>
      </div>
      <div
        className="flex-grow overflow-y-auto p-4 no-scrollbar"
        ref={messagesEndRef}
      >
        <div className="flex justify-center mt-4">
          {hasMoreMessages && (
            <button
              onClick={handleLoadMoreMessages}
              disabled={loadingMore}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              {loadingMore ? "Loading..." : "Load More Messages"}
            </button>
          )}
        </div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.sender === activeChat.mentorId?._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                msg.sender === activeChat.mentorId?._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.text}
              <div className="text-xs mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t">
        <MessageInput sendMessage={handleSendMessage} />
      </div>
      {showScrollUp && (
        <IconButton
          onClick={scrollToBottom}
          sx={{
            position: "fixed",
            bottom: "120px",
            right: "20px",
            backgroundColor: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
            "&:hover": {
              backgroundColor: isDarkMode ? "#444" : "#f0f0f0",
            },
          }}
        >
          <ArrowDownwardIcon />
        </IconButton>
      )}
    </div>
  );
}

export default ChatWindow;
