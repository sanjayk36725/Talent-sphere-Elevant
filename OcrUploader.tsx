import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, CheckCircle, FileText, X } from 'lucide-react';
import { safeFetchJson } from '../lib/api';

interface OcrUploaderProps {
  onOcrExtracted: (text: string) => void;
}

export const OcrUploader: React.FC<OcrUploaderProps> = ({ onOcrExtracted }) => {
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const { ok, data } = await safeFetchJson('/api/ocr-upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('ts_token')}`,
          },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/jpeg',
          }),
        });
        if (ok && data?.success && data?.text) {
          setExtractedText(data.text);
          onOcrExtracted(data.text);
        } else {
          setExtractedText(data?.error || 'Failed to extract text from image.');
        }
      } catch (err) {
        setExtractedText('OCR Extraction failed.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-amber-500" />
          OCR Engine — Diagram & Flowchart Context
        </span>
        {extractedText && (
          <button
            onClick={() => {
              setExtractedText(null);
              setFileName(null);
              onOcrExtracted('');
            }}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Clear OCR
          </button>
        )}
      </div>

      {!extractedText ? (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-lg p-2.5 cursor-pointer transition-all bg-slate-50 hover:bg-slate-100">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={loading}
          />
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium py-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              Parsing image text via OCR Engine...
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 font-medium">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Upload Diagram, Flowchart, or Screenshot for OCR Context</span>
            </div>
          )}
        </label>
      ) : (
        <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200 text-xs">
          <div className="flex items-center justify-between mb-1 text-emerald-700 font-semibold">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> OCR Extracted from {fileName}
            </span>
            <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded text-emerald-800 font-bold">Ready for Chat</span>
          </div>
          <p className="text-slate-700 text-[11px] font-mono leading-relaxed max-h-20 overflow-y-auto italic">
            "{extractedText}"
          </p>
        </div>
      )}
    </div>
  );
};
