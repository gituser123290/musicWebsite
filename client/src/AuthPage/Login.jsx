import React, { useState } from 'react';
import { apiUrl } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/custom.css';
import axios from 'axios';
// import Loading from '../layouts/Loading';

const Login = ({ loggedInUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl + '/account/login/', { username, password });
      const token = response.data.token;
      sessionStorage.setItem('token', token);
      loggedInUser(true);
      navigate('/');
    } catch (error) {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  // if(loading) return <div className="loading"><Loading/></div>;

  return (
    <div className="flex justify-center flex-col m-4 login bg-gray-400 rounded-lg shadow-lg">
  <form onSubmit={handleLogin} className="flex flex-col w-full space-y-6">
    <h2 className="text-center text-3xl sm:text-2xl md:text-xl lg:text-lg xl:text-xl text-white font-extrabold mb-4 sm:mb-6 md:mb-8 lg:mb-10">Login</h2>
    
    <input
      className="bg-zinc-300 px-4 py-3 m-4 rounded-lg text-black w-full sm:w-4/6 md:w-3/5 lg:w-2/3 xl:w-1/2 mx-auto focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 sm:mb-6 md:mb-8 lg:mb-10"
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    
    <input
      className="bg-zinc-300 px-4 py-3 rounded-lg w-full sm:w-4/6 md:w-3/5 lg:w-2/3 xl:w-1/2 mx-auto focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 sm:mb-6 md:mb-8 lg:mb-10"
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    
    <button 
      className="px-6 py-3 bg-green-400 text-white btn_login w-full sm:w-4/6 md:w-3/5 lg:w-2/3 xl:w-1/2 lg:ml-32 mx-auto rounded-md hover:bg-green-600 transition-colors mb-6 sm:mb-8 md:mb-10 md:ml-24 lg:mb-12"
      type="submit"
      disabled={loading}
      >
      {loading ? "Logging..." : "Login"}
    </button>

    {error && <p className="text-xl text-red-600 text-center mt-2 sm:mt-4 md:mt-6 lg:mt-8">{error}</p>}
  </form>

  <p className="text-center text-lg sm:text-xl md:text-lg lg:text-xl mt-4 sm:mt-6 md:mt-8 lg:mt-10">
    Don't have an account yet? Please{' '}
    <a className="px-1 py-1 underline hover:uppercase rounded-md text-black" href="/register">Register</a>
  </p>
</div>


  );
};

export default Login;
