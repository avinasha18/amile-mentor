import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const UserDetailModal = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;
    console.log('opened')
  const userId = Cookies.get('mentorId');
  const userType = 'mentor'; // 'mentor' or 'student'
  const navigate = useNavigate();

  const startChat = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/mentor/${userId}/student/${user.id}`);
      const chat = response.data;
      navigate('/messages', { state: { chat } });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  return (
    <div className="modal-overlay z-50">
      <div className="modal-content">
        <div className="modal-header">
          <h2>User Details</h2>
          <AiOutlineClose onClick={onClose} />
        </div>
        <div className="modal-body">
          <p>Username: {user.userName}</p>
          <p>Progress: {user.progress}</p>
        </div>
        <div className="modal-footer">
          <button onClick={startChat}>Message</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
