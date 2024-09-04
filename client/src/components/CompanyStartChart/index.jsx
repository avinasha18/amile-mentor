import React, { useState, useEffect } from "react";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import socket from "../../services/socket/socket";

function StartChat() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const mentorId = useSelector((state) => state.auth.mentorData?._id);

  console.log(mentorId);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 30;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id === data.chat._id) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                data.chat.messages[data.chat.messages.length - 1],
              ],
            };
          }
          return chat;
        });

        return updatedChats;
      });

      if (activeChat && activeChat._id === data.chat._id) {
        setActiveChat((prevActiveChat) => ({
          ...prevActiveChat,
          messages: [
            ...prevActiveChat.messages,
            data.chat.messages[data.chat.messages.length - 1],
          ],
        }));
      }
    });

    socket.on("updateChats", (updatedChats) => {
      setChats(updatedChats);

      if (activeChat) {
        const updatedActiveChat = updatedChats.find(
          (chat) => chat._id === activeChat._id
        );
        if (updatedActiveChat) {
          setActiveChat(updatedActiveChat);
        }
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updateChats");
    };
  }, [activeChat]);

  useEffect(() => {
    fetchChats(page);
  }, [page]);

  // Function to fetch chats with pagination
  const fetchChats = (pageNumber) => {
    setLoading(true);
    console.log(pageNumber);
    socket.emit(
      "getChats",
      { message: { mentorId }, page: pageNumber, limit },
      (response) => {
        console.log(response);
        if (response.success) {
          setChats(response.chats);
        } else {
          toast.error("Error fetching chats.");
        }
        setLoading(false);
      }
    );
  };

  const loadMoreMessages = async (newPage) => {
    socket.emit(
      "getChats",
      {
        message: { mentorId, studentId: activeChat.studentId._id },
        page: newPage,
        limit,
      },
      (data) => {
        if (data.success) {
          if (activeChat && activeChat._id === data.chat._id) {
            setActiveChat((prevActiveChat) => ({
              ...prevActiveChat,
              messages: [...data.chat.messages, ...prevActiveChat.messages],
            }));
          }
        } else {
          toast.error("Error loading more messages.");
        }
      }
    );
  };

  const sendMessage = (message) => {
    if (activeChat && message.trim()) {
      const newMessage = {
        mentorId: activeChat.mentorId._id,
        studentId: activeChat.studentId._id,
        text: message,
        sender: activeChat.mentorId._id,
      };

      socket.emit("sendMessage", { message: newMessage }, (response) => {
        console.log(response);
        if (response.success) {
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat._id === response.chat._id ? response.chat : chat
            )
          );
          setActiveChat(response.chat);
        } else {
          toast.error("Error sending message.");
        }
      });
    }
  };

  return (
    <div
      className={`flex h-screen w-full overflow-hidden  ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <ToastContainer />
      {!activeChat || !isMobile ? (
        <div
          className={`flex-none h-full ${
            isMobile ? "w-full" : "w-1/3"
          } border-r`}
        >
          <ChatList
            chats={chats}
            setActiveChat={setActiveChat}
            activeChat={activeChat}
            isLoading={loading}
          />
        </div>
      ) : null}
      {(activeChat || !isMobile) && (
        <div className={`flex-grow h-full ${isMobile ? "w-full" : "w-2/3"}`}>
          <ChatWindow
            activeChat={activeChat}
            sendMessage={sendMessage}
            loadMoreMessages={loadMoreMessages}
            onBack={() => setActiveChat(null)}
          />
        </div>
      )}
    </div>
  );
}

export default StartChat;
