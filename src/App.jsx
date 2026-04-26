import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './index.css';

// Lazy load components for performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
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

// Fallback Loading Screen with Typewriter Effect
const LoadingScreen = () => {
    const [text, setText] = React.useState('');
    const fullText = "Welcome please";
    
    React.useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setText(fullText.substring(0, i));
            i++;
            if (i > fullText.length) clearInterval(timer);
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return (
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
            {/* Ambient Background Glow */}
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(102, 252, 241, 0.1) 0%, transparent 70%)',
                filter: 'blur(50px)',
                animation: 'pulse 4s ease-in-out infinite'
            }}></div>

            <div style={{
                width: '60px',
                height: '60px',
                border: '2px solid rgba(102, 252, 241, 0.05)',
                borderTopColor: '#66fcf1',
                borderRadius: '50%',
                animation: 'spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                marginBottom: '32px',
                boxShadow: '0 0 20px rgba(102, 252, 241, 0.2)'
            }}></div>
            
            <div style={{ 
                fontFamily: 'monospace', 
                fontSize: '14px', 
                letterSpacing: '1px', 
                textAlign: 'center',
                maxWidth: '80%',
                lineHeight: '1.6',
                height: '24px', // Prevent layout shift
                textShadow: '0 0 10px rgba(102, 252, 241, 0.3)'
            }}>
                {text}<span style={{ animation: 'blink 1s infinite', borderLeft: '2px solid #66fcf1', marginLeft: '2px' }}></span>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 0.8; }
                }
                @keyframes blink { 50% { opacity: 0; } }
            `}</style>
        </div>
    );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
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
      </Router>
    </AuthProvider>
  );
}

export default App;

