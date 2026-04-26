'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, AlertTriangle, CheckCircle2, ShieldAlert, Globe, MessageSquare, Copy, Share2, Sparkles, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GOALS = ['Professional', 'Romantic', 'Argument', 'Negotiation'];

const TONES = [
  "Professional", "Direct", "Empathetic", "Persuasive", "Apologetic", "Visionary", "Analytical", "Objective", "Diplomatic", "Enthusiastic",
  "Charming", "Reassuring", "Confident", "Humble", "Assertive", "Collaborative", "Constructive", "Encouraging", "Firm", "Friendly",
  "Formal", "Informal", "Inspirational", "Logical", "Motivating", "Neutral", "Optimistic", "Passionate", "Patient", "Polite",
  "Respectful", "Sincere", "Sympathetic", "Tactful", "Thoughtful", "Urgent", "Warm", "Welcoming", "Authoritative", "Candid",
  "Casual", "Cautious", "Cheerful", "Compassionate", "Conciliatory", "Conversational", "Courteous", "Decisive", "Earnest", "Factual"
];

interface AuditResult {
  tone: string;
  socialRisk: string;
  culturalAudit: string;
  fixes: string;
  riskCount: number;
}

export default function TactApp() {
  const [text, setText] = useState('');
  const [goal, setGoal] = useState(GOALS[0]);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [maxTokens, setMaxTokens] = useState<number>(1000);
  
  const [isAuditing, setIsAuditing] = useState(false);
  const [currentAudit, setCurrentAudit] = useState<AuditResult | null>(null);
  const [error, setError] = useState('');

  // Dropdown states
  const [isToneMenuOpen, setIsToneMenuOpen] = useState(false);
  const [toneSearch, setToneSearch] = useState('');
  const toneMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toneMenuRef.current && !toneMenuRef.current.contains(event.target as Node)) {
        setIsToneMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAudit = async () => {
    if (!text.trim()) {
      setError('Please enter some text to audit.');
      return;
    }
    
    setError('');
    setIsAuditing(true);
    setCurrentAudit(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          goal,
          tones: selectedTones,
          maxTokens
        }),
      });

      if (!response.ok) {
        let errStr = "Failed to audit text";
        try {
           const errData = await response.json();
           errStr = errData.error || errStr;
        } catch(e) {}
        throw new Error(errStr);
      }

      const result: AuditResult = await response.json();
      setCurrentAudit(result);

    } catch (err: any) {
      setError(err.message || 'An error occurred during the audit.');
    } finally {
      setIsAuditing(false);
    }
  };

  const toggleTone = (tone: string) => {
    setSelectedTones(prev => {
      if (prev.includes(tone)) return prev.filter(t => t !== tone);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, tone];
    });
  };

  const handleCopy = () => {
    if (currentAudit?.fixes) {
      navigator.clipboard.writeText(currentAudit.fixes);
    }
  };

  const handleShare = async () => {
    if (currentAudit?.fixes && navigator.share) {
      try {
        await navigator.share({
          title: 'TACT - Audited Message',
          text: currentAudit.fixes
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
       handleCopy();
       alert("Copied to clipboard!");
    }
  };

  const filteredTones = TONES.filter(t => t.toLowerCase().includes(toneSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Header */}
      <header className="border-b border-white/10 p-6 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center font-display font-bold text-xl tracking-tighter">
            T
          </div>
          <h1 className="font-display font-bold text-2xl tracking-tight">TACT</h1>
        </div>
        <div className="text-sm text-yellow-400 font-semibold tracking-widest uppercase flex items-center gap-2">
           <Sparkles className="w-4 h-4" /> Power Mode (Free)
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 py-12 md:py-20">
        {/* Hero Section */}
        <div className="space-y-8 mb-16">
          <div className="space-y-4">
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter leading-[1]">
              Audit your business &<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                high-stakes
              </span> messages.
            </h2>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl font-light">
              Don't let a misunderstood tone ruin a deal. Paste your message, add your personal vibe, and let AI fix it instantly.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-yellow-400 rounded-2xl blur opacity-20 transition duration-500"></div>
              
              <div className="relative bg-[#111111] border border-white/10 rounded-2xl flex flex-col focus-within:border-purple-500/50 transition-colors">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your email or message here..."
                  className="w-full h-56 bg-transparent p-6 text-lg md:text-xl font-light resize-none focus:outline-none placeholder:text-white/20"
                />
                
                {/* Textarea Bottom Action Bar */}
                <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between relative bg-[#0a0a0a] rounded-b-2xl">
                  
                  {/* Select Tone Button & Popover */}
                  <div className="relative" ref={toneMenuRef}>
                    <button 
                      onClick={() => setIsToneMenuOpen(!isToneMenuOpen)}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-white/80"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      {selectedTones.length === 0 ? "Add Personalisation" : `${selectedTones.length} Vibe${selectedTones.length > 1 ? 's' : ''} Selected`}
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>

                    <AnimatePresence>
                      {isToneMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-full left-0 mb-3 w-[320px] sm:w-[400px] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                        >
                          <div className="p-3 border-b border-white/10">
                            <input 
                              type="text" 
                              placeholder="Search 50+ tones..." 
                              value={toneSearch}
                              onChange={(e) => setToneSearch(e.target.value)}
                              className="w-full bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500/50"
                            />
                          </div>
                          <div className="p-3 overflow-y-auto max-h-[250px] flex flex-wrap gap-2 custom-scrollbar">
                            {filteredTones.map(t => {
                              const isSelected = selectedTones.includes(t);
                              return (
                                <button
                                  key={t}
                                  onClick={() => toggleTone(t)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                                    isSelected 
                                    ? 'bg-purple-600 border-purple-500 text-white' 
                                    : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                  }`}
                                >
                                  {t}
                                </button>
                              );
                            })}
                            {filteredTones.length === 0 && <span className="text-white/40 text-sm p-2">No tones found.</span>}
                          </div>
                          <div className="p-2 border-t border-white/10 text-center text-xs text-white/40">
                            Select up to 3 tones
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 group hidden sm:flex">
                        <label className="text-xs text-white/40 group-hover:text-white/60 transition-colors">Max Output Length:</label>
                        <input 
                           type="range" 
                           min="100" max="2000" step="50"
                           value={maxTokens}
                           onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                           className="w-24 accent-purple-500 bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-white/60 font-mono w-8">{maxTokens}</span>
                     </div>
                     <span className="text-xs text-white/30 font-mono">{text.length} chars</span>
                  </div>

                </div>
              </div>
            </div>

            {/* Selected Tones Chips */}
            {selectedTones.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTones.map(tone => (
                  <span key={tone} className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30">
                    {tone}
                    <button onClick={() => toggleTone(tone)} className="hover:bg-purple-500/30 rounded-full p-0.5"><X className="w-3 h-3 hover:text-white" /></button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
              <div className="space-y-3 w-full sm:w-auto">
                <label className="text-xs uppercase tracking-widest text-white/40 font-semibold">Context / Goal</label>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        goal === g 
                          ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                          : 'bg-[#111111] text-white/60 border border-white/10 hover:border-white/30'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAudit}
                disabled={isAuditing || !text.trim()}
                className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAuditing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Audit Message'
                )}
              </button>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {currentAudit && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 text-yellow-400">
                     <ShieldAlert className="w-5 h-5" />
                     <h3 className="font-semibold tracking-wide">Risks Found</h3>
                  </div>
                  <p className="text-4xl font-display font-bold">{currentAudit.riskCount}</p>
                </div>
                
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 text-purple-400">
                    <MessageSquare className="w-5 h-5" />
                    <h3 className="font-semibold tracking-wide">Tone Analysis</h3>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{currentAudit.tone}</p>
                </div>

                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 text-blue-400">
                    <Globe className="w-5 h-5" />
                    <h3 className="font-semibold tracking-wide">Cultural Audit</h3>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{currentAudit.culturalAudit}</p>
                </div>
              </div>

              <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <h3 className="font-display text-2xl font-bold flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    Tactful Fixes
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      <Copy className="w-4 h-4" /> Copy
                    </button>
                    <button 
                      onClick={handleShare}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                   <div className="text-lg leading-relaxed text-white/90 whitespace-pre-wrap font-light">
                      {currentAudit.fixes}
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Custom styles for the scrollbar inside the tone menu */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}} />
    </div>
  );
}
