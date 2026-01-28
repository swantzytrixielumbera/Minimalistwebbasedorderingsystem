import React, { useState } from 'react';
import { Lock, User, Zap, Mail, UserPlus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface LoginPageProps {
  onLogin: (username: string, role: 'admin' | 'customer') => void;
}

// User type for customer accounts
interface CustomerAccount {
  username: string;
  password: string;
  name: string;
  email: string;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load customer accounts from localStorage
  const getCustomerAccounts = (): CustomerAccount[] => {
    const accounts = localStorage.getItem('customerAccounts');
    return accounts ? JSON.parse(accounts) : [];
  };

  // Save customer accounts to localStorage
  const saveCustomerAccounts = (accounts: CustomerAccount[]) => {
    localStorage.setItem('customerAccounts', JSON.stringify(accounts));
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if username already exists
    const accounts = getCustomerAccounts();
    
    // Also check against default accounts
    if (username === 'admin' || username === 'customer' || 
        accounts.some(acc => acc.username.toLowerCase() === username.toLowerCase())) {
      setError('Username already exists. Please choose another one.');
      return;
    }

    // Create new account
    const newAccount: CustomerAccount = {
      username,
      password,
      name,
      email
    };

    accounts.push(newAccount);
    saveCustomerAccounts(accounts);

    setSuccessMessage('Account created successfully! You can now sign in.');
    
    // Reset form and switch to sign in
    setTimeout(() => {
      setIsSignUp(false);
      setPassword('');
      setConfirmPassword('');
      setName('');
      setEmail('');
      setSuccessMessage('');
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Check admin credentials
    if (username === 'admin' && password === 'admin123') {
      onLogin(username, 'admin');
      return;
    }

    // Check default customer
    if (username === 'customer' && password === 'customer123') {
      onLogin(username, 'customer');
      return;
    }

    // Check registered customer accounts
    const accounts = getCustomerAccounts();
    const account = accounts.find(
      acc => acc.username === username && acc.password === password
    );

    if (account) {
      onLogin(username, 'customer');
    } else {
      setError('Invalid credentials. Please check your username and password.');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccessMessage('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-3 sm:p-4">
      {/* Theme Toggle - Absolute Position */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-stone-200 dark:bg-stone-700 rounded-full mb-3 sm:mb-4">
            <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-700 dark:text-neutral-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2 px-4">
            B. Laroza Electrical Lights Trading
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Stock & Ordering System</p>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-5 sm:mb-6">
            {isSignUp ? 'Create Customer Account' : 'Login'}
          </h2>

          {isSignUp ? (
            // Sign Up Form
            <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                    placeholder="Create a password (min. 6 characters)"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full bg-stone-300 hover:bg-stone-400 dark:bg-stone-600 dark:hover:bg-stone-500 text-neutral-800 dark:text-neutral-200 font-medium py-2.5 sm:py-3 rounded-lg transition-colors duration-200 touch-manipulation"
              >
                Create Account
              </button>

              {/* Toggle to Sign In */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                >
                  Already have an account? <span className="font-medium">Sign In</span>
                </button>
              </div>
            </form>
          ) : (
            // Sign In Form
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-stone-300 hover:bg-stone-400 dark:bg-stone-600 dark:hover:bg-stone-500 text-neutral-800 dark:text-neutral-200 font-medium py-2.5 sm:py-3 rounded-lg transition-colors duration-200 touch-manipulation"
              >
                Sign In
              </button>

              {/* Toggle to Sign Up */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                >
                  Don't have an account? <span className="font-medium">Sign Up</span>
                </button>
              </div>
            </form>
          )}

          {/* Demo Credentials - Only show on Sign In */}
          {!isSignUp && (
            <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Demo Credentials:</p>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-2.5 sm:p-3 rounded-lg">
                  <p className="font-medium text-neutral-700 dark:text-neutral-300">Admin Access:</p>
                  <p className="text-neutral-600 dark:text-neutral-400">Username: admin / Password: admin123</p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-2.5 sm:p-3 rounded-lg">
                  <p className="font-medium text-neutral-700 dark:text-neutral-300">Customer Access:</p>
                  <p className="text-neutral-600 dark:text-neutral-400">Username: customer / Password: customer123</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}