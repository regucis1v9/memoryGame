// DiffSelector.js
import React from 'react';

const GridSelector = ({ onSelectedGrid }) => {
    return (
        <>
        <div className="diff-selection-title" >Select a grid</div>
        <div className="selector-container">
            <button className="diff-selector center" onClick={() => onSelectedGrid('3x3')}>
                <div className="animated-border"></div>
                <div className="animated-border-2"></div>
                <div className="box center">
                    <img src="/svg/3grid.svg" alt="" />
                    <div className="center">3x3</div>
                </div>
            </button>
            <button className="diff-selector center" onClick={() => onSelectedGrid('5x5')}>
                <div className="animated-border"></div>
                <div className="animated-border-2"></div>
                <div className="box center">
                    <img src="/svg/5grid.svg" alt="" />
                    <div className="center">5x5</div>
                </div>
            </button>
            <button className="diff-selector center" onClick={() => onSelectedGrid('7x7')}>
                <div className="animated-border"></div>
                <div className="animated-border-2"></div>
                <div className="box center">
                    <img src="/svg/7grid.svg" alt="" />
                    <div className="center">7x7</div>
                </div>
            </button>
        </div>
        </>
    );
};

export default GridSelector;
