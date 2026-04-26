import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import FinancialStatements from './pages/FinancialStatements'
import RatioAnalysis from './pages/RatioAnalysis'
import CashFlow from './pages/CashFlow'
import CostAccounting from './pages/CostAccounting'
import MarginalCosting from './pages/MarginalCosting'
import Budgeting from './pages/Budgeting'
import StandardCosting from './pages/StandardCosting'
import './index.css'

export default function AccountsAdvancedModule() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="financial-statements" element={<FinancialStatements />} />
        <Route path="ratio-analysis" element={<RatioAnalysis />} />
        <Route path="cash-flow" element={<CashFlow />} />
        <Route path="cost-accounting" element={<CostAccounting />} />
        <Route path="marginal-costing" element={<MarginalCosting />} />
        <Route path="budgeting" element={<Budgeting />} />
        <Route path="standard-costing" element={<StandardCosting />} />
      </Route>
    </Routes>
  )
}
