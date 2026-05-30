import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Cpu, Edit3 } from 'lucide-react';
import { ProjectService } from '../../../../services/project.service';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  initialData: any;
  onRefresh: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  type,
  initialData,
  onRefresh
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.cover_image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack || []);
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setImagePreview(initialData?.cover_image || null);
      setTechStack(initialData?.tech_stack || []);
      setSelectedFile(null);
      setLoading(false);
    }
  }, [isOpen, initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      const worker = new Worker(new URL('../../../../workers/image-compression.worker.ts', import.meta.url));

      worker.onmessage = (event) => {
        if (event.data.status === 'success') {
          const compressedBlob = event.data.blob;
          setSelectedFile(new File([compressedBlob], file.name, { type: 'image/webp' }));

          if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
          }
          const url = URL.createObjectURL(compressedBlob);
          setImagePreview(url);
        } else {
          console.error("Compression failed:", event.data.error);
          setSelectedFile(file);
          const reader = new FileReader();
          reader.onloadend = () => setImagePreview(reader.result as string);
          reader.readAsDataURL(file);
        }
        setIsCompressing(false);
        worker.terminate();
      };

      worker.postMessage({ file, maxWidth: 1920, quality: 0.8 });
    }
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(techInput.trim())) {
        setTechStack([...techStack, techInput.trim()]);
      }
      setTechInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);

    try {
      let coverImageUrl = imagePreview || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80";

      if (selectedFile) {
        console.log("Step 1: Uploading image via /project/upload...");
        coverImageUrl = await ProjectService.uploadImage(selectedFile);
        console.log("Image uploaded successfully:", coverImageUrl);
      }

      const formElements = formRef.current.elements as any;
      const data = {
        title: formElements.title.value,
        description: formElements.description.value,
        tech_stack: techStack,
        cover_image: coverImageUrl
      };

      let res;
      if (initialData?.id) {
        res = await ProjectService.updateProject(initialData.id, data);
      } else {
        res = await ProjectService.createProject(data);
      }

      console.log("Project saved:", res);
      if (res.status === "success") {
        if (onRefresh) onRefresh();
        onClose();
      } else {
        console.error("Failed to save project: " + (res.message || JSON.stringify(res)));
      }
    } catch (err: any) {
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 text-left"
      >
        <div className="p-8 sm:p-10 border-b border-white/5 bg-[#0f0f11] flex justify-between items-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">{initialData ? 'Edit Project' : 'New Project Submission'}</h2>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Showcase your technical legacy.</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors cursor-pointer">
            <X size={28} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
          <section className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3 text-slate-300">
              <ImageIcon size={20} className="text-[#ff4f40]" /> Project Cover Image
            </h3>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            <div
              onClick={() => !isCompressing && fileInputRef.current?.click()}
              className={`aspect-video bg-black/50 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center relative group overflow-hidden transition-all ${isCompressing ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#ff4f40]/30 cursor-pointer'
                }`}
            >
              {isCompressing ? (
                <div className="flex flex-col items-center gap-3 text-[#ff4f40]">
                  <Upload size={40} className="animate-bounce" />
                  <p className="text-xs font-bold uppercase tracking-widest">Compressing Image...</p>
                </div>
              ) : imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-600">
                  <Upload size={40} />
                  <p className="text-xs font-bold uppercase tracking-widest">Click to upload cover</p>
                </div>
              )}
              {imagePreview && !isCompressing && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-xs font-bold uppercase tracking-widest">Change Image</p>
                </div>
              )}
            </div>
          </section>
          <section className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3 text-slate-300">
              <Cpu size={20} className="text-[#ff4f40]" /> Tech Stack
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Add tech (Enter to add)..."
                  className="flex-1 bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white shadow-inner"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (techInput.trim()) setTechStack([...techStack, techInput.trim()]);
                    setTechInput('');
                  }}
                  className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-bold transition-all text-white cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((t) => (
                  <span
                    key={t}
                    className="px-4 py-2 rounded-xl bg-[#ff4f40]/10 text-[#ff4f40] text-[10px] font-black uppercase tracking-widest border border-[#ff4f40]/20 flex items-center gap-2 animate-in zoom-in"
                  >
                    {t}{' '}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => setTechStack(techStack.filter((item) => item !== t))}
                    />
                  </span>
                ))}
              </div>
            </div>
          </section>
          <section className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3 text-slate-300">
              <Edit3 size={20} className="text-[#ff4f40]" /> Project Details
            </h3>
            <div className="space-y-6">
              <input
                name="title"
                type="text"
                maxLength={60}
                placeholder="e.g. Web Application"
                defaultValue={initialData?.title}
                className="w-full bg-black/50 border border-white/5 rounded-2xl px-8 py-5 text-md font-light focus:border-[#ff4f40]/50 outline-none text-white shadow-inner"
              />
              <textarea
                name="description"
                placeholder="Description..."
                defaultValue={initialData?.description}
                className="w-full bg-black/50 border border-white/5 rounded-3xl p-8 text-sm min-h-[180px] outline-none focus:border-[#ff4f40]/50 transition-all font-light leading-relaxed placeholder:text-slate-800 text-white shadow-inner"
              />
            </div>
          </section>
        </div>
        <div className="p-8 border-t border-white/5 bg-[#0f0f11] flex justify-end gap-6">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 text-slate-500 font-bold text-[14px] hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ff4f40] text-white font-bold px-12 py-4 rounded-[1.5rem] shadow-xl text-[14px] transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Submitting...' : 'Confirm Submission'}
          </button>
        </div>
      </form>
    </div>
  );
};
