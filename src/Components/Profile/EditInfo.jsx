import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../actions/passwordAction';
import { useNavigate } from 'react-router-dom';
const EditInfo = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const passwordState = useSelector(state => state.password.password);
    const userID = localStorage.getItem("userID");
    const localUser = localStorage.getItem("username")
    const [inputPassword, setInputPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('Loading...');
    const [email, setEmail] = useState("Loading...");
    const [password, setPassword] = useState("Loading...");
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordEditError, setPasswordEditError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [newUsernameError, setNewUsernameError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [newPasswordConfirmError, setNewPasswordConfirmError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            if(localUser !== "" || localUser !== null){
            try {
                const response = await fetch('http://localhost/api/getUserByID', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: userID
                    })
                });
                const userData = await response.json();
                setUsername(userData.user.name);
                if(userData.user.name === null){
                    setUsername("")
                    // dispatch(updatePasswordState("ceating"))
                    localStorage.setItem("username", "")
                    localStorage.setItem("gems", 0)
                }
                setEmail(userData.user.email);
                setPassword(generateFakePassword(userData.user.password_length));
            } catch (error) {
                console.error('Error fetching user data:', error, userID);
            }
        }
        };

        if (userID) {
            fetchUser();
        }
    }, [userID]);

    const updatePasswordState = (passwordState) => {
        dispatch(updatePassword(passwordState));
    };

    const updateInfo = async () => {
        if (passwordEditError === "" && confirmPassword === password) {
            setConfirmPasswordError("")
            try {
                const response = await fetch('http://localhost/api/updateUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userID: userID,
                        name: username,
                        email: email,
                        password: password
                    })
                });
                const data = await response.json();
                console.log("Server response:", data); 
                if (data.error) {
                    setUsernameError(data.error.name || data.error);
                    setEmailError(data.error.email);
                    setPasswordEditError(data.error.password);
                } else if (data.message) {
                    updatePasswordState('locked');

                    setUsernameError('');
                    setEmailError('');
                    setPasswordEditError('');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            setConfirmPasswordError("Passwords don't match")
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost/api/checkPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: userID,
                    password: inputPassword
                })
            });
            const data = await response.json();
            if (data.message) {
                updatePasswordState('editing');
                setPasswordError('');
                setPassword(inputPassword);
                setInputPassword('');
            } else {
                setPasswordError("Invalid password");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== password) {
            setConfirmPasswordError("Passwords don't match");
        } else {
            setConfirmPasswordError('');
        }
    };

    const generateFakePassword = (length) => {
        return Array.from({ length }, () => 'x').join('');
    };
    const updateUser = async () => {
        setNewUsernameError("");
        setNewPasswordError("");
        setNewPasswordConfirmError("");
    
        let isValid = true;
    
        if (newUsername === "") {
            setNewUsernameError("Username must be filled");
            isValid = false;
        }
    
        if (newPassword === "") {
            setNewPasswordError("Password must be filled");
            isValid = false;
        }
    
        if (newPasswordConfirm === "") {
            setNewPasswordConfirmError("Confirmation must be filled");
            isValid = false;
        }
    
        if (newPassword !== newPasswordConfirm) {
            setNewPasswordConfirmError("Passwords don't match");
            isValid = false;
        }
        console.log(newUsername, newPassword)
        if (isValid) {
            try {

                const response = await fetch('http://localhost/api/setUserPass', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userID: userID,
                        name: newUsername,
                        password: newPassword
                    })
                });
                const data = await response.json();
                console.log(data);
                if(data.error.password){
                    setNewPasswordConfirmError(data.error.password)
                }
                if(data.error.name){
                    setNewUsernameError(data.error.name)
                }
                if(data.message){
                    setUsername(newUsername)
                    setPassword(newPassword)
                }
            } catch (error) {
                console.error('Error updating user:', error);
                localStorage.setItem("username", newUsername)
                setUsername(newUsername);
                navigate("/profile")
                let length = newPassword.length
                console.log(length)
                setPassword(generateFakePassword(length))
            }
        }
    };
    
    return (
        <div className="profile-container">
            {passwordState === 'verfying' &&
                <div className="overlay">
                    <div className="password-box">
                        <div className="password-box-title">Enter your password</div>
                        <span>
                            <input type="password" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} />
                            <p className='input-error'>{passwordError}</p>
                        </span>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            }
            {localUser === "" &&
                <div className="overlay">
                    <div className="password-box">
                            <div className="password-box-title">Create your username</div>
                            <span>
                                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                                <p className='input-error'>{newUsernameError}</p>
                            </span>
                            <div className="password-box-title">Create your password</div>
                            <span>
                                <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                <p className='input-error'>{newPasswordError}</p>
                            </span>
                            <div className="password-box-title">Confirm your password</div>
                            <span>
                                <input type="text" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} />
                                <p className='input-error'>{newPasswordConfirmError}</p>
                            </span>
                            <button onClick={updateUser}>Submit</button>
                            
                        </div>
                </div>
            }
            <span>
                <span>
                    Username
                    <input type='text' placeholder={username} className={passwordState === 'editing' ? 'active-edit' : ''} disabled={passwordState !== 'editing'} value={username} onChange={(e) => setUsername(e.target.value)} />
                    <p className='input-error'>{usernameError}</p>
                </span>
                <span className="edit-input">
                    Email
                    <input type='email' placeholder={email} className={passwordState === 'editing' ? 'active-edit' : ''} disabled={passwordState !== 'editing'} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <p className='input-error'>{emailError}</p>
                </span>
                <span className="edit-input">
                    Password
                    <input type={passwordState === 'editing' ? 'text' : 'password'} value={password} className={passwordState === 'editing' ? 'active-edit' : ''} disabled={passwordState !== 'editing'} onChange={(e) => setPassword(e.target.value)} />
                    <p className='input-error'>{passwordEditError}</p>
                </span>
                {passwordState === "editing" &&
                    <span className="edit-input">
                        Confirm Password
                        <input type={passwordState === 'editing' ? 'text' : 'password'} value={confirmPassword} className={passwordState === 'editing' ? 'active-edit' : ''} disabled={passwordState !== 'editing'} onChange={handleConfirmPasswordChange} />
                        <p className='input-error'>{confirmPasswordError}</p>
                    </span>}
            </span>
            {passwordState !== "editing" && <button onClick={() => updatePasswordState('verfying')}>Edit info</button>}
            {passwordState === "editing" && <button onClick={updateInfo}>Save info</button>}
        </div>
    );
};

export default EditInfo;
