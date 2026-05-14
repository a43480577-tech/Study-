import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Rocket, GraduationCap, Sparkles, ShieldCheck } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/select');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-full bg-white flex flex-col items-center justify-center p-8 text-center">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="w-20 h-20 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-brand-200 mb-8"
      >
        <span className="text-4xl font-black">E</span>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-5xl font-black text-brand-900 mb-2 tracking-tighter uppercase">
          Exam <span className="text-brand-600">Booster</span>
        </h1>
        <p className="text-slate-500 mb-12 text-sm font-bold uppercase tracking-widest px-4 opacity-60">
          Excel in Class 9-12 Boards
        </p>
      </motion.div>

      <div className="w-full space-y-8">
        <div className="grid grid-cols-1 gap-3 text-left">
          <Feature icon={<Sparkles className="text-brand-600" size={18} />} text="AI STUDY ASSISTANT" bgColor="bg-brand-50" />
          <Feature icon={<ShieldCheck className="text-vibrant-emerald-text" size={18} />} text="VERIFIED BOARD PAPERS" bgColor="bg-vibrant-emerald-bg" />
          <Feature icon={<Rocket className="text-vibrant-orange-text" size={18} />} text="DAILY TOPPER CHALLENGES" bgColor="bg-vibrant-orange-bg" />
        </div>

        <div className="space-y-4 pt-8">
          <button 
            onClick={handleLogin}
            className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Sign in with Google
          </button>
          <p className="text-xs text-slate-400">By continuing, you agree to prepare for excellence.</p>
        </div>
      </div>

      <p className="mt-12 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
        Made for Students in India
      </p>
    </div>
  );
}

function Feature({ icon, text, bgColor }: { icon: any, text: string, bgColor: string }) {
  return (
    <div className={`flex items-center gap-3 ${bgColor} p-4 rounded-2xl border border-black/5 shadow-sm`}>
      <div className="p-2 bg-white rounded-xl shadow-sm">
        {icon}
      </div>
      <span className="font-black text-slate-800 text-[11px] tracking-widest">{text}</span>
    </div>
  );
}
