import React from 'react';

const Ad = props => {
  return (
    <React.Fragment>{props.ad ? <img src={require('../assets/ad.svg')} className="image-of-ad"/> : ''}</React.Fragment>
  );
};

export default Ad;
