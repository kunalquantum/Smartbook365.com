import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminDashboard from './pages/AdminDashboard';
import ChemistryModule from './modules/chemistry/ChemistryModule';
import MathsModule from './modules/maths/MathsModule';
import PhysicsModule from './modules/physics/PhysicsModule';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route 
            path="/chemistry/*" 
            element={
              <ProtectedRoute>
                <ChemistryModule />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/maths/*" 
            element={
              <ProtectedRoute>
                <MathsModule />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/physics/*" 
            element={
              <ProtectedRoute>
                <PhysicsModule />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
