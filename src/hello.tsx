console.log("Hello from @workspace/scripts");
import React from 'react';
import * as ReactDOM from 'react-dom/client';

// 1. Add 'export' before function
export function App() {
  return (
    <div>
      <h1>Sports Shield is Live!</h1>
    </div>
  )
}

// 2. Add this at the very bottom to link to your HTML
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}