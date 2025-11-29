import React from 'react';
import { motion } from 'framer-motion';

const StickerMessage = ({ data, onUpdatePosition }) => {
    const { id, text, type, position, rotation, author } = data;

    const variants = {
        'post-it': 'bg-amber-50 text-gray-700 border border-amber-100 shadow-sm',
        'tape': 'bg-blue-50 text-gray-700 border border-blue-100 shadow-sm',
        'polaroid': 'bg-white p-3 pb-10 text-gray-700 border border-gray-200 shadow-md',
        'graffiti': 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-600 font-semibold text-xl border border-purple-200 shadow-sm',
    };

    const baseStyle = "absolute p-4 max-w-[200px] break-words cursor-move select-none rounded-lg";
    const typeStyle = variants[type] || variants['post-it'];

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ x: position.x, y: position.y, rotate: rotation, scale: 0 }}
            animate={{ x: position.x, y: position.y, rotate: rotation, scale: 1 }}
            whileHover={{ scale: 1.08, zIndex: 100, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
            whileDrag={{ scale: 1.08, zIndex: 100, cursor: 'grabbing', boxShadow: '0 16px 32px rgba(0,0,0,0.15)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onDragEnd={(event, info) => {
                // In a real app, we would update the position in the backend here
            }}
            className={`${baseStyle} ${typeStyle}`}
            style={{
                fontFamily: type === 'graffiti' ? 'Poppins, sans-serif' : 'Inter, sans-serif',
            }}
        >
            {type === 'tape' && (
                <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 w-10 h-5 
                    bg-gradient-to-r from-pink-200 to-pink-300 opacity-70 rotate-1 rounded-sm shadow-sm">
                </div>
            )}

            {type === 'polaroid' ? (
                <div className="flex flex-col items-center">
                    <div className="w-full h-28 bg-gradient-to-br from-gray-50 to-gray-100 mb-3 flex items-center 
                        justify-center text-gray-300 text-xs font-medium rounded border border-gray-100">
                        [Image]
                    </div>
                    <p className="text-sm font-medium text-center">{text}</p>
                </div>
            ) : (
                <p className="font-medium text-base leading-relaxed">{text}</p>
            )}

            <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 font-medium">
                {author}
            </span>
        </motion.div>
    );
};

export default StickerMessage;
