import axios from "axios";
import { useEffect, useState } from "react";
import './Gifs.css';

const Gifs = ({handleGifClick}) => {

    const [gifsList, setGifList] = useState([]);
    const gifURL = 'https://russmus.net/wp-content/uploads/2024/02/blowjob-gif-5.gif';

    useEffect(() => {

        for (let cnt = 1; cnt <= 50; cnt++) {
            const gifURL = `https://russmus.net/wp-content/uploads/2024/02/blowjob-gif-${cnt}.gif`;
            setGifList(prevState => [...prevState, gifURL]);
        }

    }, [])

    const handleClick = (gifURL) => {
        handleGifClick(gifURL);
    }

return (
    <div className="gif-container">
        <button 
            className="gif-close-btn" 
            onClick={() => handleClick('CLOSE')}
        >
            Close
        </button>
        
        {
            gifsList.map((gif, index) => (
                <img onClick={() => handleClick(gif)} key={index} src={gif} alt="" />
            ))
        }     
        
    </div>
);

}

export default Gifs;