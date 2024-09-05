import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateGems } from '../../actions/gemActions'; 
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ toggleComponent }) => {
    const dispatch = useDispatch();

    const [isEmailInputFocused, setIsEmailInputFocused] = useState(false);
    const [isPasswordInputFocused, setIsPasswordInputFocused] = useState(false);
    const [emailInputValue, setEmailInputValue] = useState('');
    const [passwordInputValue, setPasswordInputValue] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleSignIn = () => {
        if (emailInputValue === '') {
            setEmailError('Must be filled');
        } else {
            setEmailError('');
        }
    
        if (passwordInputValue === '') {
            setPasswordError('Must be filled');
        } else {
            setPasswordError('');
        }
    
        if (emailInputValue !== '' && passwordInputValue !== '') {
            fetch('http://localhost/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: emailInputValue,
                    password: passwordInputValue
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    if (data.error === "Username doesn't exist") {
                        setEmailError("Username doesn't exist");
                        setPasswordError('');
                    } else if (data.error === 'Invalid credentials') {
                        setPasswordError('Invalid credentials');
                        setEmailError('');
                    } else {
                        // Handle other backend errors here
                        console.error('Backend error:', data.error);
                    }
                } else {
                    // Handle successful login here
                         localStorage.setItem('userID', data.user.id);
                         localStorage.setItem('username', data.user.name);
                         localStorage.setItem('authToken', data.token);
                         localStorage.setItem('gems', data.user.gems)
                         dispatch(updateGems(data.user.gems)); 
                         navigate("/home");
                }
            })
            .catch(error => {
                // Handle network errors here
                console.error('Network error:', error);
            });
        }
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
                    dispatch(updateGems(responseData.user.gems)); 
                    console.log(responseData); // Log the JSON response data
                    navigate("/Profile");
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    
    

    return (
        <div className="half">
            <div className='small-title'>JUMP BACK IN</div>
            <div className='title'>Sign In</div>
            <div className='sub-title'>
                Don't have an account? 
                <a className='accent-text' onClick={toggleComponent}>Register</a>
            </div>
            <div className="big-container">
                <input className='big-input' type="text" onFocus={() => setIsEmailInputFocused(true)} onBlur={() => setIsEmailInputFocused(emailInputValue !== '')} onChange={(event) => setEmailInputValue(event.target.value)} value={emailInputValue} autoComplete="username" />
                <div className={`input-text ${isEmailInputFocused ? 'focused-text' : ''}`}>Username</div>
                <img className='input-icon' src="/icons/user-solid.svg" alt="" />
                <p className='input-error'>{emailError}</p>
            </div>
            <div className="big-container">
                <input className='big-input' type="password" onFocus={() => setIsPasswordInputFocused(true)} onBlur={() => setIsPasswordInputFocused(passwordInputValue !== '')} onChange={(event) => setPasswordInputValue(event.target.value)} value={passwordInputValue} />
                <div className={`input-text ${isPasswordInputFocused ? 'focused-text' : ''}`}>Password</div>
                <img className='input-icon' src="/icons/key-solid.svg" alt="" />
                <p className='input-error'>{passwordError}</p>
            </div>
            <div className="action-buttons">
                <div className="google-button">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        theme='filled_black'
                    />                    
                </div>
                <button onClick={handleSignIn}>Sign in</button>
            </div>
        </div>
    );
};

export default Login;
