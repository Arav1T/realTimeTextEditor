import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const UsernamePrompt: React.FC = () => {
  const [input, setInput] = useState('');
  const { setUsername } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setUsername(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto text-white">
      <h1 className="text-xl mb-4">Enter your name to join</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 rounded w-full mb-2"
        placeholder="Your name"
      />
      <button
        type="submit"
        className="bg-transparent text-white shadow-lg shadow-green-100 rounded-2xl px-4 py-2 hover:bg-green-300"
      >
        Join
      </button>
    </form>
  );
};

export default UsernamePrompt;
