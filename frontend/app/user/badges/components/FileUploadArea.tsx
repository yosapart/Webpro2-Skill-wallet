import React, { RefObject } from 'react';
import { Upload, FileText, FileArchive, X } from 'lucide-react';

interface FileUploadAreaProps {
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  addFiles: (files: FileList | null) => void;
  uploadedFiles: { id: string; file: File }[];
  removeFile: (id: string) => void;
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  fileInputRef,
  addFiles,
  uploadedFiles,
  removeFile,
}) => {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip,.pdf"
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-5 sm:p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group ${
          isDragging
            ? 'border-[#ff4f40]/60 bg-[#ff4f40]/5'
            : 'border-white/5 hover:bg-white/2 hover:border-[#ff4f40]/20'
        }`}
      >
        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'text-[#ff4f40]' : 'text-slate-500 group-hover:text-[#ff4f40]'}`}>
          <Upload size={20} />
        </div>
        <div className="text-center">
          <p className="font-bold text-xs sm:text-sm text-slate-300">
            {isDragging ? 'Drop files here' : 'Upload Project Artifacts (.zip, .pdf)'}
          </p>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Max file size: 10MB</p>
        </div>
      </div>

      {/* File list */}
      {uploadedFiles.length > 0 && (
        <ul className="flex flex-col gap-2 mt-4">
          {uploadedFiles.map(({ file, id }) => (
            <li key={id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-[#ff4f40]/70 shrink-0">
                {file.name.endsWith('.pdf') ? <FileText size={15} /> : <FileArchive size={15} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-300 font-semibold truncate text-left">{file.name}</p>
                <p className="text-[10px] text-slate-600 mt-0.5 text-left">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(id); }}
                className="text-slate-600 hover:text-slate-300 transition-colors shrink-0 cursor-pointer"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
