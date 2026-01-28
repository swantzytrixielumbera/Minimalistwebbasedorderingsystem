import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataSyncProvider } from './contexts/DataSyncContext';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import CustomerShop from './components/customer/CustomerShop';

export default function App() {
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    role: 'admin' | 'customer';
  } | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (username: string, role: 'admin' | 'customer') => {
    const user = { username, role };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <ThemeProvider>
      <DataSyncProvider>
        {!currentUser ? (
          <LoginPage onLogin={handleLogin} />
        ) : currentUser.role === 'admin' ? (
          <AdminDashboard user={currentUser} onLogout={handleLogout} />
        ) : (
          <CustomerShop user={currentUser} onLogout={handleLogout} />
        )}
      </DataSyncProvider>
    </ThemeProvider>
  );
}