import React, { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from "./NavBar";

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef(null);

  // Base API URL - adjust according to your backend
  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, []);

  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/messages/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error("Expected array from API, got:", data);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const trimmedInput = userInput.trim();
    
    if (trimmedInput === "") {
      setLoading(false);
      return;
    }
    
    if (trimmedInput.toLowerCase() === "clear") {
      setMessages([]);
      setUserInput("");
      setLoading(false);
      return;
    }

    try {
      // Send user message
      const userMessageResponse = await fetch(`${API_BASE_URL}/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userInput,
          sender: "me",
        }),
      });

      if (!userMessageResponse.ok) {
        throw new Error(`HTTP error! status: ${userMessageResponse.status}`);
      }

      const userMessageData = await userMessageResponse.json();
      
      if (userMessageData && userMessageData.text) {
        setMessages((prev) => [...prev, userMessageData]);
        setUserInput("");
        
        try {
          // Get AI response
          const aiResponse = await fetch(`${API_BASE_URL}/chatgpt/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: trimmedInput }),
          });

          if (!aiResponse.ok) {
            throw new Error(`HTTP error! status: ${aiResponse.status}`);
          }

          const aiData = await aiResponse.json();
          
          if (aiData && aiData.text) {
            setMessages((prev) => [...prev, aiData]);
          }
        } catch (err) {
          console.error("Failed to get ChatGPT reply:", err);
        }
      } else {
        console.error("Invalid message returned from API:", userMessageData);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Chat Page</h1>

      <div className="max-w-4xl mx-auto h-[550px] border border-gray-300 rounded-lg p-4 bg-white shadow-lg relative">
        {/* Display Area */}
        <div className="h-[450px] overflow-y-auto mb-4 px-2">
          <div className="flex flex-col gap-1.5">
            {messages.map((msg, idx) =>
              msg?.text ? (
                <div
                  key={msg._id || msg.id || idx}
                  ref={idx === messages.length - 1 ? lastMessageRef : null}
                  className={`inline-block max-w-[70%] p-3 my-1.5 rounded-[18px] text-[15px] leading-relaxed break-words ${
                    msg.sender === "chatgpt" || msg.sender === "Ai Model"
                      ? "bg-white border border-gray-200 self-start"
                      : "bg-green-100 self-end ml-auto"
                  }`}
                >
                  <div
                    className="whitespace-normal break-words leading-relaxed text-[16px] text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: msg.text
                        .replace(/\n/g, "<br>")
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/``````/gs, '<pre class="bg-gray-100 p-2.5 rounded-lg overflow-x-auto font-mono text-sm my-2"><code>$1</code></pre>')
                        .replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded font-mono text-sm">$1</code>')
                    }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-1">
                    {msg.sender} •{" "}
                    {msg.createdAt || msg.created_at
                      ? new Date(msg.createdAt || msg.created_at).toLocaleTimeString()
                      : new Date().toLocaleTimeString()}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Form Area */}
        <div className="sticky bottom-2">
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-full outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={loading}
            />
            {loading ? (
              <div className="bg-gray-400 text-white px-5 py-2.5 rounded-full text-base font-medium cursor-not-allowed">
                Loading...
              </div>
            ) : (
              <>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full text-base font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-none"
                >
                  Send
                </button>
                <Link to="/voice">
                  <button
                    type="button"
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full text-base font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-none"
                  >
                    Voice
                  </button>
                </Link>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
