import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import ReplyItem from './ReplyItem';

const MessageCard = ({ data, onAddReply }) => {
    const { id, text, author, timestamp, replies = [] } = data;
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleReplySubmit = () => {
        if (!replyText.trim()) return;
        onAddReply(id, replyText);
        setReplyText("");
        setShowReplyInput(false);
    };

    const formatTime = (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-4 hover:shadow-lg transition-shadow"
        >
            {/* Card Header */}
            <div className="p-4 pb-3 border-b border-blue-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 
                        flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm">{author}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock size={12} />
                            <span>{formatTime(timestamp)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5 pt-4">
                <p className="text-gray-700 text-base leading-relaxed">{text}</p>
            </div>

            {/* Card Actions */}
            <div className="px-5 pb-3 flex items-center gap-4 text-gray-500">
                <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                    <Heart size={20} className="group-hover:fill-blue-100 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium">Like</span>
                </button>
                <button
                    onClick={() => setShowReplyInput(!showReplyInput)}
                    className="flex items-center gap-2 hover:text-cyan-500 transition-colors group"
                >
                    <MessageCircle size={20} className="group-hover:fill-cyan-100 transition-colors" />
                    <span className="text-sm font-medium">
                        Reply {replies.length > 0 && `(${replies.length})`}
                    </span>
                </button>
            </div>

            {/* Reply Input */}
            {showReplyInput && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-4 border-t border-blue-50 pt-3"
                >
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="flex-1 bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm 
                                outline-none focus:border-blue-400 focus:bg-white transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
                        />
                        <button
                            onClick={handleReplySubmit}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2.5 
                                rounded-xl text-sm font-semibold hover:shadow-md hover:scale-105 
                                transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!replyText.trim()}
                        >
                            Post
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Replies List */}
            {replies.length > 0 && (
                <div className="bg-blue-50/30 px-5 py-3 border-t border-blue-100">
                    <div className="space-y-3">
                        {replies.map((reply) => (
                            <ReplyItem key={reply.id} data={reply} />
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default MessageCard;
