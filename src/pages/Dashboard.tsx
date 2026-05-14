import { motion } from 'motion/react';
import { 
  Trophy, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  Zap, 
  Calendar,
  Flame,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';

export default function Dashboard() {
  const user = auth.currentUser;
  const examDate = new Date('2026-03-01');
  const today = new Date();
  const diffTime = Math.abs(examDate.getTime() - today.getTime());
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="flex flex-col gap-6 p-5">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            Boost Your <br />
            <span className="text-brand-600">Exam Prep</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Hello, {user?.displayName?.split(' ')[0] || 'Scholar'}! Ready to study?</p>
        </div>
        <div className="bg-brand-100 p-2 rounded-xl text-brand-600">
          <Trophy size={24} />
        </div>
      </header>

      {/* Countdown Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-vibrant-orange-bg border border-vibrant-orange-text/20 text-vibrant-orange-text rounded-3xl p-6 shadow-sm overflow-hidden relative"
      >
        <div className="relative z-10 font-sans">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-vibrant-orange-text opacity-70" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-vibrant-orange-text opacity-70">Board Exam Countdown</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black">{daysLeft}</span>
            <span className="text-lg font-bold opacity-80">Days Left</span>
          </div>
          <p className="text-xs mt-2 font-medium">Until Mathematics Exam</p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-vibrant-orange-text/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Flame className="text-orange-500" />} 
          label="Study Streak" 
          value="5 Days" 
          bgColor="bg-orange-50" 
        />
        <StatCard 
          icon={<Star className="text-yellow-500" />} 
          label="Total Marks" 
          value="450" 
          bgColor="bg-yellow-50" 
        />
      </div>

      {/* Daily Quiz Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Daily Challenge</h2>
          <Link to="/quiz" className="text-xs font-bold text-brand-600 uppercase tracking-widest">See All</Link>
        </div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Zap size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800">Mathematics Quiz</h3>
            <p className="text-xs text-slate-500">10 Questions • 5 Mins</p>
          </div>
          <Link to="/quiz" className="bg-slate-900 text-white rounded-full px-4 py-2 text-xs font-bold">Start</Link>
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold tracking-tight">Study Material</h2>
          <ChevronRight size={18} className="text-slate-400" />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <CategoryCard 
            icon={<BookOpen size={24} />} 
            title="Papers" 
            bgColor="bg-vibrant-pink-bg" 
            textColor="text-vibrant-pink-text"
            label="Ch-wise"
          />
          <CategoryCard 
            icon={<Calendar size={24} />} 
            title="Sample" 
            bgColor="bg-vibrant-purple-bg" 
            textColor="text-vibrant-purple-text"
            label="Latest"
          />
          <CategoryCard 
            icon={<Star size={24} />} 
            title="Important" 
            bgColor="bg-vibrant-cyan-bg" 
            textColor="text-vibrant-cyan-text"
            label="V.V.I."
          />
          <CategoryCard 
            icon={<Zap size={24} />} 
            title="Revision" 
            bgColor="bg-vibrant-emerald-bg" 
            textColor="text-vibrant-emerald-text"
            label="Notes"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }: { icon: any, label: string, value: string, bgColor: string }) {
  return (
    <div className={`${bgColor} p-4 rounded-[24px] border border-black/5 flex flex-col gap-1 shadow-sm`}>
      <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center shadow-sm text-sm">
        {icon}
      </div>
      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-2">{label}</p>
      <p className="font-bold text-xl">{value}</p>
    </div>
  );
}

function CategoryCard({ icon, title, bgColor, textColor, label }: { icon: any, title: string, bgColor: string, textColor: string, label: string }) {
  return (
    <div className={`${bgColor} ${textColor} p-5 rounded-[32px] flex flex-col gap-3 justify-between h-40 border border-black/5 shadow-sm group hover:scale-[1.02] transition-transform cursor-pointer`}>
      <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">{label}</p>
        <p className="font-black text-lg leading-tight uppercase tracking-tight">{title}</p>
      </div>
    </div>
  );
}
