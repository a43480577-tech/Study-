/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  User, 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './lib/firebase';

// Real Pages
import LandingPage from './pages/LandingPage';
import SelectionPage from './pages/SelectionPage';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import ContentBrowser from './pages/ContentBrowser';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import QuizPage from './pages/QuizPage';

function Navbar() {
  const location = useLocation();
  const hiddenRoutes = ['/welcome', '/select', '/quiz'];
  
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 flex justify-around p-2 pb-6 z-50">
      <NavItem to="/" icon={<Home size={22} strokeWidth={2.5} />} label="Dashboard" />
      <NavItem to="/browse" icon={<BookOpen size={22} strokeWidth={2.5} />} label="Resources" />
      <NavItem to="/ai" icon={<MessageSquare size={22} strokeWidth={2.5} />} label="AI Help" />
      <NavItem to="/profile" icon={<User size={22} strokeWidth={2.5} />} label="Account" />
    </nav>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <RouteLink to={to}>
      {({ isActive }: { isActive: boolean }) => (
        <div className={`flex flex-col items-center gap-1.5 py-1 px-3 rounded-2xl transition-all ${isActive ? 'text-brand-600 bg-brand-50' : 'text-slate-400 hover:text-slate-600'}`}>
          {icon}
          <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
          {isActive && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-6 h-1 bg-brand-600 rounded-full blur-[2px]" />}
        </div>
      )}
    </RouteLink>
  );
}

// Wrapper for NavLink to avoid import mismatch issues in this specific environment
import { NavLink as RouteLink } from 'react-router-dom';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('onboarded') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <Router>
      <div className="mobile-container">
        <main className="flex-1 pb-16 overflow-y-auto bg-slate-50 scroll-smooth">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={hasOnboarded ? <Dashboard /> : <Navigate to="/welcome" />} />
              <Route path="/welcome" element={<LandingPage />} />
              <Route path="/select" element={<SelectionPage />} />
              <Route path="/browse" element={<ContentBrowser />} />
              <Route path="/ai" element={<AIAssistant />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Navbar />
      </div>
    </Router>
  );
}
