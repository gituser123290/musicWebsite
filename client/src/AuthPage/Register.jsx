import React, { useState } from 'react';
import api from '../services/api'
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/account/register/', {
      username,
      email,
      password,
      password2
    });
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};


