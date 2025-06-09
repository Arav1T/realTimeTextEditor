import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const Login: React.FC = () => {
  const { username, setUsername } = useUser();
  const [input, setInput] = useState('');

  if (username) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) setUsername(input.trim());
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#1a252f] via-[#34495e] to-[#0d7d49] text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md w-80">
        <h1 className="text-2xl mb-4 font-bold text-center">Enter Username</h1>
        <input
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-4 focus:outline-none"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Username"
          required
        />
        <button className=" bg-transparent border-0 rounded-3xl shadow-2xl shadow-green-500 hover:bg-green-400 px-9 py-3 font-semibold text-center" type="submit">
          Join
        </button>
      </form>
    </div>
  );
};

export default Login;
