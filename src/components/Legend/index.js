import React from 'react';

const Legend = () => (
    <div>
        <p className="container">Details</p>
        <div className="border"></div>
        <section className="d-flex justify-content-between container row mx-auto">
            <div>
                <h4>CATEGORIES</h4>
            </div>
            <div>
                <h4>CALENDAR LEGEND</h4>
                <ul className="row flex-wrap">
                    <li className="col-sm-6 d-flex align-items-center">
                        <div className="red circle"></div>
                        <p className="mb-0">Notification</p>
                    </li>
                    <li className="col-sm-6  d-flex align-items-center">
                        <div className="orange circle"></div>
                        <p className="mb-0">Client unread</p>
                    </li>
                    <li className="col-sm-6  d-flex align-items-center">
                        <div className="green circle"></div>
                        <p className="mb-0">Approved</p>
                    </li>
                    <li className="col-sm-6  d-flex align-items-center">
                        <div className="hollow-orange circle"></div>
                        <p className="mb-0">Approved</p>
                    </li>
                    <li className="col-sm-6  d-flex align-items-center">
                        <img src={require('../assets/ad.svg')} />
                        <p className="mb-0">Ad</p>
                    </li>
                </ul>
            </div>
        </section>
    </div>
)

export default Legend;

