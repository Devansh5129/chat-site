import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './Input.css';

const Input = ({ message, setMessage, sendMessage }) => {
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="inputContainer">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
      />
      <button onClick={() => setShowPicker((prev) => !prev)}>😀</button>
      {showPicker && (
        <div className="emojiPicker">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Input;