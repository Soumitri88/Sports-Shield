import React, { useState, useEffect } from 'react';

// A reusable Card component for those stats
const StatCard = ({ title, value, color }: { title: string, value: string, color: string }) => (
  <div style={{
    backgroundColor: '#000044', // Darker navy for cards
    padding: '20px',
    borderRadius: '12px',
   border: `1px solid ${color}`,
    minWidth: '200px',
    margin: '10px'
  }}>
    <h3 style={{ fontSize: '14px', color: '#ccc' }}>{title}</h3>
    <h2 style={{ fontSize: '28px', color: color }}>{value}</h2>
  </div>
);

export function App() {
  const [violations, setViolations] = useState(342);

  // Example: Make it "Dynamic" by updating a number every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setViolations(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', backgroundColor: '#000033', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* 1. Simple Sidebar */}
      <div style={{ width: '200px', borderRight: '1px solid #444', padding: '20px' }}>
        <h2>Sports Shield</h2>
        <p style={{ color: 'cyan' }}>• Overview</p>
        <p>Scanner</p>
        <p>Tracking</p>
      </div>

      {/* 2. Main Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        <header>
          <h1 style={{ fontSize: '36px' }}>Global Piracy Overview</h1>
          <p style={{ color: '#aaa' }}>Real-time tracking of unauthorized sports media broadcasts</p>
          <span style={{ backgroundColor: '#ff4d4d', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
            Live Risk Level: HIGH
          </span>
        </header>

        {/* 3. The Stats Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '30px' }}>
          <StatCard title="TOTAL SCANS" value="12,450" color="cyan" />
          <StatCard title="VIOLATIONS DETECTED" value={violations.toString()} color="#ff4d4d" />
          <StatCard title="TAKEDOWNS SUCCESSFUL" value="128" color="#00ff00" />
          <StatCard title="REVENUE SAVED" value="$4.2M" color="cyan" />
        </div>

        <button style={{
          marginTop: '20px',
          padding: '12px 24px',
          backgroundColor: '#3b82f6',
          border: 'none',
          borderRadius: '6px',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Force Global Scan
        </button>
      </div>
    </div>
  );
}