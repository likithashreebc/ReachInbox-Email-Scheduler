import { useRef, useState } from 'react';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils';
import { parseEmailsFromText } from '@/utils';

interface FileUploadProps {
  onEmails: (emails: string[]) => void;
  emails: string[];
  onClear: () => void;
}

export function FileUpload({ onEmails, emails, onClear }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseEmailsFromText(text);
      if (parsed.length === 0) {
        setError('No valid email addresses detected in this file.');
        setFileName(null);
      } else {
        onEmails(parsed);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  if (emails.length > 0 && fileName) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg">
        <CheckCircle2 size={16} className="text-[#16a34a] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#0a0a0a]">{emails.length.toLocaleString()} email addresses detected</p>
          <p className="text-xs text-[#737373] truncate">{fileName}</p>
        </div>
        <button onClick={() => { onClear(); setFileName(null); }} className="text-[#a3a3a3] hover:text-[#525252] transition-colors">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-150',
          dragging ? 'border-[#4f46e5] bg-[#eef2ff]' : 'border-[#e5e5e5] bg-[#fafafa] hover:border-[#d4d4d4] hover:bg-[#f5f5f5]'
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-white border border-[#e5e5e5] flex items-center justify-center">
          {dragging ? <FileText size={15} className="text-[#4f46e5]" /> : <Upload size={15} className="text-[#a3a3a3]" />}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-[#0a0a0a]">
            {dragging ? 'Drop your file here' : 'Drop CSV here or browse'}
          </p>
          <p className="text-xs text-[#a3a3a3] mt-0.5">CSV or TXT · One email per line or comma-separated</p>
        </div>
      </div>
      {error && <p className="text-xs text-[#dc2626] mt-1.5">{error}</p>}
      <input ref={inputRef} type="file" accept=".csv,.txt" onChange={handleChange} className="hidden" />
    </div>
  );
}
