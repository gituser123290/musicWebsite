import React, { useState } from 'react';
import {apiUrl} from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ loggedInUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl+'/account/login/', { username, password });
      const token = response.data.token;
      sessionStorage.setItem('token', token);
      loggedInUser(true); 
      navigate('/'); 
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='flex justify-center flex-col ml-96 m-12 p-4 w-1/3 h-auto bg-gray-400 rounded-md'>

      <form onSubmit={handleLogin} className='flex flex-col m-2 w-full justify-center align-middle'>
        <h2 className='text-center text-2xl text-white font-extrabold'>Login</h2>
        
        <input
          className='bg-zinc-300 px-2 py-2 m-4 rounded-lg text-black'
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <input
          className='bg-zinc-300 px-2 py-2 m-4 rounded-lg'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button className='px-2 py-2 bg-green-400 w-20 ml-64 rounded-md hover:bg-green-900' type="submit">Login</button>

        {error && <p className='text-xl text-fuchsia-400' >{error}</p>}
      </form>
      <p className='text-center text-xl'>
        Don't have an account yet. Please{' '}
        <a className='px-1 py-1 underline hover:uppercase rounded-md text-black' href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
