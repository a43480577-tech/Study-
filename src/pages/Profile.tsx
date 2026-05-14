import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  ChevronRight, 
  LogOut, 
  Shield,
  BookOpen,
  Award,
  Heart
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Profile() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('onboarded');
    navigate('/welcome');
  };

  return (
    <div className="flex flex-col gap-6 p-5">
      <header className="text-center py-8">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 border-4 border-white shadow-lg mx-auto overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={48} />
            )}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-brand-600 text-white rounded-full shadow-lg border-2 border-white">
            <Settings size={14} />
          </button>
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">{user?.displayName || 'Student'}</h2>
        <p className="text-sm text-slate-500">{localStorage.getItem('user_class')} • {localStorage.getItem('user_board')}</p>
      </header>

      {/* Progress Section */}
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Award size={20} className="text-brand-600" />
          <h3 className="font-bold text-slate-800">Learning Progress</h3>
        </div>
        <div className="space-y-4">
          <ProgressItem label="Mathematics" progress={75} color="bg-blue-500" />
          <ProgressItem label="Science" progress={45} color="bg-emerald-500" />
          <ProgressItem label="English" progress={90} color="bg-indigo-500" />
        </div>
      </section>

      {/* Menu Options */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <MenuTab 
          icon={<Heart size={18} className="text-red-500" />} 
          label="Favorites" 
          to="/favorites" 
        />
        <MenuTab 
          icon={<BookOpen size={18} className="text-brand-600" />} 
          label="Recently Viewed" 
          to="/recent" 
        />
        <MenuTab 
          icon={<Bell size={18} className="text-orange-500" />} 
          label="Notifications" 
          to="/notifications" 
        />
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </div>
            <span className="text-sm font-medium text-slate-700">Dark Mode</span>
          </div>
          <button 
            onClick={() => {
              setIsDarkMode(!isDarkMode);
              document.documentElement.classList.toggle('dark');
            }}
            className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-brand-600' : 'bg-slate-200'}`}
          >
            <motion.div 
              animate={{ x: isDarkMode ? 24 : 4 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
            />
          </button>
        </div>
        <Link to="/admin" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-xl text-brand-400">
              <Shield size={18} />
            </div>
            <span className="text-sm font-medium text-slate-700">Admin Section</span>
          </div>
          <ChevronRight size={18} className="text-slate-300" />
        </Link>
      </div>

      {/* Log Out */}
      <button 
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 p-5 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors"
      >
        <LogOut size={20} />
        Log Out
      </button>
    </div>
  );
}

function ProgressItem({ label, progress, color }: { label: string, progress: number, color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  );
}

function MenuTab({ icon, label, to }: { icon: any, label: string, to: string }) {
  return (
    <Link to={to} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-xl">
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <ChevronRight size={18} className="text-slate-300" />
    </Link>
  );
}
