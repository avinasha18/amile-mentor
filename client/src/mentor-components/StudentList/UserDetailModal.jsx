import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const UserDetailModal = ({ user, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg relative transform transition-transform duration-300 ease-in-out scale-95">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-300"
                >
                    <AiOutlineClose size={28} />
                </button>
                <h2 className="text-3xl font-bold mb-6 text-gray-100 shadow-md">User Details</h2>
                <div className="flex items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-100 shadow-sm">{user.userName}</h3>
                        <p className="text-gray-300 shadow-sm">Progress: <span className="font-medium">{user.progress}</span></p>
                    </div>
                </div>
                <p className="text-gray-200 shadow-sm">Additional user details can go here.</p>
            </div>
        </div>
    );
};

export default UserDetailModal;