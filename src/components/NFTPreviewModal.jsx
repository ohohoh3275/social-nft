import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Send } from 'lucide-react';
import html2canvas from 'html2canvas';
import NFTCard from './NFTCard';

const NFTPreviewModal = ({ isOpen, onClose, messageData, isOwner, onTransfer }) => {
    const cardRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsCapturing(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#f0f9ff',
                scale: 2,
                logging: false,
                useCORS: true
            });

            const imageDataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `social-nft-${messageData.id}.png`;
            link.href = imageDataUrl;
            link.click();
        } catch (error) {
            console.error('Failed to capture card:', error);
            alert('이미지 다운로드에 실패했습니다.');
        } finally {
            setIsCapturing(false);
        }
    };

    const handleTransfer = async () => {
        if (!cardRef.current) return;
        setIsCapturing(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#f0f9ff',
                scale: 2,
                logging: false,
                useCORS: true
            });

            const imageDataUrl = canvas.toDataURL('image/png');
            await onTransfer(messageData.id, imageDataUrl);
        } catch (error) {
            console.error('Failed to transfer NFT:', error);
            alert('NFT 전송에 실패했습니다.');
        } finally {
            setIsCapturing(false);
        }
    };

    if (!messageData) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm text-gray-600 
                                hover:text-gray-800 p-2 rounded-full hover:bg-white transition-all shadow-lg"
                        >
                            <X size={24} />
                        </button>

                        {/* NFT Card */}
                        <div className="p-8" ref={cardRef}>
                            <NFTCard data={messageData} />
                        </div>

                        {/* Action Buttons */}
                        <div className="px-8 pb-8 flex gap-3 justify-center">
                            <button
                                onClick={handleDownload}
                                disabled={isCapturing}
                                className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl 
                                    font-semibold hover:shadow-lg transition-all disabled:opacity-50 border-2 border-blue-200"
                            >
                                <Download size={20} />
                                이미지 다운로드
                            </button>

                            {isOwner && (
                                <button
                                    onClick={handleTransfer}
                                    disabled={isCapturing}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 
                                        text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl 
                                        hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <Send size={20} />
                                    {isCapturing ? 'NFT 민팅 중...' : 'NFT 전송'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NFTPreviewModal;
