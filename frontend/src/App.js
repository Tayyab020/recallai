import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import { initializeAccessibility } from './utils/accessibility';
import { initializePerformanceOptimizations } from './utils/performance';
import { initializeResponsiveValidation } from './utils/responsive';
import { initializeColorTesting } from './utils/colorTesting';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EntryForm from './pages/EntryForm';
import AllEvents from './pages/AllEvents';
import Conversations from './pages/Conversations';
import Reminders from './pages/Reminders';
import Settings from './pages/Settings';

function App() {
  const { user, loading } = useAuth();

  // Initialize all design system features on app load
  React.useEffect(() => {
    initializeAccessibility();
    initializePerformanceOptimizations();
    initializeResponsiveValidation();
    initializeColorTesting();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <div>Loading...</div>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/entry"
            element={user ? <EntryForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/events"
            element={user ? <AllEvents /> : <Navigate to="/login" />}
          />
          <Route
            path="/conversations"
            element={user ? <Conversations /> : <Navigate to="/login" />}
          />
          <Route
            path="/reminders"
            element={user ? <Reminders /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={user ? <Settings /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
