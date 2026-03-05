import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Design system — order matters
import './styles/variables.css';
import './styles/animations.css';
import './styles/layout.css';
import './styles/dashboard.css';
import './styles/forms.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
