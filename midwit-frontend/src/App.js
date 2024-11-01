import React from 'react';
import WalletConnect from './components/WalletConnect';
import DataDisplay from './components/DataDisplay';
import midwitImage from './assets/midwit.jpeg';
import './App.css';
import { ThemeProvider, useTheme } from './ThemeContext';

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: isDark ? '#fff' : '#333',
        color: isDark ? '#333' : '#fff',
        zIndex: 1000
      }}
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}

function AppContent() {
  const { isDark } = useTheme();

  return (
    <div className="App" style={{
      backgroundColor: isDark ? '#282c34' : '#f5f5f5',
      color: isDark ? '#fff' : '#333',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <header className="App-header" style={{
        backgroundColor: isDark ? '#282c34' : '#f5f5f5',
        color: isDark ? '#fff' : '#333'
      }}>
        <ThemeToggle />
        <h1>Midwit Counter</h1>
        <img 
          src={midwitImage} 
          alt="Midwit Distribution" 
          style={{ 
            maxWidth: '800px',
            width: '100%',
            height: 'auto',
            margin: '20px 0'
          }} 
        />
        <WalletConnect />
        <DataDisplay />
      </header>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;