import React, { useRef, useEffect } from 'react';
import Message from '../Message/Message';
import './Messages.css';

const Messages = ({ messages, name }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="messages">
      {messages.map((msg, i) => (
        <Message key={i} message={msg} name={name} />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default Messages;