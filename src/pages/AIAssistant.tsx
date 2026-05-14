import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { askAI } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Namaste! I am your Exam Booster AI. How can I help you study today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const response = await askAI(userMessage);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Chat Header */}
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-black text-slate-800 tracking-tight uppercase text-sm">Exam Booster AI</h2>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Active Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
      >
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
            >
              {m.role === 'assistant' && (
                <div className="w-6 h-6 bg-slate-800 rounded-lg flex items-center justify-center text-[10px] text-white font-black shrink-0">AI</div>
              )}
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                m.role === 'user' 
                  ? 'bg-brand-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-white">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-brand-600" />
                <span className="text-xs text-slate-500">Thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything (e.g. solve x^2 + 5x + 6 = 0)"
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-brand-500 transition-all outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-brand-600 text-white rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          AI can make mistakes. Verify important formulas.
        </p>
      </div>
    </div>
  );
}
