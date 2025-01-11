import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Footer from './layouts/Footer';
import ErrorBoundary from './ErrorBoundry';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
    <App />
    </ErrorBoundary>
    <Footer/>
  </React.StrictMode>
);
