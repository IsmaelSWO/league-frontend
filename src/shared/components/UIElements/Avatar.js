import React from 'react';

import './Avatar.css';

const Avatar = props => {
  const img = `https://images.weserv.nl/?url=${props.image}`
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={img}
        alt={props.alt}
        referrerPolicy="no-referrer"
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default Avatar;
