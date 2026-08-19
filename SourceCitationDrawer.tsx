import React from 'react';
import { X, FileText, CheckCircle, ShieldAlert } from 'lucide-react';
import { DocumentChunk } from '../types';

interface SourceCitationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sources: DocumentChunk[];
  unlockedDay: number;
}

export const SourceCitationDrawer: React.FC<SourceCitationDrawerProps> = ({
  isOpen,
  onClose,
  sources,
  unlockedDay,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-xl z-50 flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Retrieved Source Citations</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Security Metadata Badge */}
      <div className="px-4 py-2.5 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-900 flex items-center gap-1.5 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Filter: day_id &lt;= {unlockedDay}
        </span>
        <span className="text-amber-600 font-bold">RAG Security Active</span>
      </div>

      {/* Citations List */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3.5">
        {sources.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-50 text-amber-500" />
            <p className="text-sm font-medium">No document chunks retrieved.</p>
            <p className="text-xs mt-1 text-slate-400">Unlock future days or ask specific questions about uploaded PDFs.</p>
          </div>
        ) : (
          sources.map((chunk, index) => (
            <div
              key={chunk.id || index}
              className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Day {chunk.dayId} PDF
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Page {chunk.pageNumber}</span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 truncate mb-1.5">{chunk.docName}</h4>

              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 font-serif italic">
                "{chunk.content}"
              </p>

              <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Course: {chunk.courseId}</span>
                <span>Chunk ID: {chunk.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
        Grounded strictly on authorized unlocked documents.
      </div>
    </div>
  );
};
