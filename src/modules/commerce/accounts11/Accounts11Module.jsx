import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import FinancialStatements from './pages/FinancialStatements';
import Adjustments from './pages/Adjustments';
import DepreciationPage from './pages/Depreciation';
import BillsOfExchange from './pages/BillsOfExchange';
import Consignment from './pages/Consignment';
import JointVenture from './pages/JointVenture';
import NPO from './pages/NPO';
import Partnership from './pages/Partnership';
import './index.css';
import './App.css';

export default function Accounts11Module() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/financial-statements" element={<FinancialStatements />} />
        <Route path="/adjustments" element={<Adjustments />} />
        <Route path="/depreciation" element={<DepreciationPage />} />
        <Route path="/bills-of-exchange" element={<BillsOfExchange />} />
        <Route path="/consignment" element={<Consignment />} />
        <Route path="/joint-venture" element={<JointVenture />} />
        <Route path="/npo" element={<NPO />} />
        <Route path="/partnership" element={<Partnership />} />
      </Routes>
    </Layout>
  );
}
