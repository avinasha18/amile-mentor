import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatList from '../ChatList';
import ChatWindow from '../ChatWindow';
import { useTheme } from '../../context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const socket = io('http://localhost:9000');

function Messages() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [mentorData, setMentorData] = useState(null);
  const { isDarkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const userType = 'mentor'; // 'mentor' or 'student'
  const userId = Cookies.get('mentorId');
  const mentorName = Cookies.get('mentor');
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.chat) {
      setActiveChat(location.state.chat);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/${userType}/${userId}`);
        setChats(response.data);

        if (activeChat) {
          const updatedActiveChat = response.data.find(chat => chat._id === activeChat._id);
          if (updatedActiveChat) {
            setActiveChat(updatedActiveChat);
          }
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();

    const pollingInterval = setInterval(fetchChats, 1000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [userId, userType, activeChat]);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const response = await axios.post('http://localhost:9000/studentdata', {
          username: 'avinasha'
        });
        setMentorData(response.data.data);
      } catch (error) {
        console.error('Error fetching mentor data:', error);
      }
    };

    fetchMentorData();
  }, [mentorName]);

  useEffect(() => {
    socket.on('receiveMessage', ({ chat }) => {
      setChats((prevChats) =>
        prevChats.map((c) => (c._id === chat._id ? chat : c))
      );
      if (activeChat && activeChat._id === chat._id) {
        setActiveChat(chat);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [activeChat]);

  const sendMessage = (message) => {
    if (activeChat) {
      axios
        .post('http://localhost:9000/send', {
          mentorId: activeChat.mentorId,
          studentId: activeChat.studentId,
          text: message,
          sender: userType,
        })
        .then((response) => {
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat._id === response.data._id ? response.data : chat
            )
          );
          setActiveChat(response.data);
        })
        .catch((error) => console.error('Error sending message:', error));
    }
  };

  return (
    <div className={`flex h-screen w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {!activeChat || !isMobile ? (
        <div className={`flex-none h-full ${isMobile ? 'w-full' : 'w-2/6'} border-r`}>
          <ChatList chats={chats} setActiveChat={setActiveChat} activeChat={activeChat} mentorData={mentorData} />
        </div>
      ) : null}
      {(activeChat || !isMobile) && (
        <div className={`flex-grow h-full ${isMobile ? 'w-full' : 'w-4/6'}`}>
          <ChatWindow activeChat={activeChat} sendMessage={sendMessage} onBack={() => setActiveChat(null)} mentorData={mentorData} />
          </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Messages;
