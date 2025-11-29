import React, { useState } from 'react';
import MessageCard from './MessageCard';
import NFTPreviewModal from './NFTPreviewModal';
import { Plus, Wallet } from 'lucide-react';
import { connectWallet, mintNFT, uploadToIPFS } from '../utils/web3';
import html2canvas from 'html2canvas';

const Canvas = () => {
    const [topic, setTopic] = useState("Social NFT");
    const [walletAddress, setWalletAddress] = useState(null);
    const [isMinting, setIsMinting] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            userId: 'user_alice_001',
            username: 'Alice',
            text: 'Congrats on the launch! This is amazing! 🎉',
            createdAt: Date.now() - 3600000,
            updatedAt: Date.now() - 3600000,
            isMinted: false,
            nftTokenId: null,
            nftContractAddress: null,
            replies: []
        },
        {
            id: 2,
            userId: 'user_bob_002',
            username: 'Bob',
            text: "To the moon! 🌕 Can't wait to see where this goes!",
            createdAt: Date.now() - 7200000,
            updatedAt: Date.now() - 7200000,
            isMinted: false,
            nftTokenId: null,
            nftContractAddress: null,
            replies: []
        },
        {
            id: 3,
            userId: 'user_charlie_003',
            username: 'Charlie',
            text: "Don't forget to celebrate with the team! You've all worked so hard.",
            createdAt: Date.now() - 10800000,
            updatedAt: Date.now() - 10800000,
            isMinted: false,
            nftTokenId: null,
            nftContractAddress: null,
            replies: []
        },
    ]);

    const [newMessage, setNewMessage] = useState("");
    const [nftModalOpen, setNftModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    // Current user data (will come from authentication in production)
    const currentUser = {
        userId: 'user_me_current',
        username: 'Me'
    };

    const handleConnectWallet = async () => {
        const address = await connectWallet();
        if (address) {
            setWalletAddress(address);
        }
    };

    const handleMint = async () => {
        if (!walletAddress) return;
        setIsMinting(true);

        try {
            const canvasElement = document.body;
            const canvas = await html2canvas(canvasElement);
            const imageDataUrl = canvas.toDataURL("image/png");

            const tokenURI = await uploadToIPFS(imageDataUrl);
            const result = await mintNFT(tokenURI);

            if (result.success) {
                alert(`NFT Minted Successfully! Token ID: ${result.tokenId}`);
            }
        } catch (error) {
            console.error("Minting failed:", error);
            alert("Minting failed. See console for details.");
        } finally {
            setIsMinting(false);
        }
    };

    const handleAddMessage = () => {
        if (!newMessage.trim()) return;

        const now = Date.now();
        const newMsg = {
            id: now,
            userId: currentUser.userId,
            username: currentUser.username,
            text: newMessage,
            createdAt: now,
            updatedAt: now,
            isMinted: false,
            nftTokenId: null,
            nftContractAddress: null,
            replies: [],
        };

        setMessages([newMsg, ...messages]);
        setNewMessage("");
    };

    const handleAddReply = (messageId, replyText) => {
        const now = Date.now();
        const newReply = {
            id: now,
            userId: currentUser.userId,
            username: currentUser.username,
            text: replyText,
            createdAt: now,
            updatedAt: now,
        };

        setMessages(messages.map(msg =>
            msg.id === messageId
                ? { ...msg, replies: [...msg.replies, newReply], updatedAt: now }
                : msg
        ));
    };

    const handleViewNFT = (messageData) => {
        setSelectedMessage(messageData);
        setNftModalOpen(true);
    };

    const handleTransferNFT = async (messageId, imageDataUrl) => {
        if (!walletAddress) {
            alert('먼저 지갑을 연결해주세요.');
            return;
        }

        try {
            // Upload to IPFS
            const tokenURI = await uploadToIPFS(imageDataUrl);

            // Mint NFT
            const result = await mintNFT(tokenURI);

            if (result.success) {
                // Update message with NFT data
                setMessages(messages.map(msg =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            isMinted: true,
                            nftTokenId: result.tokenId,
                            nftContractAddress: result.contractAddress,
                            updatedAt: Date.now()
                        }
                        : msg
                ));

                alert(`NFT가 성공적으로 민팅되었습니다! Token ID: ${result.tokenId}`);
                setNftModalOpen(false);
            }
        } catch (error) {
            console.error('NFT transfer failed:', error);
            alert('NFT 전송에 실패했습니다.');
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #0ea5e9 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}>
            </div>

            {/* Fixed Header - Logo and Wallet on Right */}
            <div className="fixed top-0 right-0 z-30 p-6 flex items-center gap-4">
                {/* Wallet Address - Left of Logo */}
                {!walletAddress ? (
                    <button
                        onClick={handleConnectWallet}
                        className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full 
                            border border-blue-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md
                            text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        <Wallet size={16} />
                        <span>미연결</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full 
                        border border-blue-200 shadow-sm text-sm font-mono text-blue-700">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span>{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</span>
                    </div>
                )}

                {/* Logo */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full 
                    shadow-lg font-bold text-lg tracking-tight"
                    style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {topic}
                </div>
            </div>

            {/* Message Input - Center Top */}
            <div className="pt-32 pb-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-blue-100">
                        <div className="flex gap-3 items-center">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="flex-1 bg-blue-50/50 border border-blue-100 rounded-2xl px-5 py-3.5 text-base 
                                    outline-none focus:border-blue-400 focus:bg-white transition-all placeholder-blue-300
                                    text-blue-900"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
                            />
                            <button
                                onClick={handleAddMessage}
                                disabled={!newMessage.trim()}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3.5 rounded-2xl 
                                    hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95
                                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <Plus size={24} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Feed - Below Input */}
            <div className="max-w-2xl mx-auto px-4 pb-12">
                {messages.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-blue-300 text-lg mb-2">No messages yet</div>
                        <div className="text-blue-200 text-sm">Be the first to share your thoughts!</div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageCard
                            key={msg.id}
                            data={msg}
                            onAddReply={handleAddReply}
                            onViewNFT={handleViewNFT}
                            currentUser={currentUser}
                        />
                    ))
                )}
            </div>

            {/* NFT Preview Modal */}
            <NFTPreviewModal
                isOpen={nftModalOpen}
                onClose={() => setNftModalOpen(false)}
                messageData={selectedMessage}
                isOwner={selectedMessage?.userId === currentUser.userId}
                onTransfer={handleTransferNFT}
            />
        </div>
    );
};

export default Canvas;
