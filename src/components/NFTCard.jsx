import React from 'react';
import { Clock } from 'lucide-react';

const NFTCard = ({ data }) => {
    const { text, username, createdAt, replies = [] } = data;

    const formatTime = (createdAt) => {
        const date = new Date(createdAt);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-200 max-w-lg mx-auto">
            {/* Header */}
            <div className="mb-6 pb-6 border-b-2 border-blue-100">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 
                        flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">{username}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock size={14} />
                            <span>{formatTime(createdAt)}</span>
                        </div>
                    </div>
                </div>
                <p className="text-gray-800 text-lg leading-relaxed font-medium">{text}</p>
            </div>

            {/* Replies Section */}
            {replies.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-blue-200"></div>
                        <span className="text-sm font-semibold text-blue-600">
                            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                        </span>
                        <div className="h-px flex-1 bg-blue-200"></div>
                    </div>

                    {replies.map((reply, index) => (
                        <div key={reply.id} className="flex gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 
                                flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                {reply.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-800 text-sm">{reply.username}</span>
                                    <span className="text-xs text-gray-400">• {formatTime(reply.createdAt)}</span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{reply.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* NFT Branding */}
            <div className="mt-8 pt-6 border-t-2 border-blue-100 text-center">
                <div className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                    Social NFT
                </div>
            </div>
        </div>
    );
};

export default NFTCard;
