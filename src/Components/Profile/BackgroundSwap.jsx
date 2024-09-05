import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateBackground } from '../../actions/backgroundAction';

const BackgroundSwap = () => {
    const dispatch = useDispatch();
    const [selectedBackground, setSelectedBackground] = useState(localStorage.getItem('background') || '');

    useEffect(() => {
        localStorage.setItem('background', selectedBackground);
    }, [selectedBackground]);

    const changeBackground = (background) => {
        setSelectedBackground(background);
        dispatch(updateBackground(background));
    }

    return (
        <div className="background-container">
            <button onClick={() => changeBackground('Dots')} className={selectedBackground === 'Dots' ? "active-border" : ""}>
                Dots
                <img src="/images/dots.png" alt="" />
            </button>
            <button onClick={() => changeBackground('Halo')} className={selectedBackground === 'Halo' ? "active-border" : ""}>
                Halo
                <img src="/images/halo.png" alt="" />
            </button>
            <button onClick={() => changeBackground('Trunk')} className={selectedBackground === 'Trunk' ? "active-border" : ""}>
                Trunk
                <img src="/images/image.png" alt="" />
            </button>
            <button onClick={() => changeBackground('Waves')} className={selectedBackground === 'Waves' ? "active-border" : ""}>
                Waves
                <img src="/images/waves.png" alt="" />
            </button>
        </div>
    );
};

export default BackgroundSwap;
