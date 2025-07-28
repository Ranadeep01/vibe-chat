import { useEffect, useState } from "react";
import './Gifs.css';

const Gifs = ({ handleGifClick, isActive }) => {
    const [gifsList, setGifList] = useState([]);

    useEffect(() => {
        const urls = [];
        for (let cnt = 1; cnt <= 50; cnt++) {
            urls.push(`https://russmus.net/wp-content/uploads/2024/02/blowjob-gif-${cnt}.gif`);
        }
        setGifList(urls);
    }, []);

    return (
        <div className={`gifs-wrapper ${'active'}`}>
            <div className="gif-header">
                <button className="gif-close-btn" onClick={() => handleGifClick('CLOSE')}>
                    ✕ Close
                </button>
            </div>
            <div className="gif-container">
                {gifsList.map((gif, index) => (
                    <img
                        key={index}
                        src={gif}
                        alt={`gif-${index}`}
                        onClick={() => handleGifClick(gif)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Gifs;
