import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Tasks from './components/Tasks';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Router>
      <nav style={{ marginBottom: '1rem' }}>
        {isAuthenticated ? (
          <>
            <Link to="/tasks">Tasks</Link>
            <button onClick={logout} style={{ marginLeft: '1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{ marginLeft: '1rem' }}>
              Register
            </Link>
          </>
        )}
      </nav>

      <Routes key={isAuthenticated ? "authenticated" : "guest"}>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/tasks" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/tasks" /> : <Register />} />
        <Route path="/tasks" element={isAuthenticated ? <Tasks /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
