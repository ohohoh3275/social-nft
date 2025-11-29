import React from 'react';
import { motion } from 'framer-motion';

const StickerMessage = ({ data, onUpdatePosition }) => {
    const { id, text, type, position, rotation, author } = data;

    const variants = {
        'post-it': 'bg-yellow-200 text-black shadow-lg',
        'tape': 'bg-white text-black border border-gray-200 shadow-md',
        'polaroid': 'bg-white p-2 pb-8 text-black shadow-xl',
        'graffiti': 'bg-transparent text-pink-500 font-bold text-2xl drop-shadow-md',
    };

    const baseStyle = "absolute p-4 max-w-[200px] break-words cursor-move select-none";
    const typeStyle = variants[type] || variants['post-it'];

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ x: position.x, y: position.y, rotate: rotation, scale: 0 }}
            animate={{ x: position.x, y: position.y, rotate: rotation, scale: 1 }}
            whileHover={{ scale: 1.1, zIndex: 100 }}
            whileDrag={{ scale: 1.1, zIndex: 100, cursor: 'grabbing' }}
            onDragEnd={(event, info) => {
                // In a real app, we would update the position in the backend here
                // onUpdatePosition(id, { x: position.x + info.offset.x, y: position.y + info.offset.y });
            }}
            className={`${baseStyle} ${typeStyle}`}
            style={{
                fontFamily: type === 'graffiti' ? '"Permanent Marker", cursive' : '"Handlee", cursive',
            }}
        >
            {type === 'tape' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-red-400 opacity-80 rotate-2"></div>
            )}

            {type === 'polaroid' ? (
                <div className="flex flex-col items-center">
                    <div className="w-full h-24 bg-gray-200 mb-2 flex items-center justify-center text-gray-400 text-xs">
                        [Image]
                    </div>
                    <p className="text-sm font-handwriting">{text}</p>
                </div>
            ) : (
                <p className="font-handwriting text-lg leading-tight">{text}</p>
            )}

            <span className="absolute bottom-1 right-2 text-[10px] opacity-50">
                from {author}
            </span>
        </motion.div>
    );
};

export default StickerMessage;
