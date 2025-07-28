import React, { use, useEffect, useRef, useState } from "react";
import "./chat.css";
import io from 'socket.io-client';
import axios from "axios";
import uploadImg from '../assests/image-upload-icon.svg';
import sendLogo from '../assests/send.svg';
import ImageModel from "../components/imageModel";
import { useLocation } from "react-router-dom";

const Chat = () => {
    
    const socketRef = useRef();
    const location = useLocation();

    const [msg, setMsg] = useState('');
    const [room, setRoom] = useState('');
    const [chat, setChat] = useState([]);
    const [image, setImage] = useState('');
    const [userName, setUserName] = useState('');
    const [isimageDialogOpen, setIsimageDialogOpen] = useState(false);

    useEffect(() => {

        const url = location.pathname.split('/');

        setRoom(url[3]);
        setUserName(url[2]);
        
        socketRef.current = io('http://localhost:5000');
        socketRef.current = io('https://vibe-chat-1wmu.onrender.com');

        socketRef.current.on('message', (data) => {
            console.log('Received:', data);
            setChat(prev => [...prev, data]);
        });

        return () => socketRef.current.disconnect();
    }, []);

    const handleSend = () => {
        if(room === '') return;
        socketRef.current.emit('message', {
            userName: userName,
            message: msg,
            roomName: room
        });
        setMsg('');
    }

    const handleJoin = () => {
        if(room === '') return;
        console.log('joined', room);
        socketRef.current.emit('join', room);
        console.log('join request sent');
        
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
            console.log(res);
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
                            if(e.key === 'Enter') {
                                handleJoin();
                            }
                        }
                    }
                />
                <button onClick={handleJoin}>Join</button>
            </div>
            <div className="chat-container">
                {
                    chat.map((item, idx) => (
                        <div className="chat" key={idx}>
                            <p className="message-user">{item.userName}</p>
                            {
                                item.message.includes('dhk5v8qpf') ? (
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
                    type="file" 
                    id="file"
                    onChange={(e) => handleFileUpload(e)}
                />
                <label 
                    className="file-input"
                    htmlFor="file">
                    <img src={uploadImg} alt="" />
                </label>
                <input
                    className="chat-input"
                    type="text"
                    placeholder="Type your message here"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={
                        (e) => {
                            if(e.key === 'Enter') {
                                handleSend();
                            }
                        }
                    }
                />
                <span>
                    <button onClick={handleSend}>
                        <img src={sendLogo} alt="" />
                    </button>
                </span>
            </div>

            {
                image && (
                    <ImageModel image={image} handleImageActions={handleImageActions} />
                )
            }

        </div>
    );
};

export default Chat;
