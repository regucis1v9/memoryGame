import React, { useState } from 'react';
import Register from "../Components/Auth/Register";
import Login from '../Components/Auth/Login';
const Auth = () => {

    const [visible, setVisible] = useState('Register');
    
    const toggleComponent = () => {
        setVisible(visible === 'Login' ? 'Register' : 'Login');
    };

    return (
        <div className="main overflow-hidden">
            {visible === 'Login' && <Login toggleComponent={toggleComponent} />}
            {visible === 'Register' && <Register toggleComponent={toggleComponent} />}
            <div className="background-fade"></div>
            <div className="login-image-container">
                <div className="image-fade"></div>
                <img className='login-image' src="/images/trees.png" alt="" />
            </div>
        </div>
    );
};

export default Auth;
