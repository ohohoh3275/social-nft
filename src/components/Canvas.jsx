import React, { useState } from 'react';
import StickerMessage from './StickerMessage';
import { Plus, Share2 } from 'lucide-react';
import { connectWallet, mintNFT, uploadToIPFS } from '../utils/web3';
import html2canvas from 'html2canvas';

const Canvas = () => {
    const [topic, setTopic] = useState("Ziri's Awesome Project Launch 🚀");
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
            // 1. Capture the canvas as an image
            // Note: In a real app, we need to handle cross-origin images and ensure the canvas is fully loaded
            const canvasElement = document.body; // Capturing the whole body for prototype
            const canvas = await html2canvas(canvasElement);
            const imageDataUrl = canvas.toDataURL("image/png");

            // 2. Upload to IPFS (Mock)
            const tokenURI = await uploadToIPFS(imageDataUrl);

            // 3. Mint NFT
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
        <div className="relative w-full h-screen bg-[#f0f0f0] overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/crumpled-paper.png")' }}>
            </div>

            {/* Header / Topic */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 text-center">
                <h1 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tighter uppercase drop-shadow-sm bg-white px-6 py-2 rotate-1 border-4 border-black">
                    {topic}
                </h1>
                <div className="mt-2 flex justify-center gap-2">
                    <span className="bg-black text-white px-2 py-1 text-xs font-mono rounded">Owner: 0x71C...9A2</span>
                    <span className="bg-green-500 text-white px-2 py-1 text-xs font-mono rounded">Status: Open</span>
                </div>
            </div>

            {/* Messages Layer */}
            <div className="absolute inset-0">
                {messages.map((msg) => (
                    <StickerMessage key={msg.id} data={msg} />
                ))}
            </div>

            {/* UI Controls (Bottom) */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-gray-200 flex flex-col gap-4 z-50">

                {/* Message Input */}
                <div className="flex gap-2 w-full">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Leave a mark..."
                        className="flex-1 bg-transparent border-none outline-none text-gray-800 font-handlee text-lg placeholder-gray-400"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
                    />
                    <button
                        onClick={handleAddMessage}
                        className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Web3 Controls */}
                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                    {!walletAddress ? (
                        <button
                            onClick={handleConnectWallet}
                            className="text-sm font-bold text-blue-600 hover:text-blue-800"
                        >
                            Connect Wallet
                        </button>
                    ) : (
                        <span className="text-xs font-mono text-gray-500">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        </span>
                    )}

                    <button
                        onClick={handleMint}
                        disabled={isMinting || !walletAddress}
                        className={`px-4 py-1 rounded-full text-sm font-bold text-white transition-all ${isMinting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg'
                            }`}
                    >
                        {isMinting ? 'Minting...' : 'Mint as NFT ✨'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Canvas;
