import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Navbar/>
    <App />
    <Footer/>
  </React.StrictMode>
);
