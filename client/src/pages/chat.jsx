import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import io from 'socket.io-client';
import axios from "axios";

import "./chat.css";
import uploadImg from '../assests/image-upload-icon.svg';
import sendLogo from '../assests/send.svg';
import gifIcon from '../assests/gif-icon.png';
import backIcon from '../assests/back-arrow.svg';

import ImageModel from "../components/imageModel";
import Gifs from "../components/Gifs";

const Chat = () => {
    // const SERVER = 'http://localhost:5000';
    const SERVER = 'https://vibe-chat-1wmu.onrender.com';

    const socketRef = useRef();
    const chatContainerRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();

    const [msg, setMsg] = useState('');
    const [room, setRoom] = useState('');
    const [chat, setChat] = useState([]);
    const [image, setImage] = useState('');
    const [userName, setUserName] = useState('');
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isGifsSectionActive, setIsGifsSectionActive] = useState(false);
    const [currOnline, setCurrOnline] = useState(4);

    // Initialize socket and join room
    useEffect(() => {
        console.log('useeffect');
        
        const storedUserName = localStorage.getItem('userName');
        const storedRoom = localStorage.getItem('roomName');

        if (!storedUserName || !storedRoom) {
            navigate('/');
            return;
        }

        setUserName(storedUserName);
        setRoom(storedRoom);

        const socket = io(SERVER);
        socketRef.current = socket;

        socket.emit('join', storedRoom);

        // Listen for incoming messages
        socket.on('message', (data) => {
            setChat(prev => [...prev, data]);
        });

        // Cleanup on unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    // Scroll to bottom when chat updates
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [chat]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrOnline(Math.floor(Math.random() * 100));
        }, 5000);
        return () => clearInterval(interval);
    }, [])

    const handleSend = (paramMsg = '') => {
        if (!room) return;

        const content = paramMsg || msg || image;
        if (!content.trim()) return;

        socketRef.current.emit('message', {
            userName,
            message: content,
            roomName: room,
        });

        setMsg('');
        setImage('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImageDialogOpen(true);

        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'ranadeep_demo');
        data.append('cloud_name', 'dhk5v8qpf');

        axios.post('https://api.cloudinary.com/v1_1/dhk5v8qpf/image/upload', data)
            .then(res => {
                setImage(res?.data?.secure_url || '');
            })
            .catch(err => {
                console.error("Image upload failed", err);
                setIsImageDialogOpen(false);
            });
    };

    const handleImageActions = (action) => {
        if (action === 'SEND') handleSend();
        if (action === 'CANCEL') setImage('');
    };

    const handleGifClick = (gif) => {
        setIsGifsSectionActive(false);
        if (gif !== 'CLOSE') {
            handleSend(gif);
        }
    };

    return (
        <div className="container">
            {/* Room Display */}
            <div className="room-input-container">
            <img
                src={backIcon}
                alt="Back"
                width="24px"
                onClick={() => navigate('/rooms')}
                className="back-icon"
            />

            {/* <div className="room-details"> */}
                <h3 className="room-name">{room}</h3>
                <p className="online-count">{currOnline} online</p>
            {/* </div> */}
            </div>

            {/* Chat Messages */}
            <div className="chat-container" ref={chatContainerRef}>
                {chat.map((item, idx) => (
                    <div className="chat" key={idx}>
                        <p className="message-user">{item.userName}</p>
                        {
                            item.message.includes('dhk5v8qpf') || item.message.includes('russmus')
                                ? <img src={item.message} alt="uploaded" className="message-img message-content" />
                                : <p className="message-content">{item.message}</p>
                        }
                    </div>
                ))}
            </div>

            {/* Input Section */}
            <div className="input-container">
                <input
                    className="chat-input"
                    type="text"
                    placeholder="Type your message here"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />

                <input
                    type="file"
                    id="file"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />
                <label htmlFor="file" className="file-input">
                    <img src={uploadImg} alt="Upload" />
                </label>

                <img
                    src={gifIcon}
                    alt="GIF"
                    onClick={() => setIsGifsSectionActive(true)}
                    style={{ width: '30px', cursor: 'pointer' }}
                />

                <span>
                    <button onClick={handleSend}>
                        <img src={sendLogo} alt="Send" />
                    </button>
                </span>
            </div>

            {/* Image Preview Dialog */}
            {image && (
                <ImageModel image={image} handleImageActions={handleImageActions} />
            )}

            {/* GIF Picker */}
            {isGifsSectionActive && (
                <div className="gifs-section">
                    <Gifs handleGifClick={handleGifClick} />
                </div>
            )}
        </div>
    );
};

export default Chat;
