import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import './index.css';

// Lazy load everything EXCEPT the landing page (critical path)
const DomainPage = lazy(() => import('./pages/DomainPage'));
const EngineeringDepartmentPage = lazy(() => import('./pages/EngineeringDepartmentPage'));
const EngineeringSemesterPage = lazy(() => import('./pages/EngineeringSemesterPage'));
const ProgrammingLanguagePage = lazy(() => import('./pages/ProgrammingLanguagePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DemoPage = lazy(() => import('./pages/DemoPage'));
const ChemistryModule = lazy(() => import('./modules/chemistry/ChemistryModule'));
const MathsModule = lazy(() => import('./modules/maths/MathsModule'));
const PhysicsModule = lazy(() => import('./modules/physics/PhysicsModule'));
const Microprocessor8085Module = lazy(() => import('./modules/engineering/microprocessor8085/Microprocessor8085Module'));
const DSAVisualizerModule = lazy(() => import('./modules/placement/dsa/DSAVisualizerModule'));
const CommerceAccountsPage = lazy(() => import('./pages/CommerceAccountsPage'));
const Accounts11Module = lazy(() => import('./modules/commerce/accounts11/Accounts11Module'));
const AccountsAdvancedModule = lazy(() => import('./modules/commerce/accounts_advanced/AccountsAdvancedModule'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));

// Minimal inline loading — no state, no effects, no re-renders
const LoadingScreen = () => (
    <div style={{
        height: '100vh',
        width: '100vw',
        background: '#0b0c10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#66fcf1',
        overflow: 'hidden',
        position: 'relative'
    }}>
        <div style={{
            width: '48px',
            height: '48px',
            border: '2px solid rgba(102, 252, 241, 0.08)',
            borderTopColor: '#66fcf1',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
        }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page loads instantly — NOT lazy */}
          <Route path="/" element={<LandingPage />} />

          {/* Everything else is lazy-loaded with Suspense */}
          <Route path="/*" element={
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/domains/engineering/computer-engineering/sem-4/8085" element={<Microprocessor8085Module />} />
                <Route path="/domains/engineering/:departmentId/:semesterId" element={<EngineeringSemesterPage />} />
                <Route path="/domains/engineering/:departmentId" element={<EngineeringDepartmentPage />} />
                <Route path="/domains/computer-language/:languageId" element={<ProgrammingLanguagePage />} />
                <Route path="/domains/:domainId" element={<DomainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="/domains/software-placement/dsa-practice/*" element={<DSAVisualizerModule />} />
                <Route path="/domains/commerce/accounts" element={<CommerceAccountsPage />} />
                <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
                
                {/* Demo routes — public, no auth */}
                <Route path="/demo/chemistry/*" element={<ChemistryModule isDemoMode={true} />} />
                <Route path="/demo/physics/*" element={<PhysicsModule isDemoMode={true} />} />
                <Route path="/demo/maths/*" element={<MathsModule isDemoMode={true} />} />
                
                {/* Full access routes — auth required */}
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
                <Route 
                  path="/commerce/accounts/11th/*" 
                  element={<Accounts11Module />} 
                />
                <Route 
                  path="/commerce/accounts/advanced/*" 
                  element={<AccountsAdvancedModule />} 
                />
              </Routes>
            </Suspense>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
