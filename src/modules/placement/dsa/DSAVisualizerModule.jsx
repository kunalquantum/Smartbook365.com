import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { ArraysPage, SortingPage, TreesPage, LinkedListPage, StacksPage, GraphsPage } from './pages/pages';
import './styles/globals.css';
import './styles/viz.css';
import './styles/animations.css';

export default function DSAVisualizerModule() {
  return (
    <div className="dsa-visualizer-module">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="arrays"      element={<ArraysPage />} />
          <Route path="sorting"     element={<SortingPage />} />
          <Route path="trees"       element={<TreesPage />} />
          <Route path="linked-list" element={<LinkedListPage />} />
          <Route path="stacks"      element={<StacksPage />} />
          <Route path="graphs"      element={<GraphsPage />} />
        </Route>
      </Routes>
    </div>
  );
}
