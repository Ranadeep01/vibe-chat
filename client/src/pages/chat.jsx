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
    const SERVER = 'http://localhost:5000';
    // const SERVER = 'https://vibe-chat-1wmu.onrender.com';

    const socketRef = useRef();
    const chatContainerRef = useRef();
    const [serverMSG, setServerMSG] = useState(null);

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
        const roomName = localStorage.getItem('roomName');
        const userName = localStorage.getItem('userName');
        setRoom(roomName);
        setUserName(userName);
        
        socketRef.current = io(SERVER);
        console.log('[CLIENT] - connection req sent');
        
        socketRef.current.emit('join', {roomName: roomName, userName: userName});
        console.log('[CLIENT] - join req sent with room name ', roomName);

        // Listen for incoming messages
        socketRef.current.on('message', (data) => {
            setChat(prev => [...prev, data]);
        });

        // Cleanup on unmount
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        socketRef.current.on('connected', (data) => {
            console.log('on connnection ', data);
        })
    }, []);

    useEffect(() => {
        socketRef.current.on('joined', (data) => {
            console.log('[CLIENT] - joined room', data);
            setServerMSG(data);
        })
        return () => {
            socketRef.current.off("joined");
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

    let content = paramMsg || msg || image;

    // SAFEGUARD: Ensure we're not sending binary objects
    if (typeof content !== 'string') {
        console.warn('Message content is not a string:', content);
        return;
    }

    socketRef.current.emit('message', {
        userName,
        message: paramMsg || msg || image,
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
        data.append('cloud_name', 'dyiq1oyka');

        axios.post('https://api.cloudinary.com/v1_1/dyiq1oyka/image/upload', data)
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
            {serverMSG && localStorage.getItem('roomName') === serverMSG.roomName && (
                <div className="server-msg" style={{animation: 'slideDown 0.5s forwards'}}>
                    <span> {serverMSG.userName} joined room </span>
                    <span style={{opacity: 0}}>
                        {setTimeout(() => {
                            setServerMSG(null);
                        }, 2000)}
                    </span>
                </div>
            )}

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
                <p style={{color: 'yellow'}} className="online-count">{currOnline} online</p>
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
                    <button onClick={() => handleSend()}>
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
