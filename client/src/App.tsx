import { Routes, Route } from 'react-router-dom';
import Layout from '@components/Layout';
import Dashboard from '@pages/Dashboard';
import SupervisorPanel from '@pages/SupervisorPanel';
import RequestDetails from '@pages/RequestDetails';
import KnowledgeBase from '@pages/KnowledgeBase';
import NotFound from '@pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="supervisor" element={<SupervisorPanel />} />
        <Route path="requests/:requestId" element={<RequestDetails />} />
        <Route path="knowledge" element={<KnowledgeBase />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App; 