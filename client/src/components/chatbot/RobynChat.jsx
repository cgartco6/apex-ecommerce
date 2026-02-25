import React, { useState } from 'react';
import { useSendMessageMutation } from '../../store/api/chatbotApi';

const RobynChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sendMessage] = useSendMessageMutation();

  const send = async () => {
    const userMsg = { text: input, sender: 'user' };
    setMessages([...messages, userMsg]);
    const res = await sendMessage({ message: input }).unwrap();
    setMessages(prev => [...prev, { text: res.reply, sender: 'robyn' }]);
    setInput('');
  };

  return (
    <div className="chatbot" style={{ position: 'fixed', bottom: 20, right: 20 }}>
      {open && (
        <div className="chat-window" style={{ background: 'white', border: '1px solid var(--primary)' }}>
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={m.sender}>{m.text}</div>
            ))}
          </div>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} />
        </div>
      )}
      <button className="btn-primary" onClick={() => setOpen(!open)}>💬 Robyn</button>
    </div>
  );
};
