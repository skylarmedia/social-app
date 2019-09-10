import React from 'react';
import './index.css';

const MainButton = ({title, subtitle, buttonText, confirmArchive}) => {
    return(
        <div className="black-bg">
            <div className="inner-btn">
                <h6>{title}</h6>
                <p>{subtitle}</p>
                <div>
                    <button value={false} onClick={confirmArchive}>
                        Cancel
                    </button>
                    <button value={true} onClick={confirmArchive}>
                        {buttonText}
                    </button>
                </div>
            </div>
            
        </div>
    )
}

export default MainButton;