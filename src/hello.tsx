import React from 'react';
import { createRoot } from 'react-dom/client';

export function App() {
  return (
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      color: 'cyan', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1>Sports Shield is Live!</h1>
      <p>Deployment Successful</p>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}