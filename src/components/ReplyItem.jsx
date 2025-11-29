import React from 'react';
import { Clock } from 'lucide-react';

const ReplyItem = ({ data }) => {
    const { username, text, createdAt } = data;

    const formatTime = (createdAt) => {
        const now = Date.now();
        const diff = now - createdAt;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="flex gap-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 
                flex items-center justify-center text-white font-semibold text-xs shadow-sm flex-shrink-0">
                {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 bg-white rounded-xl px-4 py-2.5 border border-blue-100">
                <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{username}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={11} />
                        <span>{formatTime(createdAt)}</span>
                    </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
            </div>
        </div>
    );
};

export default ReplyItem;
