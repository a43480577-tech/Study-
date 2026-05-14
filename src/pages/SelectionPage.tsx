import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ClassLevel, BoardType } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SelectionPage() {
  const [step, setStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState<ClassLevel | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<BoardType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async () => {
    if (!auth.currentUser) return;
    
    setIsSaving(true);
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, 'users', userId);

    try {
      await setDoc(userDocRef, {
        userId,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
        selectedClass,
        selectedBoard,
        favorites: [],
        recentlyViewed: [],
        progress: {},
        createdAt: serverTimestamp(),
      });

      localStorage.setItem('onboarded', 'true');
      localStorage.setItem('user_class', selectedClass || '');
      localStorage.setItem('user_board', selectedBoard || '');
      window.location.reload();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    } finally {
      setIsSaving(false);
    }
  };

  const classes: ClassLevel[] = ['9th', '10th', '11th', '12th'];
  const boards: BoardType[] = ['CBSE', 'State Board', 'ICSE'];

  return (
    <div className="min-h-full bg-white px-6 py-12 flex flex-col justify-center">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Get Started</h1>
        <p className="text-slate-500">Pick your class and board to personalize your studies.</p>
        
        {/* Progress Bar */}
        <div className="flex gap-2 mt-6">
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-brand-600' : 'bg-slate-100'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-brand-600' : 'bg-slate-100'}`} />
        </div>
      </div>

      <div className="flex-1">
        {step === 1 ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-6 tracking-tight">Which class are you in?</h2>
            <div className="grid grid-cols-2 gap-4">
              <VibrantSelectionCard
                title="9"
                label="Class"
                selected={selectedClass === '9th'}
                onClick={() => setSelectedClass('9th')}
                bgColor="bg-vibrant-pink-bg"
                textColor="text-vibrant-pink-text"
                borderColor="border-vibrant-pink-text"
              />
              <VibrantSelectionCard
                title="10"
                label="Class"
                selected={selectedClass === '10th'}
                onClick={() => setSelectedClass('10th')}
                bgColor="bg-vibrant-purple-bg"
                textColor="text-vibrant-purple-text"
                borderColor="border-vibrant-purple-text"
              />
              <VibrantSelectionCard
                title="11"
                label="Class"
                selected={selectedClass === '11th'}
                onClick={() => setSelectedClass('11th')}
                bgColor="bg-vibrant-cyan-bg"
                textColor="text-vibrant-cyan-text"
                borderColor="border-vibrant-cyan-text"
              />
              <VibrantSelectionCard
                title="12"
                label="Class"
                selected={selectedClass === '12th'}
                onClick={() => setSelectedClass('12th')}
                bgColor="bg-vibrant-emerald-bg"
                textColor="text-vibrant-emerald-text"
                borderColor="border-vibrant-emerald-text"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-6">Select your Board</h2>
            <div className="grid grid-cols-1 gap-3">
              {boards.map((b) => (
                <SelectionCard
                  key={b}
                  title={b}
                  selected={selectedBoard === b}
                  onClick={() => setSelectedBoard(b)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        {step === 2 && (
          <button 
            onClick={() => setStep(1)}
            className="px-6 py-4 rounded-2xl font-bold text-slate-500 bg-slate-50"
          >
            Back
          </button>
        ) }
        
        <button
          disabled={step === 1 ? !selectedClass : (!selectedBoard || isSaving)}
          onClick={() => step === 1 ? setStep(2) : handleFinish()}
          className="flex-1 bg-brand-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-100 flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:shadow-none transition-all"
        >
          {isSaving ? 'Saving...' : (step === 1 ? 'Continue' : 'Finish')}
          {!isSaving && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
}

function SelectionCard({ title, selected, onClick }: { title: string, selected: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
        selected ? 'border-brand-600 bg-brand-50' : 'border-slate-100 bg-white hover:border-brand-200'
      }`}
    >
      <span className={`font-bold ${selected ? 'text-brand-700' : 'text-slate-700'}`}>{title}</span>
      {selected ? (
        <CheckCircle2 size={24} className="text-brand-600" />
      ) : (
        <div className="w-6 h-6 border-2 border-slate-200 rounded-full" />
      )}
    </button>
  );
}

function VibrantSelectionCard({ title, label, selected, onClick, bgColor, textColor, borderColor }: { title: string, label: string, selected: boolean, onClick: () => void, bgColor: string, textColor: string, borderColor: string }) {
  return (
    <button
      onClick={onClick}
      className={`aspect-square rounded-3xl flex flex-col items-center justify-center p-4 transition-all border-2 ${
        selected 
          ? `${bgColor} ${textColor} ${borderColor} shadow-lg scale-105 z-10` 
          : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'
      }`}
    >
      <span className="text-4xl font-black mb-1 leading-none">{title}</span>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</span>
    </button>
  );
}
