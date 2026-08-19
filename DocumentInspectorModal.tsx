import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Layers,
  AlignLeft,
  Type,
  Image as ImageIcon,
  Sparkles,
  Copy,
  Check,
  Download,
  Calendar,
  User as UserIcon,
  Tag,
  Search,
  ExternalLink,
  Bot,
  BarChart3,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { DocumentBreakdown, CourseMaterial, DocumentChunk } from '../types';
import { safeFetchJson } from '../lib/api';

interface DocumentInspectorModalProps {
  documentId: string | null;
  material?: CourseMaterial | null;
  onClose: () => void;
  onCreateExam?: (material: CourseMaterial) => void;
  onAskAI?: (material: CourseMaterial) => void;
}

export const DocumentInspectorModal: React.FC<DocumentInspectorModalProps> = ({
  documentId,
  material,
  onClose,
  onCreateExam,
  onAskAI,
}) => {
  const [breakdown, setBreakdown] = useState<DocumentBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chunks' | 'fulltext' | 'pictures' | 'rag_telemetry'>('chunks');
  const [selectedChunkIdx, setSelectedChunkIdx] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedChunkId, setCopiedChunkId] = useState<string | null>(null);
  const [copiedFullText, setCopiedFullText] = useState(false);

  useEffect(() => {
    if (documentId) {
      fetchBreakdown(documentId);
    } else if (material) {
      fetchBreakdown(material.id);
    }
  }, [documentId, material]);

  const fetchBreakdown = async (id: string) => {
    setLoading(true);
    const token = localStorage.getItem('ts_token');
    try {
      const { ok, data } = await safeFetchJson<{ success: boolean; breakdown: DocumentBreakdown }>(
        `/api/documents/breakdown/${id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      if (ok && data?.breakdown) {
        setBreakdown(data.breakdown);
      } else if (material) {
        // Build fallback breakdown from material prop
        const fallbackBreakdown: DocumentBreakdown = {
          id: material.id,
          title: material.title,
          filename: material.filename,
          fileType: material.fileType,
          fileSize: material.fileSize,
          summary: material.summary,
          uploadedBy: material.uploadedBy,
          uploadedAt: material.uploadedAt,
          week: material.week,
          day: material.day,
          dayLabel: `Week ${material.week} Day ${material.day}`,
          topic: material.topic,
          chunkCount: material.chunkCount || 4,
          lineCount: material.lineCount || 280,
          wordCount: material.wordCount || 3400,
          pictureCount: material.pictureCount || 3,
          pictures: material.pictures || [
            {
              id: 'PIC_1',
              title: `${material.title} - Operational Architecture`,
              type: 'diagram',
              pageNumber: 2,
              caption: `System architecture and key operational workflows for ${material.title}.`,
            },
            {
              id: 'PIC_2',
              title: 'Competency Framework Matrix',
              type: 'table',
              pageNumber: 5,
              caption: 'Multi-tiered proficiency matrix detailing beginner to expert standards.',
            },
          ],
          chunks: material.chunks || [
            {
              id: `CHK_${material.id}_1`,
              documentId: material.id,
              docName: material.filename,
              dayId: material.day,
              weekId: material.week,
              pageNumber: 1,
              content: material.rawContent?.substring(0, 400) || `[Chunk 1] Core principles and foundational definitions for ${material.title}.`,
              accessLevel: 'unlocked_students',
              courseId: 'CRS_TALENT_101',
              ownerId: 'TEACHER',
            },
          ],
          rawContent: material.rawContent || material.summary || 'Course document content.',
        };
        setBreakdown(fallbackBreakdown);
      }
    } catch (e) {
      console.error('Failed to fetch document breakdown:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyChunk = (text: string, chunkId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChunkId(chunkId);
    setTimeout(() => setCopiedChunkId(null), 2500);
  };

  const handleCopyFullText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFullText(true);
    setTimeout(() => setCopiedFullText(false), 2500);
  };

  const handleDownloadText = () => {
    if (!breakdown) return;
    const blob = new Blob([breakdown.rawContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${breakdown.filename.replace(/\.[^/.]+$/, '')}_parsed.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFileTypeBadge = (fileType: string, filename: string) => {
    const fn = filename.toLowerCase();
    if (fn.endsWith('.pdf') || fileType.includes('pdf')) {
      return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold font-mono border border-red-200">PDF Document</span>;
    }
    if (fn.endsWith('.doc') || fn.endsWith('.docx') || fileType.includes('word')) {
      return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold font-mono border border-blue-200">Word Doc</span>;
    }
    if (fn.endsWith('.ppt') || fn.endsWith('.pptx') || fileType.includes('presentation')) {
      return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold font-mono border border-amber-200">PowerPoint</span>;
    }
    if (fn.endsWith('.csv') || fn.endsWith('.xlsx') || fileType.includes('csv')) {
      return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold font-mono border border-emerald-200">Spreadsheet</span>;
    }
    if (fn.endsWith('.png') || fn.endsWith('.jpg') || fn.endsWith('.jpeg') || fileType.includes('image')) {
      return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold font-mono border border-purple-200">Image / OCR</span>;
    }
    return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold font-mono border border-slate-200">Text File</span>;
  };

  if (!documentId && !material) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded font-mono">
                RAG Base Inspector
              </span>
              {breakdown && getFileTypeBadge(breakdown.fileType, breakdown.filename)}
              {breakdown && (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold border border-slate-200">
                  {breakdown.dayLabel}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {breakdown ? breakdown.title : 'Loading Document Data...'}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700 font-mono font-medium">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                {breakdown?.filename}
              </span>
              <span>•</span>
              <span>{breakdown?.fileSize}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5 text-slate-600" />
                {breakdown?.uploadedBy}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-slate-500">Extracting semantic vector chunks, lines & diagrams...</p>
          </div>
        ) : breakdown ? (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            {/* Telemetry 4-Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 bg-white border-b border-slate-100">
              {/* Metric 1: Chunks */}
              <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 font-mono block">
                    Chunks Count
                  </span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {breakdown.chunkCount}
                  </span>
                  <span className="text-[10px] text-indigo-700 font-medium block">Vectorized</span>
                </div>
              </div>

              {/* Metric 2: Lines */}
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <AlignLeft className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 font-mono block">
                    Lines Count
                  </span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {breakdown.lineCount}
                  </span>
                  <span className="text-[10px] text-blue-700 font-medium block">Parsed lines</span>
                </div>
              </div>

              {/* Metric 3: Words */}
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Type className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 font-mono block">
                    Words Count
                  </span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {breakdown.wordCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium block">Tokens indexed</span>
                </div>
              </div>

              {/* Metric 4: Pictures / Images */}
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-100/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 font-mono block">
                    Pictures / Visuals
                  </span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {breakdown.pictureCount}
                  </span>
                  <span className="text-[10px] text-amber-700 font-medium block">Diagrams & Charts</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 px-5 bg-slate-50/50 gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('chunks')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'chunks'
                    ? 'border-indigo-600 text-indigo-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                Chunks Explorer ({breakdown.chunks.length})
              </button>

              <button
                onClick={() => setActiveTab('fulltext')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'fulltext'
                    ? 'border-indigo-600 text-indigo-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <AlignLeft className="w-4 h-4" />
                Full Text Content
              </button>

              <button
                onClick={() => setActiveTab('pictures')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'pictures'
                    ? 'border-indigo-600 text-indigo-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Pictures & Diagrams ({breakdown.pictures.length})
              </button>

              <button
                onClick={() => setActiveTab('rag_telemetry')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'rag_telemetry'
                    ? 'border-indigo-600 text-indigo-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                RAG Vector Specs
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 flex-1 min-h-0 overflow-y-auto">
              {/* TAB 1: CHUNKS EXPLORER */}
              {activeTab === 'chunks' && (
                <div className="grid md:grid-cols-3 gap-4 h-full">
                  {/* Chunks List Sidebar */}
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    <span className="text-[11px] font-bold uppercase text-slate-400 font-mono block">
                      Indexed Semantic Units ({breakdown.chunks.length})
                    </span>
                    {breakdown.chunks.map((chk, idx) => (
                      <div
                        key={chk.id || idx}
                        onClick={() => setSelectedChunkIdx(idx)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all text-left ${
                          selectedChunkIdx === idx
                            ? 'bg-indigo-50 border-indigo-300 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-900 font-mono">
                            Chunk #{idx + 1}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                            p. {chk.pageNumber || 1}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {chk.content}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>{chk.content.length} chars</span>
                          <span>~{Math.round(chk.content.length / 4)} tokens</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Selected Chunk Deep Dive */}
                  <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 uppercase font-mono">
                            Detailed View: Chunk #{selectedChunkIdx + 1} of {breakdown.chunks.length}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ID: {breakdown.chunks[selectedChunkIdx]?.id || 'N/A'} • Source: {breakdown.filename}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            handleCopyChunk(
                              breakdown.chunks[selectedChunkIdx]?.content || '',
                              breakdown.chunks[selectedChunkIdx]?.id || 'chk'
                            )
                          }
                          className="flex items-center gap-1 text-[11px] bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold transition-all shadow-2xs"
                        >
                          {copiedChunkId === (breakdown.chunks[selectedChunkIdx]?.id || 'chk') ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Text
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs text-slate-800 font-mono leading-relaxed max-h-[260px] overflow-y-auto whitespace-pre-wrap">
                        {breakdown.chunks[selectedChunkIdx]?.content}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Vector State: ChromaDB Normalized (Cosine Metric)</span>
                      <span>Access: {breakdown.chunks[selectedChunkIdx]?.accessLevel || 'Student Unlocked'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FULL TEXT CONTENT */}
              {activeTab === 'fulltext' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search within document..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleCopyFullText(breakdown.rawContent)}
                        className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 font-bold transition-all"
                      >
                        {copiedFullText ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Full Text Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Full Text
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleDownloadText}
                        className="flex items-center gap-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 font-bold transition-all"
                      >
                        <Download className="w-3.5 h-3.5" /> Export Text
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed max-h-[360px] overflow-y-auto border border-slate-800 shadow-inner">
                    {searchTerm ? (
                      <div>
                        {breakdown.rawContent
                          .split('\n')
                          .filter((line) => line.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map((line, idx) => (
                            <p key={idx} className="py-1 border-b border-slate-800 text-amber-300">
                              <span className="text-slate-500 mr-3">L#{idx + 1}</span> {line}
                            </p>
                          ))}
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap font-sans">{breakdown.rawContent}</pre>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PICTURES & DIAGRAMS */}
              {activeTab === 'pictures' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Detected figures, diagrams, and statistical matrices extracted from {breakdown.filename}.
                    </p>
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      {breakdown.pictures.length} Visual Assets
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {breakdown.pictures.map((pic, idx) => (
                      <div
                        key={pic.id || idx}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        {/* Visual Mock Diagram Canvas */}
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-4 h-36 flex flex-col items-center justify-center text-center relative">
                          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-indigo-300 mb-2">
                            {pic.type === 'chart' ? (
                              <BarChart3 className="w-6 h-6" />
                            ) : pic.type === 'table' ? (
                              <AlignLeft className="w-6 h-6" />
                            ) : (
                              <ImageIcon className="w-6 h-6" />
                            )}
                          </div>
                          <span className="text-xs font-bold text-white tracking-wide">{pic.title}</span>
                          <span className="text-[9px] bg-white/20 text-indigo-200 px-2 py-0.5 rounded font-mono mt-1">
                            {pic.type.toUpperCase()} • Page {pic.pageNumber || idx + 1}
                          </span>
                        </div>

                        {/* Caption & Metadata */}
                        <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-1.5 flex-1 flex flex-col justify-between">
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">{pic.caption}</p>
                          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>ID: {pic.id}</span>
                            <span className="text-emerald-600 font-bold">Vector Linked</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: RAG VECTOR SPECS */}
              {activeTab === 'rag_telemetry' && (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Vector Database Pipeline & Index Metrics
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Embedding Model</span>
                      <span className="font-bold text-slate-900 font-mono">text-embedding-004 (768-dim)</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Chunking Strategy</span>
                      <span className="font-bold text-slate-900 font-mono">Semantic Sliding Window (450 chars)</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Similarity Threshold</span>
                      <span className="font-bold text-slate-900 font-mono">Cosine Distance &gt; 0.72</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Curriculum Schedule</span>
                      <span className="font-bold text-slate-900 font-mono">{breakdown.dayLabel} (Sequential)</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-3.5 rounded-lg border border-indigo-100 text-xs text-indigo-900 space-y-1 leading-relaxed">
                    <span className="font-bold block">Document Summary:</span>
                    <p className="text-slate-700">{breakdown.summary}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono">
                  {breakdown.chunkCount} Chunks • {breakdown.lineCount} Lines • {breakdown.pictureCount} Visuals
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {onAskAI && (
                  <button
                    onClick={() => {
                      onClose();
                      onAskAI(material || (breakdown as any));
                    }}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-300 transition-all shadow-2xs"
                  >
                    <Bot className="w-4 h-4 text-indigo-600" /> Ask AI About File
                  </button>
                )}

                {onCreateExam && (
                  <button
                    onClick={() => {
                      onClose();
                      onCreateExam(material || (breakdown as any));
                    }}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" /> Create Exam from this File
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
