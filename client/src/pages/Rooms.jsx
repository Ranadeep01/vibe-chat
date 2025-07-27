import { useEffect } from "react";
import RoomCard from "../components/RoomCard";
import './Rooms.css';

const Rooms = () => {
    
    const rooms = [
        {
            name: 'Telugu',
            emoji: '🔥'
        },
        {
            name: 'Hot Talks',
            emoji: '😈'
        },
        {
            name: 'Spicy Chat',
            emoji: '🌶️'
        },
        {
            name: 'After Dark',
            emoji: '🌙'
        },
        {
            name: 'Flirty Vibes',
            emoji: '💋'
        },
        {
            name: 'Lounge X',
            emoji: '🥵'
        },
        {
            name: 'Late Night',
            emoji: '🖤'
        },
        {
            name: 'Secret Room',
            emoji: '🔒'
        },
        {
            name: 'Romance Zone',
            emoji: '💘'
        }
    ];

    return (
        <div>
            <div className="rooms-list">
                {
                    rooms.map(room => <RoomCard roomData={room} />)
                }
            </div>
        </div>
    )
}

export default Rooms;