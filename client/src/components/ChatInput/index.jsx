import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Send as SendIcon } from '@mui/icons-material';

function MessageInput({ sendMessage }) {
  const [message, setMessage] = useState('');
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-2 w-full mb-20"
    >
      <textarea
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={handleKeyDown}
        className={`flex-grow resize-none p-2 rounded-md outline-none ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
        } border ${
          isDarkMode ? 'border-gray-600' : 'border-gray-300'
        } focus:ring-2 focus:ring-blue-500`}
      />
      {message.trim() && (
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
        >
          <SendIcon />
        </button>
      )}
    </form>
  );
}

export default MessageInput;
  