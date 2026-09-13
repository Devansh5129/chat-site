import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import './Chat.css';

let socket;
const ENDPOINT = 'http://localhost:5000';

const Chat = () => {
  const { search } = useLocation();
  const name = new URLSearchParams(search).get('name');

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('join', { name });
    return () => socket.disconnect();
  }, [name]);

  useEffect(() => {
    socket.on('message', (msg) => setMessages((prev) => [...prev, msg]));
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;