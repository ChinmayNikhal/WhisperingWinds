import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App.jsx'; // Correctly import the main component

// Select the root element from index.html and render the App component inside it.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);