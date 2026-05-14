import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FilePlus, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Database,
  Users,
  Pencil,
  Trash2
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminPanel() {
  const [formType, setFormType] = useState<'paper' | 'note' | 'mcq'>('paper');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [classLevel, setClassLevel] = useState('10th');
  const [board, setBoard] = useState('CBSE');
  const [fileUrl, setFileUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'content'), {
        title,
        class: classLevel,
        board,
        subject: 'General', // Default for now
        type: formType === 'paper' ? 'sample_paper' : formType,
        fileUrl,
        createdAt: serverTimestamp(),
      });
      setTitle('');
      setFileUrl('');
      alert('Content Published Successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'content');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-slate-500">Manage Exam Booster Content</p>
        </div>
        <div className="admin-badge">Admin</div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 text-white p-4 rounded-2xl">
          <Database size={20} className="text-brand-400 mb-2" />
          <p className="text-[10px] uppercase font-bold opacity-60">Total Items</p>
          <p className="text-xl font-bold">1,248</p>
        </div>
        <div className="bg-brand-50 text-brand-700 p-4 rounded-2xl">
          <Users size={20} className="mb-2" />
          <p className="text-[10px] uppercase font-bold opacity-60">Avg. Users</p>
          <p className="text-xl font-bold">850</p>
        </div>
      </div>

      {/* Upload Section */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex gap-2 mb-6 p-1 bg-slate-50 rounded-xl">
          <button 
            onClick={() => setFormType('paper')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formType === 'paper' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500'}`}
          >
            Papers
          </button>
          <button 
            onClick={() => setFormType('note')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formType === 'note' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500'}`}
          >
            Notes
          </button>
          <button 
            onClick={() => setFormType('mcq')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formType === 'mcq' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500'}`}
          >
            MCQs
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Maths Class 10th Sample Paper 2024"
              className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Class</label>
              <select 
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option>9th</option>
                <option>10th</option>
                <option>11th</option>
                <option>12th</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Board</label>
              <select 
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option>CBSE</option>
                <option>State Board</option>
                <option>ICSE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">PDF File URL</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              />
              <button type="button" className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                <Upload size={18} />
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-100 flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <AlertCircle className="animate-pulse" size={18} />
                Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FilePlus size={18} />
                Publish Item
              </span>
            )}
          </button>
        </form>
      </section>

      {/* Recent Activity List */}
      <section>
        <h2 className="text-lg font-bold mb-4">Recently Published</h2>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-slate-50">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                <CheckCircle size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-800">Chemistry Notes - Ch 1</h4>
                <p className="text-[10px] text-slate-400">Modified 2 hours ago</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><Pencil size={16} /></button>
                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
