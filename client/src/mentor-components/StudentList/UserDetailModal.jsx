import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const UserDetailModal = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;
    console.log('opened')



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
      
      </div>
    </div>
  );
};

export default UserDetailModal;
