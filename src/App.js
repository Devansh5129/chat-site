import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
const EMOJIS = ['😀', '😂', '❤️', '👍', '🎉', '😎', '🙏', '😢'];

export default function App() {
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const socket = useRef(null);
  const bottom = useRef(null);

  useEffect(() => {
    if (!user) return undefined;
    const connection = io(SERVER_URL);
    socket.current = connection;
    connection.emit('join', { name: user });
    connection.on('message', (message) => setMessages((items) => [...items, message]));
    connection.on('chatError', (message) => {
      setError(message);
      setUser('');
    });
    return () => { connection.disconnect(); };
  }, [user]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (event) => {
    event?.preventDefault();
    const cleanText = text.trim();
    if (!cleanText) return;
    socket.current.emit('sendMessage', cleanText);
    setText('');
    setShowEmojis(false);
  };

  if (!user) {
    return <main className="auth"><form onSubmit={(e) => { e.preventDefault(); if (name.trim()) { setError(''); setUser(name.trim()); } }}>
      <span className="brand">simple chat</span><h1>Welcome back</h1><p>Choose a name to start chatting.</p>
      <input autoFocus maxLength="30" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      {error && <p className="error">{error}</p>}
      <button type="submit">Enter chat</button>
    </form></main>;
  }

  return <main className="page"><section className="chat">
    <header><div><span className="dot" /> <strong>Live chat</strong><small>Up to two people can chat here</small></div><button className="logout" onClick={() => setUser('')}>Leave</button></header>
    <div className="messages">
      {messages.length === 0 && <p className="empty">Say hello to start the conversation.</p>}
      {messages.map((message, index) => message.user === 'system' ? <p className="notice" key={index}>{message.text}</p> : <article className={message.user === user ? 'message mine' : 'message'} key={index}><small>{message.user === user ? 'You' : message.user}</small><p>{message.text}</p></article>)}
      <div ref={bottom} />
    </div>
    <form className="composer" onSubmit={send}>
      <div className="emoji-wrap"><button className="emoji-button" type="button" aria-label="Add emoji" onClick={() => setShowEmojis(!showEmojis)}>😊</button>{showEmojis && <div className="emoji-tray">{EMOJIS.map((emoji) => <button type="button" key={emoji} onClick={() => setText((value) => value + emoji)}>{emoji}</button>)}</div>}</div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message…" maxLength="500" />
      <button className="send" type="submit">Send</button>
    </form>
  </section></main>;
}
