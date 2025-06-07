import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundry';
import { ThemeProvider } from './ThemeContext';
import { PlayerProvider } from './context/PlayerContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <PlayerProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PlayerProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
