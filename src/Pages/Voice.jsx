import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Voice = () => {
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
    const [botreply, setReply] = useState("");
    const [messages, setMessages] = useState([]);
    const [displayHistory, setDisplayHistory] = useState(true);

    const chatRef = useRef(null);

    // Base API URL
    const API_BASE_URL = "https://hackwithupbackend-main-production.up.railway.app/api";

    // 🎤 Speech recognition setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "hi-IN"; // Hindi for recognition

    // 🗣️ Speak function
    const speak = (msg) => {
        const utterance = new SpeechSynthesisUtterance(msg);
        utterance.lang = "hi-IN";
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    };

    // 🎧 Handle speech recognition result
    recognition.onresult = async (event) => {
        const command = event.results[0][0].transcript.trim();
        setText(command);
        console.log("🎙️ Heard:", command);

        if (!command) return;

        try {
            setLoading(true);

            // Speak waiting message
            speak('कृपया कुछ समय प्रतीक्षा करें, कृषि सखी आपके प्रश्न का उत्तर शीघ्र ही प्रदान करेगी।');

            // 1️⃣ Add user message
            const userMessage = { text: command, sender: "me" };
            setMessages((prev) => [...prev, userMessage]);

            const userResponse = await fetch(`${API_BASE_URL}/messages/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userMessage),
            });

            // 2️⃣ Get AI reply
            const gptResponse = await fetch(`${API_BASE_URL}/chatgpt/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: command }),
            });

            const gptData = await gptResponse.json();
            const replyText = gptData?.text || "मैं समझ नहीं पाया";
            setReply(replyText);

            const botMessage = { text: replyText, sender: "bot" };
            setMessages((prev) => [...prev, botMessage]);

            // 3️⃣ Speak AI reply
            speak(replyText);

        } catch (err) {
            console.error("Error during AI call:", err);
            speak("माफ़ कीजिए, मैं उस अनुरोध को संसाधित नहीं कर सका");
        } finally {
            setLoading(false);
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        speak("मैं आपको ठीक से सुन नहीं पाया, कृपया दोबारा बोलें");
        setListening(false);
    };

    // 🎬 Start or stop listening
    const handleVoice = () => {
        if (listening) {
            recognition.stop();
            setListening(false);
        } else {
            recognition.start();
            setListening(true);
        }
    };

    // 📨 Fetch chat history from backend
    const fetchMessages = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setMessages(data);
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        }
    };

    // 🕓 Fetch messages once on mount
    useEffect(() => {
        fetchMessages();
    }, []);

    // 🔽 Auto scroll chat to bottom
    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleHistory = () => {
        setDisplayHistory(!displayHistory);
    };

    const handleMute = () => {
        window.speechSynthesis.cancel();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Top Navigation Buttons */}
            <div className="flex gap-4 mb-6 justify-center">
                <button
                    onClick={handleHistory}
                    className="bg-gradient-to-br from-green-500 to-green-700 text-white border-none rounded-xl px-7 py-3 text-base font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 hover:from-green-600 hover:to-green-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                >
                    {displayHistory ? (
                        <>
                            <span>🕓</span> History
                        </>
                    ) : (
                        <>
                            <span>🎙️</span> Voice Ass.
                        </>
                    )}
                </button>

                <Link to="/chat">
                    <button className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-none rounded-xl px-8 py-3 text-base font-semibold cursor-pointer transition-all duration-300 hover:from-blue-600 hover:to-blue-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
                        Chat
                    </button>
                </Link>
            </div>

            {/* Main Content Area */}
            {displayHistory ? (
                <>
                    {/* Voice Assistant Container */}
                    <div className="text-center p-8 bg-green-50 rounded-2xl shadow-lg max-w-lg mx-auto mb-6 font-sans">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">🎤 Voice Assistant</h2>
                        
                        {/* Status Indicator */}
                        <div className="text-lg text-green-800 mb-4 font-medium">
                            {loading ? "Processing..." : listening ? "Listening..." : "Idle"}
                        </div>

                        {/* Mic Button */}
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={handleVoice}
                                disabled={loading}
                                className="bg-green-500 text-white border-none px-7 py-3.5 text-lg rounded-full cursor-pointer transition-all duration-300 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {listening ? "🛑 Stop" : "🎙️ Start"}
                            </button>

                            {listening && (
                                <button
                                    onClick={handleMute}
                                    className="bg-green-100 text-green-800 border border-green-300 rounded-full px-4 py-2.5 text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-green-200 hover:text-green-900 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                                >
                                    🔇
                                </button>
                            )}
                        </div>

                        {/* Spoken Text Display */}
                        {text && (
                            <p className="mt-4 text-green-900 text-base font-medium whitespace-pre-wrap bg-green-100 px-5 py-4 rounded-2xl shadow-inner text-left leading-relaxed">
                                You said: "{text}"
                            </p>
                        )}
                    </div>

                    {/* Reply Box */}
                    {botreply && (
                        <div className="bg-green-200 text-green-900 px-5 py-4 rounded-2xl shadow-md max-w-2xl mx-auto text-base leading-relaxed break-words whitespace-pre-wrap text-left relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg before:content-[''] before:absolute before:top-2.5 before:-left-3 before:border-t-[10px] before:border-t-transparent before:border-b-[10px] before:border-b-transparent before:border-r-[12px] before:border-r-green-200">
                            <p>Krishi Sakhi Reply: "{botreply}"</p>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Chat History */}
                    <div
                        ref={chatRef}
                        className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-5 mx-5 h-[70vh] flex flex-col-reverse overflow-y-auto shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#81c784 transparent'
                        }}
                    >
                        <h3 className="text-xl font-bold text-green-800 mb-4">🕓 Chat History</h3>
                        {messages.length === 0 ? (
                            <p className="text-green-700 text-center">No messages yet.</p>
                        ) : (
                            [...messages].reverse().map((msg, index) => (
                                <div
                                    key={index}
                                    className={`px-5 py-3.5 rounded-2xl max-w-2xl my-3 text-base leading-relaxed break-words whitespace-pre-wrap relative ${
                                        msg.sender === "me"
                                            ? "bg-green-50 text-green-900 text-right ml-auto after:content-[''] after:absolute after:top-2.5 after:-right-3 after:border-t-[10px] after:border-t-transparent after:border-b-[10px] after:border-b-transparent after:border-l-[12px] after:border-l-green-50"
                                            : "bg-white text-green-900 text-left"
                                    }`}
                                >
                                    <strong className="block mb-1">
                                        {msg.sender === "me" ? "आप:" : "कृषि सखी:"}
                                    </strong>
                                    <p className="my-2.5 leading-relaxed text-green-800">{msg.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                div::-webkit-scrollbar {
                    width: 8px;
                }
                div::-webkit-scrollbar-thumb {
                    background: #81c784;
                    border-radius: 10px;
                }
                div::-webkit-scrollbar-thumb:hover {
                    background: #66bb6a;
                }
            `}</style>
        </div>
    );
};

export default Voice;
