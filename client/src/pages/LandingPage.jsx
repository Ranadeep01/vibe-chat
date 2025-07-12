import { useEffect, useState } from "react";
import othersSign  from '../assests/other-sign.svg';
import maleSign from '../assests/male-sign.svg';
import femaleSign from '../assests/female-sign.svg';
import './LandingPage.css';
import { useNavigate } from "react-router-dom";
import bgImg1 from '../assests/landing-page-bg-1.jpg';

const LandingPage = () => {
    
    const bgImages = [bgImg1];
    
    const chooseRandomBgImage = () => {
        const randomIndex = Math.floor(Math.random() * bgImages.length);
        return (bgImages[0]);
    }

    const [userForm, setUserForm] = useState({
        userName: '',
        gender: '',
        age: '',
        roomName: '',
    });
    const [bgImage, setBgImage] = useState('');

    useEffect(() => {
    setBgImage(chooseRandomBgImage());
    }, []);


    const navigate = useNavigate();

    const handleUserForm = (e) => {
        setUserForm({...userForm, [e.target.name]: e.target.value});
    }

    const handleSubmit = () => {
        if(userForm.userName === '') {
            alert('Please Enter User Name');
            return;  
        } 
        if(userForm.roomName === '') {
            alert('Please Enter Room Name');
            return;
        }
        localStorage.setItem('userForm', JSON.stringify(userForm));
        navigate(`/chat/${userForm.userName}/${userForm.roomName}`);
        setUserForm({userName: '', gender: '', age: ''});
    }

    return (
        
        <div className="landing-container" style={{backgroundImage: `url(${bgImage}), width: 100%, height: 100%`}} >
        <input
            type="text"
            name="userName"
            placeholder="Enter User Name"
            className="landing-input"
            value={userForm.userName}
            onChange={handleUserForm}
            autoComplete="off"
            onKeyUp={(e) => {
            if (e.key === 'Enter') {
                handleSubmit();
            }
            }}
        />
        <input type="text" name="age" placeholder="Enter Age" value={userForm.age} className="landing-input" onChange={(e) => handleUserForm(e)} />
        <input type="text" name="roomName" placeholder="Enter Room Name" value={userForm.roomName} className="landing-input" onChange={(e) => handleUserForm(e)} />
        <div className="gender-buttons">
            <button onClick={() => setUserForm({ ...userForm, gender: 'MALE' })}>
                <img src={maleSign} alt="Male" />
            </button>
            <button onClick={() => setUserForm({ ...userForm, gender: 'FEMALE' })}>
                <img src={femaleSign} alt="Female" />
            </button>
            <button onClick={() => setUserForm({ ...userForm, gender: 'OTHER' })}>
                <img src={othersSign} alt="Other" />
            </button>
        </div>
        <button onClick={handleSubmit} className="submit-button">
            Enter Room
        </button>
        </div>

    );
}

export default LandingPage;