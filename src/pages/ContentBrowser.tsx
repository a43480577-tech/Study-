import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  FileText, 
  FileDown, 
  BookOpen, 
  Tag,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Content } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function ContentBrowser() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'papers' | 'notes' | 'mcqs'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const subjects = [
    'All', 'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 
    'English', 'Hindi', 'Social Science', 'SST', 'History', 'Geography', 'Economics'
  ];

  useEffect(() => {
    const q = query(collection(db, 'content'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Content[];
      setItems(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'content');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredItems = items.filter(item => {
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'papers' && (item.type === 'pyq' || item.type === 'sample_paper')) ||
                      (selectedTab === 'notes' && item.type === 'note') ||
                      (selectedTab === 'mcqs' && item.type === 'mcq');
    
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSubject && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="p-4 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by topic, year or subject..."
              className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-2 bg-slate-50 text-slate-600 rounded-xl">
            <Filter size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          <TabButton active={selectedTab === 'all'} label="All Types" onClick={() => setSelectedTab('all')} />
          <TabButton active={selectedTab === 'papers'} label="Papers" onClick={() => setSelectedTab('papers')} />
          <TabButton active={selectedTab === 'notes'} label="Notes" onClick={() => setSelectedTab('notes')} />
          <TabButton active={selectedTab === 'mcqs'} label="MCQs" onClick={() => setSelectedTab('mcqs')} />
        </div>

        {/* Subject Selection */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                selectedSubject === subject 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 p-4 space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <h3 className="font-bold text-slate-800">No results found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Fab for Admin (Hidden for students) */}
      <div className="fixed bottom-24 right-5 z-40">
        <button className="w-14 h-14 bg-brand-600 text-white rounded-full shadow-lg shadow-brand-200 flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
}

function TabButton({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
        active ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-500'
      }`}
    >
      {label}
    </button>
  );
}

function ContentCard({ item }: { item: Content }) {
  const isPaper = item.type === 'pyq' || item.type === 'sample_paper';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex gap-4 hover:border-brand-200 transition-colors cursor-pointer group shadow-sm"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
        item.type === 'note' ? 'bg-vibrant-purple-bg text-vibrant-purple-text' :
        item.type === 'mcq' ? 'bg-vibrant-emerald-bg text-vibrant-emerald-text' :
        'bg-vibrant-pink-bg text-vibrant-pink-text'
      }`}>
        {item.type === 'note' ? <BookOpen size={20} /> :
         item.type === 'mcq' ? <Tag size={20} /> :
         <FileText size={20} />}
      </div>
 
      <div className="flex-1">
        <h3 className="text-xs font-black text-slate-800 line-clamp-1 uppercase tracking-tight">{item.title}</h3>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
          {item.subject} • {item.class} {item.year ? `• ${item.year}` : ''}
        </p>
      </div>
      
      <div className="flex items-center text-slate-300 group-hover:text-brand-600 transition-colors">
        <ChevronRight size={18} />
      </div>
    </motion.div>
  );
}
