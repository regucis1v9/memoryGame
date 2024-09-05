import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateGems } from '../../actions/gemActions'; 
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';

const Register = ({ toggleComponent }) => {
    const dispatch = useDispatch();

    const [isNameInputFocused, setIsNameInputFocused] = useState(false);
    const [isAgeInputFocused, setIsAgeInputFocused] = useState(false);
    const [isEmailInputFocused, setIsEmailInputFocused] = useState(false);
    const [isPasswordInputFocused, setIsPasswordInputFocused] = useState(false);
    const [email, setEmailInputValue] = useState('');
    const [password, setPasswordInputValue] = useState('');
    const [name, setName] = useState('');
    const [age, setAgeInputValue] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [ageErrorr, setAgeError] = useState('');
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault()
        let errors = false;

        if (email === "") {
            setEmailError('Must be filled')
            errors = true;
        } else {
            setEmailError("")
        }
        if (name === "") {
            setUsernameError('Must be filled')
            errors = true;
        } else {
            setUsernameError("")
        }
        if (age === "") {
            setAgeError('Must be filled')
            errors = true;
        } else if (age < 1) {
            setAgeError("Age can't be lower than 1")
            errors = true;
        } else {
            setAgeError("");
        }
        if (password === "") {
            setPasswordError('Must be filled')
            errors = true;
        } else {
            setPasswordError("")
        }

        if (!errors) {
            try {
                const response = await fetch('http://localhost/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, password, email }),
                });
                const jsonResponse = await response.json();
                console.log(jsonResponse)
                if (!jsonResponse.error) {
                    fetch('http://localhost/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: name,
                            password: password
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            if (data.error === "Username doesn't exist") {
                                setEmailError("Username doesn't exist");
                                setPasswordError('');
                            }
                             if (data.error === 'Invalid credentials') {
                                setPasswordError('Invalid credentials');
                                setEmailError('');
                            } else {
                                // Handle other backend errors here
                                console.error('Backend error:', data.error);
                            }
                        } else {
                                 // Set userID and username in localStorage
                                 localStorage.setItem('userID', data.user.id);
                                 localStorage.setItem('username', data.user.name);
                                 localStorage.setItem('authToken', data.token);
                                 localStorage.setItem('gems', data.user.gems)
                                 dispatch(updateGems(data.user.gems)); 
                                 // Redirect to home page
                                //  navigate("/profile");
                        }
                    })
                } else {
                    if(jsonResponse.error.name){
                        setUsernameError("Username is already taken")
                    }
                    if(jsonResponse.error.email){
                        setEmailError("Email is already taken")
                    }
                    if(jsonResponse.error.password){
                        setPasswordError(jsonResponse.error.password)
                    }
                }
            } catch (error) {
                console.error('Error occurred during registration:', error);
            }
        }
    };

    const handleInputFocus = (setState) => {
        setState(true);
    };

    const handleInputChange = (event, setState, setValue) => {
        setValue(event.target.value);
        setState(event.target.value !== '');
    };

    const handleInputBlur = (state, setState, value) => {
        setState(value !== '');
    };

    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }
    const handleError = (error) => {
        console.error('Google Login Error:', error);
    };

    const handleSuccess = async (response) => {
        // console.log('Google Access Token:', response);
        const { credential } = response;
        const jwtData = parseJwt(credential);
        if (jwtData.email && jwtData.name) {
            try {
                const response = await fetch('http://localhost/api/googleLogin', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        jwtData
                    }),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    console.error('Error:', responseData.error);
                } else {
                    localStorage.setItem('userID', responseData.user.id);
                    if(responseData.user.name === ""){
                        responseData.user.name = "";
                    }
                    localStorage.setItem('username', responseData.user.name);
                    localStorage.setItem('authToken', responseData.token);
                    if(responseData.user.gems === ""){
                        responseData.user.gems = 0;
                    }
                    localStorage.setItem('gems', responseData.user.gems);
                    console.log(responseData)
                    navigate("/Profile");
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <form className="half">
            <div className='small-title'>START FOR FREE</div>
            <div className='title'>Create new Account</div>
            <div className='sub-title'>
                Already A Member? 
                <a className='accent-text' onClick={toggleComponent} >Sign in</a>
            </div>
            <span className='input-span'>
                <div className="small-container-1">
                    <input 
                        className='small-input' 
                        type="text" 
                        value={name} 
                        onChange={(event) => setName(event.target.value)} 
                        onFocus={() => handleInputFocus(setIsNameInputFocused)} 
                        onBlur={() => handleInputBlur(isNameInputFocused, setIsNameInputFocused, name)} 
                    />
                    <div className={`input-text ${isNameInputFocused ? 'focused-text' : ''}`}>Username</div>
                    <img className='input-icon' src="/icons/user-solid.svg" alt="" />
                    <p className='input-error' >{usernameError}</p>
                </div>
                <div className="small-container-2">
                    <input 
                        className='small-input' 
                        type="number" 
                        min="1" 
                        value={age} 
                        onChange={(event) => setAgeInputValue(Math.floor(event.target.value))} 
                        onFocus={() => handleInputFocus(setIsAgeInputFocused)} 
                        onBlur={() => handleInputBlur(isAgeInputFocused, setIsAgeInputFocused, age)} 
                    />
                    <div className={`input-text ${isAgeInputFocused ? 'focused-text' : ''}`}>Age</div>
                    <img className='input-icon' src="/icons/calendar-solid.svg" alt="" />
                    <p className='input-error' >{ageErrorr}</p>
                </div>
            </span>
            <div className="big-container">
                <input 
                    className='big-input' 
                    type="text" 
                    value={email} 
                    onChange={(event) => setEmailInputValue(event.target.value)} 
                    onFocus={() => setIsEmailInputFocused(true)} 
                    onBlur={() => setIsEmailInputFocused(email !== '')} 
                />
                <div className={`input-text ${isEmailInputFocused ? 'focused-text' : ''}`}>Email</div>
                <img className='input-icon' src="/icons/envelope-solid.svg" alt="" />
                <p className='input-error' >{emailError}</p>
            </div>
            <div className="big-container">
                <input 
                    className='big-input' 
                    type="password" 
                    value={password} 
                    onChange={(event) => setPasswordInputValue(event.target.value)} 
                    onFocus={() => setIsPasswordInputFocused(true)} 
                    onBlur={() => setIsPasswordInputFocused(password !== '')} 
                    autoComplete="current-password"
                />
                <div className={`input-text ${isPasswordInputFocused ? 'focused-text' : ''}`}>Password</div>
                <img className='input-icon' src="/icons/key-solid.svg" alt="" />
                <p className='input-error' >{passwordError}</p>
            </div>
            <div className="action-buttons">
                <div className="google-button">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        theme='filled_black'
                    />
                </div>
                <button onClick={login} >Create account</button>
            </div>
        </form>
    );
};

export default Register;
