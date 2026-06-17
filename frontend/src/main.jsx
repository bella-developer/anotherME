import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App.jsx';
import './index.css';
import { monitorWebVitals } from './utils/performance';

// Monitor Core Web Vitals in production
// Implements Requirements: 15.1, 15.2
if (process.env.NODE_ENV === 'production') {
  monitorWebVitals();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
