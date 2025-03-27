import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ElectionProgressProvider,HasVotedProvider } from './Atoms/contextAPI';
import SignupForm from './pages/SignUp';
import LoginForm from './pages/Login';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import VoterDashBoard from './pages/VoterDashboard';
import Loader from './components/loader';
import './App.css';

function PageLoaderWrapper() {
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // This is safe inside Router

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600); // Simulating API call delay
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading ? (
    <Loader /> // Show loader if loading
  ) : (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignupForm isAdmin={false} />} />
      <Route path="/login" element={<LoginForm isAdmin={true} />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/voter" element={<VoterDashBoard />} />
    </Routes>
  );
}

function App() {
  return (
    <RecoilRoot>
      <HasVotedProvider>
      <ElectionProgressProvider>
        <Router>
          <PageLoaderWrapper />
        </Router>
      </ElectionProgressProvider>
      </HasVotedProvider>
    </RecoilRoot>
  );
}

export default App;
