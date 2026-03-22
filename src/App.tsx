import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Search, 
  Bell, 
  MessageSquare, 
  Mic, 
  BarChart2, 
  Menu, 
  X, 
  ChevronRight, 
  Layout, 
  BookOpen, 
  Trophy,
  History,
  Maximize2,
  Minimize2,
  Sparkles,
  Send
} from 'lucide-react';
import { cn } from './lib/utils';
import { COURSES, MOCK_TESTS, Course } from './constants';
import { getTutorResponse } from './services/aiTutor';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

// --- Components ---

const Navbar = () => (
  <header className="fixed top-0 w-full z-50 glass-dark px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
        <Sparkles className="text-brand-primary w-6 h-6" />
      </div>
      <span className="font-display text-2xl font-black tracking-tighter text-white">SCHOLAR</span>
    </div>
    <div className="flex items-center gap-6">
      <button className="text-white/60 hover:text-white transition-colors">
        <Bell className="w-6 h-6" />
      </button>
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-primary/50">
        <img src="https://picsum.photos/seed/user/100/100" alt="User" referrerPolicy="no-referrer" />
      </div>
    </div>
  </header>
);

const CourseCard = ({ course, onPlay }: { course: Course, onPlay: (c: Course) => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="relative flex-none w-72 md:w-80 aspect-video rounded-2xl overflow-hidden cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onPlay(course)}
    >
      <img 
        src={course.thumbnail} 
        alt={course.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{course.category}</span>
          {course.stats && <span className="text-[10px] text-white/60">• {course.stats}</span>}
        </div>
        <h3 className="text-sm font-bold text-white line-clamp-1">{course.title}</h3>
        {course.progress > 0 && (
          <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-primary" 
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/40">
              <Play className="w-6 h-6 text-black fill-current ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AITutorPanel = ({ isOpen, onClose, context }: { isOpen: boolean, onClose: () => void, context?: string }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Hello! I'm your SSC AI Tutor. How can I help you excel today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setIsTyping(true);

    const response = await getTutorResponse(userMsg, context);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsTyping(false);
  };

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-full md:w-96 glass-dark z-[60] flex flex-col shadow-2xl"
    >
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Sparkles className="text-brand-primary w-5 h-5" />
          <h2 className="font-display font-bold text-lg">AI Personal Tutor</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "max-w-[85%] p-4 rounded-2xl text-sm",
            m.role === 'user' ? "bg-brand-primary/20 ml-auto text-white border border-brand-primary/30" : "bg-white/5 mr-auto text-white/90 border border-white/10"
          )}>
            {m.text}
          </div>
        ))}
        {isTyping && (
          <div className="bg-white/5 mr-auto p-4 rounded-2xl text-sm animate-pulse">
            AI is thinking...
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/10 space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {["Explain this", "Quiz me", "Summarize"].map(chip => (
            <button 
              key={chip}
              onClick={() => setInput(chip)}
              className="flex-none px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Type your doubt..."}
              className={cn(
                "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-brand-primary/50 transition-colors",
                isListening && "border-brand-primary/50 animate-pulse"
              )}
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-primary hover:scale-110 transition-transform"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={startListening}
            className={cn(
              "p-3 rounded-xl transition-all",
              isListening ? "bg-brand-primary text-black scale-110" : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <Mic className={cn("w-5 h-5", isListening && "animate-bounce")} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Analytics = () => {
  const radarData = [
    { subject: 'Quant', A: 120, fullMark: 150 },
    { subject: 'English', A: 98, fullMark: 150 },
    { subject: 'Reasoning', A: 86, fullMark: 150 },
    { subject: 'GK', A: 99, fullMark: 150 },
    { subject: 'Current Affairs', A: 85, fullMark: 150 },
  ];

  const activityData = [
    { name: 'Mon', hours: 2 },
    { name: 'Tue', hours: 4 },
    { name: 'Wed', hours: 3.5 },
    { name: 'Thu', hours: 5 },
    { name: 'Fri', hours: 4.5 },
    { name: 'Sat', hours: 6 },
    { name: 'Sun', hours: 3 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
      <div className="glass p-8 rounded-[2.5rem]">
        <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="text-brand-secondary w-5 h-5" />
          Subject Strength
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 12 }} />
              <Radar
                name="Performance"
                dataKey="A"
                stroke="#00daf3"
                fill="#00daf3"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass p-8 rounded-[2.5rem]">
        <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
          <BarChart2 className="text-brand-primary w-5 h-5" />
          Study Streak
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff60', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#00daf3' }}
              />
              <Bar dataKey="hours" fill="#00daf3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const resumeCourse = COURSES[0];

  return (
    <div className="min-h-screen bg-bg-dark selection:bg-brand-primary/30">
      <Navbar />

      <main className={cn(
        "transition-all duration-500",
        isTheaterMode ? "pt-0" : "pt-20 px-6 pb-32 max-w-7xl mx-auto"
      )}>
        
        {isTheaterMode && activeCourse ? (
          <div className="h-screen flex flex-col md:flex-row bg-black">
            <div className={cn(
              "relative transition-all duration-500",
              isAIOpen ? "w-full md:w-[70%]" : "w-full"
            )}>
              <div className="aspect-video bg-zinc-900 flex items-center justify-center group relative">
                <img 
                  src={activeCourse.thumbnail} 
                  className="w-full h-full object-cover opacity-50" 
                  alt="Video" 
                  referrerPolicy="no-referrer"
                />
                <Play className="w-20 h-20 text-white opacity-80 group-hover:scale-110 transition-transform cursor-pointer" />
                
                <div className="absolute top-6 left-6 flex items-center gap-4">
                  <button 
                    onClick={() => setIsTheaterMode(false)}
                    className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 rotate-180" />
                  </button>
                  <h2 className="text-xl font-bold">{activeCourse.title}</h2>
                </div>

                <div className="absolute bottom-6 right-6 flex items-center gap-4">
                  <button 
                    onClick={() => setIsAIOpen(!isAIOpen)}
                    className={cn(
                      "p-3 rounded-full transition-all",
                      isAIOpen ? "bg-brand-primary text-black" : "glass text-white"
                    )}
                  >
                    <Sparkles className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            
            <AnimatePresence>
              {isAIOpen && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "30%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden md:flex flex-col glass border-l border-white/10"
                >
                  <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                      <Sparkles className="text-brand-primary w-4 h-4" />
                      Live Doubts
                    </h3>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
                    <div className="bg-brand-primary/10 p-4 rounded-xl border border-brand-primary/20 text-sm text-brand-primary mb-4">
                      Ask anything about the current lecture. I'm watching with you!
                    </div>
                    {/* Chat messages would go here */}
                  </div>
                  <div className="p-6 border-t border-white/10">
                    <input 
                      placeholder="Ask a doubt..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative h-[500px] rounded-[3rem] overflow-hidden group mb-12">
              <img 
                src={resumeCourse.thumbnail} 
                alt="Hero" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-12 w-full max-w-3xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-secondary/20 border border-brand-secondary/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                    <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Resume Learning</span>
                  </div>
                  <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">
                    {resumeCourse.title}
                  </h1>
                  <div className="flex items-center gap-8">
                    <button 
                      onClick={() => {
                        setActiveCourse(resumeCourse);
                        setIsTheaterMode(true);
                      }}
                      className="flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/20"
                    >
                      <Play className="w-6 h-6 fill-current" />
                      CONTINUE WATCHING
                    </button>
                    <div className="flex-1 max-w-xs">
                      <div className="flex justify-between text-[10px] text-white/40 mb-2 font-bold uppercase tracking-widest">
                        <span>{resumeCourse.progress}% Complete</span>
                        <span>{resumeCourse.duration} total</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-brand-primary shadow-[0_0_10px_#00daf3]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${resumeCourse.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Content Discovery */}
            <section className="space-y-12">
              <div>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="font-display text-3xl font-bold tracking-tight">Trending Live Classes</h2>
                  <button className="text-brand-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
                  {COURSES.map(course => (
                    <div key={course.id}>
                      <CourseCard 
                        course={course} 
                        onPlay={(c) => {
                          setActiveCourse(c);
                          setIsTheaterMode(true);
                        }} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Tutor Promo */}
              <section className="relative overflow-hidden rounded-[3rem] p-12 glass group cursor-pointer" onClick={() => setIsAIOpen(true)}>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/10 blur-[100px] rounded-full group-hover:bg-brand-primary/20 transition-colors" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="space-y-6 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20">
                      <Sparkles className="text-brand-primary w-4 h-4" />
                      <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">AI Personal Tutor</span>
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl font-black leading-tight">
                      Stuck on a problem?<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                        Ask your AI Tutor.
                      </span>
                    </h2>
                    <p className="text-white/60 text-lg">
                      Get instant step-by-step explanations, personalized study plans, and voice-enabled doubt solving tailored for your SSC prep.
                    </p>
                    <div className="flex gap-4">
                      <button className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-white/5">
                        START CHATTING
                      </button>
                      <button className="glass px-8 py-4 rounded-2xl font-black text-sm">
                        VOICE MODE
                      </button>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 aspect-square glass rounded-3xl p-8 flex items-center justify-center relative">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary blur-2xl opacity-50 absolute"
                    />
                    <Sparkles className="w-32 h-32 text-white relative z-10" />
                  </div>
                </div>
              </section>

              {/* Mock Tests */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <h2 className="font-display text-3xl font-bold tracking-tight">Upcoming Mock Tests</h2>
                  <div className="space-y-4">
                    {MOCK_TESTS.map(test => (
                      <div key={test.id} className="glass p-6 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold text-white/40 uppercase">{test.date.split(' ')[0]}</span>
                            <span className="text-2xl font-black text-brand-primary">{test.date.split(' ')[1]}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{test.title}</h4>
                            <p className="text-white/40 text-sm mt-1">Starts at {test.time} • {test.registered} registered</p>
                          </div>
                        </div>
                        <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-black transition-all">
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="glass p-8 rounded-[3rem] flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">Previous Year Papers</h3>
                    <p className="text-white/40 text-sm">Real exam experience from the archives</p>
                  </div>
                  <div className="space-y-4 mt-8">
                    {["CGL 2023", "CHSL 2023", "MTS 2023"].map(paper => (
                      <button key={paper} className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-left hover:border-brand-primary/50 transition-colors flex justify-between items-center group">
                        <span className="font-bold">{paper}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analytics Section */}
              <Analytics />
            </section>
          </>
        )}
      </main>

      {/* Navigation & AI Floating Button */}
      {!isTheaterMode && (
        <>
          <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-dark px-8 py-4 rounded-full flex items-center gap-12 shadow-2xl z-50">
            <button className="text-brand-primary flex flex-col items-center gap-1">
              <Layout className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
            </button>
            <button className="text-white/40 hover:text-white transition-colors flex flex-col items-center gap-1">
              <BookOpen className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Courses</span>
            </button>
            <button className="text-white/40 hover:text-white transition-colors flex flex-col items-center gap-1">
              <BarChart2 className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Stats</span>
            </button>
            <button className="text-white/40 hover:text-white transition-colors flex flex-col items-center gap-1">
              <Menu className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Menu</span>
            </button>
          </nav>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAIOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-brand-primary text-black flex items-center justify-center shadow-2xl shadow-brand-primary/40 z-50"
          >
            <Sparkles className="w-8 h-8" />
          </motion.button>
        </>
      )}

      <AITutorPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} context={activeCourse?.title} />
    </div>
  );
}
