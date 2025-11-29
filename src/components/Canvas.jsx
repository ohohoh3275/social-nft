import React, { useState } from 'react';
import StickerMessage from './StickerMessage';
import { Plus, Share2, Wallet } from 'lucide-react';
import { connectWallet, mintNFT, uploadToIPFS } from '../utils/web3';
import html2canvas from 'html2canvas';

const Canvas = () => {
    const [topic, setTopic] = useState("Social NFT");
    const [walletAddress, setWalletAddress] = useState(null);
    const [isMinting, setIsMinting] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Congrats!", type: "post-it", position: { x: 100, y: 100 }, rotation: -5, author: "Alice" },
        { id: 2, text: "To the moon! 🌕", type: "graffiti", position: { x: 400, y: 150 }, rotation: 10, author: "Bob" },
        { id: 3, text: "Don't forget the snacks", type: "tape", position: { x: 200, y: 400 }, rotation: 3, author: "Charlie" },
        { id: 4, text: "Best of luck", type: "polaroid", position: { x: 600, y: 300 }, rotation: -8, author: "Dave" },
    ]);

    const [newMessage, setNewMessage] = useState("");

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

        const styles = ['post-it', 'tape', 'graffiti', 'polaroid'];
        const randomStyle = styles[Math.floor(Math.random() * styles.length)];
        const randomX = Math.random() * (window.innerWidth - 200);
        const randomY = Math.random() * (window.innerHeight - 200);
        const randomRotation = Math.random() * 20 - 10;

        const newMsg = {
            id: Date.now(),
            text: newMessage,
            type: randomStyle,
            position: { x: randomX, y: randomY },
            rotation: randomRotation,
            author: "Me",
        };

        setMessages([...messages, newMsg]);
        setNewMessage("");
    };

    return (
        <div className="relative w-full h-screen bg-white overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}>
            </div>

            {/* Header / Topic */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight px-8 py-4 
                    bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100"
                    style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {topic}
                </h1>
                <div className="mt-4 flex justify-center gap-3">
                    {walletAddress && (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1.5 text-xs font-medium rounded-full 
                            border border-gray-200 shadow-sm">
                            Owner: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        </span>
                    )}
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 text-xs font-medium rounded-full 
                        border border-emerald-200 shadow-sm">
                        Status: Open
                    </span>
                </div>
            </div>

            {/* Messages Layer */}
            <div className="absolute inset-0">
                {messages.map((msg) => (
                    <StickerMessage key={msg.id} data={msg} />
                ))}
            </div>

            {/* UI Controls (Bottom) */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-50">
                <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-gray-100 
                    flex flex-col gap-5">

                    {/* Message Input */}
                    <div className="flex gap-3 w-full items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 
                        focus-within:border-gray-300 transition-all">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Leave a message..."
                            className="flex-1 bg-transparent border-none outline-none text-gray-700 text-base 
                                placeholder-gray-400 font-medium"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
                        />
                        <button
                            onClick={handleAddMessage}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2.5 rounded-xl 
                                hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95"
                        >
                            <Plus size={20} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Web3 Controls */}
                    <div className="flex justify-between items-center pt-2">
                        {!walletAddress ? (
                            <button
                                onClick={handleConnectWallet}
                                className="flex items-center gap-2 text-sm font-semibold text-gray-600 
                                    hover:text-blue-600 transition-colors group"
                            >
                                <Wallet size={18} className="group-hover:animate-pulse" />
                                Connect Wallet
                            </button>
                        ) : (
                            <span className="flex items-center gap-2 text-xs font-mono text-gray-500 
                                bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            </span>
                        )}

                        <button
                            onClick={handleMint}
                            disabled={isMinting || !walletAddress}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 
                                ${isMinting || !walletAddress
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105 active:scale-95'
                                }`}
                        >
                            {isMinting ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Minting...
                                </span>
                            ) : (
                                'Mint as NFT ✨'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Canvas;
