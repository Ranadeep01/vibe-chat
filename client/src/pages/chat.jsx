import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import io from 'socket.io-client';
import axios from "axios";
import uploadImg from '../assests/image-upload-icon.svg';
import sendLogo from '../assests/send.svg';
import ImageModel from "../components/imageModel";
import { useLocation } from "react-router-dom";
import Gifs from "../components/Gifs";
import { useNavigate } from "react-router-dom";
import gifIcon from '../assests/gif-icon.png';

const Chat = () => {
    // const SERVER = 'http://localhost:5000';
    const SERVER = 'https://vibe-chat-1wmu.onrender.com';

    const socketRef = useRef();
    const chatContainerRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();

    const [msg, setMsg] = useState('');
    const [room, setRoom] = useState('');
    const [chat, setChat] = useState([]);
    const [image, setImage] = useState('');
    const [userName, setUserName] = useState('');
    const [isimageDialogOpen, setIsimageDialogOpen] = useState(false);
    const [isGifsSectionActivate, setIsGifsSectionActivate] = useState(false);

    useEffect(() => {
        const userName = localStorage.getItem('userName');
        const room = localStorage.getItem('roomName');
        
        if(userName === null || room === null) {
            navigate('/');
        }

        setUserName(localStorage.getItem('userName'));
        setRoom(localStorage.getItem('roomName'));

        
        socketRef.current = io(SERVER);
        
        socketRef.current.on('message', (data) => {            
            setChat(prev => [...prev, data]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleGifClick = (gif) => {
        setIsGifsSectionActivate(false);
        if(gif !== 'CLOSE') {
            handleSend(gif);
        } 
    }

    useEffect(() => {
        socketRef.current.on('member_added', (data) => {
            alert(data)
        })
    }, []);

    // Scroll to the bottom when a new message is added
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [chat]);

    const handleSend = (paramMsg = '') => {        
        setImage('');
        if (room === '') return;
        console.log('msg send to server', msg);
        
        socketRef.current.emit('message', {
            userName: userName,
            message: paramMsg || msg || image,
            roomName: room
        });
        setMsg('');
    }

    const handleJoin = () => {
        if (room === '') return;
        socketRef.current.emit('join', room);        
    }

    const handleFileUpload = (e) => {
        setIsimageDialogOpen(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'ranadeep_demo');
        data.append('cloud_name', 'dhk5v8qpf')
        axios.post('https://api.cloudinary.com/v1_1/dhk5v8qpf/image/upload', data).then((res) => {
            setImage(res?.data?.secure_url);
        })
    }

    const handleImageActions = (action) => {
        switch (action) {
            case 'SEND':
                handleSend();
                break;
            
            case 'CANCEL':
                setImage('')
                break;
        
            default:
                break;
        }        
    }

    const handleGifs = () => {
        setIsGifsSectionActivate(true);
    }

    return (
        <div className="container">
            <div className="room-input-container">
                <input
                    type="text"
                    className="room-input"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    onKeyDown={
                        (e) => {
                            if (e.key === 'Enter') {
                                handleJoin();
                            }
                        }
                    }
                />
                <button onClick={handleJoin}>Join</button>
            </div>
            <div className="chat-container" ref={chatContainerRef}> {/* Add ref to the chat container */}
                {
                    chat.map((item, idx) => (
                        <div className="chat" key={idx}>
                            <p className="message-user">{item.userName}</p>
                            {
                                item.message.includes('dhk5v8qpf') || item.message.includes('russmus') ? (
                                    <img src={item.message} alt="" className="message-img message-content" />
                                ) :
                                (
                                    <p className="message-content">{item.message}</p>
                                )
                            }
                        </div>
                    ))
                }
            </div>
            <div className="input-container">

                <input
                    className="chat-input"
                    type="text"
                    placeholder="Type your message here"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={
                        (e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }
                    }
                />
                                <input
                    type="file" 
                    id="file"
                    onChange={(e) => handleFileUpload(e)}
                />
                <label 
                    className="file-input"
                    htmlFor="file">
                    <img src={uploadImg} alt="" />
                </label>
                {/* <button onClick={() => handleGifs()}> */}
                    <img src={gifIcon} alt="" onClick={() => handleGifs()} style={{width: '30px'}} />
                {/* </button> */}
                <span>
                    <button onClick={() => handleSend()}>
                        <img src={sendLogo} alt="" />
                    </button>
                </span>
            </div>

            {
                image && (
                    <ImageModel image={image} handleImageActions={handleImageActions} />
                )
            }

            {
                isGifsSectionActivate && (
                    <div className="gifs-section">
                        <Gifs handleGifClick={handleGifClick} />
                    </div>
                )
            }

        </div>
    );
};

export default Chat;
