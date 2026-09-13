import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!name.trim()) return;
    navigate(`/chat?name=${name}`);
  };

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1>Join</h1>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <button onClick={handleJoin}>Sign In</button>
      </div>
    </div>
  );
};

export default Join;