import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { X, Check, ArrowRight, Trophy } from 'lucide-react';

const mockQuestions = [
  {
    id: '1',
    question: 'What is the value of sin(90°)?',
    options: ['0', '1/2', '1', '∞'],
    answer: '1'
  },
  {
    id: '2',
    question: 'Which element has the atomic number 1?',
    options: ['Helium', 'Oxygen', 'Hydrogen', 'Carbon'],
    answer: 'Hydrogen'
  }
];

export default function QuizPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (selectedOption === mockQuestions[currentIdx].answer) {
      setScore(s => s + 1);
    }

    if (currentIdx < mockQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full gap-6">
        <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center animate-bounce">
          <Trophy size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Quiz Finished!</h2>
          <p className="text-slate-500 mt-2">You scored {score}/{mockQuestions.length}</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-100"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const q = mockQuestions[currentIdx];

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <div className="flex justify-between items-center mb-12">
        <button onClick={() => navigate('/')} className="p-2 bg-slate-50 text-slate-400 rounded-full">
          <X size={20} />
        </button>
        <div className="text-sm font-bold text-slate-400">
          Question <span className="text-slate-900">{currentIdx + 1}/{mockQuestions.length}</span>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-2xl font-bold text-slate-800 mb-8">{q.question}</h3>
        
        <div className="space-y-4">
          {q.options.map(opt => (
            <button
              key={opt}
              onClick={() => setSelectedOption(opt)}
              className={`w-full p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                selectedOption === opt 
                  ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-md translate-x-2' 
                  : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
              }`}
            >
              <span className="font-bold">{opt}</span>
              {selectedOption === opt && <Check size={20} className="text-brand-600" />}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={!selectedOption}
        onClick={handleNext}
        className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-100 flex items-center justify-center gap-2 disabled:bg-slate-200 transition-all"
      >
        {currentIdx === mockQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
