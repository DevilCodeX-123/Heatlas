import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CitizenAnalytics from './pages/CitizenAnalytics';
import MapHub from './pages/MapHub';
import Governance from './pages/Governance';
import CoolingSimulator from './pages/CoolingSimulator';
import ActionEngine from './pages/ActionEngine';
import Rankings from './pages/Rankings';
import AIAssistant from './pages/AIAssistant';
import Auth from './pages/Auth';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('heatlas_auth') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/analytics" replace />} />
        <Route path="analytics" element={<CitizenAnalytics />} />
        <Route path="map" element={<MapHub />} />
        <Route path="governance" element={<Governance />} />
        <Route path="simulator" element={<CoolingSimulator />} />
        <Route path="action" element={<ActionEngine />} />
        <Route path="rankings" element={<Rankings />} />
        <Route path="ai" element={<AIAssistant />} />
      </Route>
    </Routes>
  );
}

export default App;
