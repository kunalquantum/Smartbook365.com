import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChemistryModule from './modules/chemistry/ChemistryModule';
import MathsModule from './modules/maths/MathsModule';
import PhysicsModule from './modules/physics/PhysicsModule';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chemistry/*" element={<ChemistryModule />} />
        <Route path="/maths/*" element={<MathsModule />} />
        <Route path="/physics/*" element={<PhysicsModule />} />
      </Routes>
    </Router>
  );
}

export default App;
