import React, { useState, useEffect } from 'react';
import {
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  FileText,
  Loader2,
  RefreshCw,
  Filter,
  Calendar,
  Layers,
  Database,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
  Cpu,
  BookOpen
} from 'lucide-react';
import { ChatMessage, DocumentChunk } from '../types';
import { SourceCitationDrawer } from './SourceCitationDrawer';
import { OcrUploader } from './OcrUploader';
import { safeFetchJson } from '../lib/api';

interface ChatbotProps {
  unlockedDay: number;
  initialTargetDay?: number;
  initialTargetWeek?: number;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  unlockedDay,
  initialTargetDay,
  initialTargetWeek,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>(initialTargetWeek || 'all');
  const [selectedDay, setSelectedDay] = useState<number | 'all'>(initialTargetDay || 'all');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [activeSources, setActiveSources] = useState<DocumentChunk[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const getDayLabel = (dNum: number) => {
    const w = Math.ceil(dNum / 5);
    const dInW = ((dNum - 1) % 5) + 1;
    const name = dayNames[dInW - 1] || 'Day';
    return `Week ${w} Day ${dInW} (${name})`;
  };

  const currentSelectionLabel =
    selectedDay !== 'all'
      ? getDayLabel(Number(selectedDay))
      : selectedWeek !== 'all'
      ? `Week ${selectedWeek} Materials`
      : `All Unlocked Materials (Day 1 to ${unlockedDay})`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'MSG_INIT',
      sender: 'ai',
      text: `Hello! I am **TalentSphere AI**, powered by high-speed AI Intelligence & ChromaDB vector grounding.\n\nYou have active access to **Day 1 to ${unlockedDay}** of your 20-day curriculum. Use the **Week & Day selector** at the top to target specific syllabus PDFs or ask questions across all unlocked materials!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([
    'What are the core metrics for Continuous Performance Appraisal & OKRs?',
    'Summarize key takeaways from the unlocked study PDFs.',
    'How do predictive AI models forecast student retention and skill mastery?',
    'What is the formula for calculating 9-Box Talent Grid potential scores?',
  ]);

  // Update suggestions whenever selectedDay changes
  useEffect(() => {
    if (selectedDay !== 'all') {
      const dayNum = Number(selectedDay);
      const label = getDayLabel(dayNum);
      setDynamicSuggestions([
        `Summarize the key takeaways and formulas from ${label}.`,
        `What are the most important practical exam questions for ${label}?`,
        `How does ${label} topic connect with enterprise performance systems?`,
        `Explain the core vector chunk definitions in Day ${dayNum} PDF.`,
      ]);
    } else if (selectedWeek !== 'all') {
      setDynamicSuggestions([
        `Provide a comprehensive study summary for Week ${selectedWeek}.`,
        `What are the major competencies covered in Week ${selectedWeek} (Days ${(Number(selectedWeek) - 1) * 5 + 1}-${Number(selectedWeek) * 5})?`,
        `How do Week ${selectedWeek} concepts prepare students for lead mentor reviews?`,
      ]);
    } else {
      setDynamicSuggestions([
        'What are the core metrics for Continuous Performance Appraisal & OKRs?',
        `Summarize all unlocked study PDFs up to Day ${unlockedDay}.`,
        'How do predictive AI models forecast student retention and skill mastery?',
        'What is the formula for calculating 9-Box Talent Grid potential scores?',
      ]);
    }
  }, [selectedDay, selectedWeek, unlockedDay]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() && !ocrText) return;

    const userMsg: ChatMessage = {
      id: 'MSG_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ocrText: ocrText || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('ts_token');
      const { ok, data } = await safeFetchJson('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: query,
          ocrText: ocrText || undefined,
          targetWeek: selectedWeek !== 'all' ? selectedWeek : undefined,
          targetDay: selectedDay !== 'all' ? selectedDay : undefined,
          targetDayLabel: currentSelectionLabel,
        }),
      });

      const aiMsg: ChatMessage = {
        id: 'MSG_' + (Date.now() + 1),
        sender: 'ai',
        text: ok && data?.answer ? data.answer : data?.error || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data?.sources || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (data?.sources && data.sources.length > 0) {
        setActiveSources(data.sources);
      }
      if (data?.recommendedQuestions && data.recommendedQuestions.length > 0) {
        setDynamicSuggestions(data.recommendedQuestions);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'MSG_ERR_' + Date.now(),
          sender: 'ai',
          text: 'Connection error while contacting TalentSphere AI.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
      setOcrText('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col h-[760px] relative overflow-hidden">
      {/* Top Header Banner with Antigravity & Gemini Ambient Glow */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/20 text-white flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-0.5 shadow-md shadow-indigo-500/30 animate-antigravity">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base tracking-tight">TalentSphere AI</h3>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  AI Vector RAG Grounding
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Vector Grounded on 20-Day Curriculum & OCR Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'MSG_CLEAR',
                    sender: 'ai',
                    text: `Chat session reset. Ready to answer questions from **${currentSelectionLabel}**.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Clear Chat History"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TOP WEEK & DAY ACADEMIC SELECTOR BAR */}
        <div className="bg-slate-950/70 border border-indigo-500/30 rounded-xl p-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-300">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>GROUNDING SCOPE:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Week Selector */}
            <select
              value={selectedWeek}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setSelectedWeek(val);
                if (val !== 'all') setSelectedDay('all');
              }}
              className="bg-slate-900 text-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-400 cursor-pointer"
            >
              <option value="all">All Weeks (1–4)</option>
              <option value={1}>Week 1 (Days 1–5)</option>
              <option value={2}>Week 2 (Days 6–10)</option>
              <option value={3}>Week 3 (Days 11–15)</option>
              <option value={4}>Week 4 (Days 16–20)</option>
            </select>

            {/* Day Selector */}
            <select
              value={selectedDay}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setSelectedDay(val);
                if (val !== 'all') {
                  const w = Math.ceil(Number(val) / 5);
                  setSelectedWeek(w);
                }
              }}
              className="bg-slate-900 text-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-400 cursor-pointer"
            >
              <option value="all">All Unlocked Days (Day 1–{unlockedDay})</option>
              {Array.from({ length: 20 }).map((_, i) => {
                const dayNum = i + 1;
                const isUnlocked = dayNum <= unlockedDay;
                return (
                  <option key={dayNum} value={dayNum} disabled={!isUnlocked}>
                    {isUnlocked ? '🔓' : '🔒'} {getDayLabel(dayNum)} {isUnlocked ? '' : '(Locked)'}
                  </option>
                );
              })}
            </select>

            {/* Scope Active Indicator Chip */}
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-md font-bold truncate max-w-[200px]">
              {currentSelectionLabel}
            </span>
          </div>
        </div>
      </div>

      {/* OCR Uploader Bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
        <OcrUploader onOcrExtracted={(text) => setOcrText(text)} />
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAFC]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gradient-to-tr from-amber-500 to-indigo-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                }`}
              >
                {msg.ocrText && (
                  <div className="mb-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>OCR Diagram Context Attached</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                {/* Grounded Source Citations */}
                {msg.sender === 'ai' && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                      <Database className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{msg.sources.length} Grounded Source Chunks Cited</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveSources(msg.sources || []);
                        setDrawerOpen(true);
                      }}
                      className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-200 font-bold flex items-center gap-1.5 transition-all cursor-pointer touch-effect"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      View Cited Documents & Quotes
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 block font-mono px-1">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 items-center text-xs text-indigo-700 bg-indigo-50 p-3 rounded-xl border border-indigo-200 w-fit shadow-xs animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>
              TalentSphere AI searching vector chunks in <strong>{currentSelectionLabel}</strong>...
            </span>
          </div>
        )}
      </div>

      {/* Dynamic Recommended Questions Strip */}
      <div className="px-3.5 py-2.5 bg-slate-100/70 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 shrink-0 font-mono">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>SUGGESTED:</span>
        </div>
        {dynamicSuggestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-xs whitespace-nowrap bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-all shrink-0 font-medium cursor-pointer touch-effect"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask question about ${currentSelectionLabel}...`}
          className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 text-xs px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || (!input.trim() && !ocrText)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-3 rounded-xl disabled:opacity-50 transition-all font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 text-xs cursor-pointer touch-effect"
        >
          <Send className="w-4 h-4" />
          <span>Ask AI</span>
        </button>
      </div>

      {/* Source Citation Drawer Overlay */}
      <SourceCitationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sources={activeSources}
        unlockedDay={unlockedDay}
      />
    </div>
  );
};
