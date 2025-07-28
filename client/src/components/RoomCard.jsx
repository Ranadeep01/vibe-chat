import './RoomCard.css';
import { useNavigate } from "react-router-dom";

const RoomCard = ({roomData}) => {

    const randomNumber = Math.floor(Math.random() * 100);
    const navigate = useNavigate();
    
    const handleJoin = (roomName) => {
        localStorage.setItem('roomName', roomName);
        console.log('roomname is ', roomName);
        navigate(`/chat`);
    }

    return (
        <div className="room-card">
            <div className="room-card-header">
                <span className="room-card-title">
                    {roomData.name}
                </span>
                <span className="room-card-creator">
                    {roomData.emoji}
                </span>
            </div>
            <div className="room-card-body">
                <span className="room-card-count">
                    {randomNumber} people joined till now
                </span>
                <span className="btn" onClick={() => handleJoin(roomData.name)}>
                    Join
                </span>
            </div>
        </div>
    )
}

export default RoomCard;