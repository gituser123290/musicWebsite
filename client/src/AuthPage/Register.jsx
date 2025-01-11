import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  // const[loading,setLoading]=useState(true)
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if(password !== password2){
      setError('Password does not match');
      return;
    }
    // setLoading(true);
    try {
      const response = await api.post('/account/register/', {username,email,password,password2})

      const {token}=response.data;
      if(token){
        sessionStorage.setItem('token',token)
        console.log(token);
        navigate('/login'); 
      }else {
        setError('Registration successful, but no token returned');
      }
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  // if(loading) return <p>Loading...</p>

  return (
    <div className='flex justify-center flex-col ml-96 mt-2 m-10 p-4 w-1/3 h-auto bg-gray-400 rounded-md'>
      <form onSubmit={handleRegister} className='flex flex-col m-2 w-full justify-center align-middle'>
        <h2 className='text-center text-2xl text-white font-extrabold'>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='bg-zinc-600 px-2 py-2 m-3 rounded-lg'
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='bg-zinc-600 px-2 py-2 m-3 rounded-lg'
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='bg-zinc-600 px-2 py-2 m-3 rounded-lg'
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className='bg-zinc-600 px-2 py-2 m-3 rounded-lg'
        />
        <button className='px-2 py-2 bg-green-400 w-20 ml-64 rounded-md hover:bg-green-900 m-2' type="submit">Register</button>
        <p className='text-center text-xl'>
          Don't have an account yet. Please{' '}
          <a className='px-1 py-1 rounded-md underline hover:uppercase text-black' href="/login">Login</a>
        </p>
        {error && <p>{error}</p>}
      </form>
    </div>

  );
};

export default Register;
