import React from 'react';
import {
    Clock, RotateCcw, ShieldCheck, MoreVertical,
    CheckCircle2, MessageSquare, FileText,
    Check, Download, CheckSquare, Square,
    Inbox as InboxIcon, ArrowLeft
} from 'lucide-react';
import type { RequestItem } from '../hooks/useRequestData';

interface RequestDetailPanelProps {
    mobileView: 'list' | 'detail';
    selectedRequest: RequestItem | null;
    requestsData: RequestItem[];
    comment: string;
    setComment: (c: string) => void;
    isSubmitting: boolean;
    displayCriteria: any[];
    criteriaStates: Record<string, boolean>;
    toggleCriteria: (id: string) => void;
    handleSubmitFeedback: (status: 'approved' | 'revisions' | 'rejected') => void;
    onBackToList: () => void;
}

export const RequestDetailPanel: React.FC<RequestDetailPanelProps> = ({
    mobileView,
    selectedRequest,
    requestsData,
    comment,
    setComment,
    isSubmitting,
    displayCriteria,
    criteriaStates,
    toggleCriteria,
    handleSubmitFeedback,
    onBackToList
}) => {
    return (
        <div className={`
            ${mobileView === 'detail' ? 'flex' : 'hidden'}
            lg:flex
            flex-1 h-full overflow-y-auto custom-scrollbar bg-[#050505] p-8 lg:p-12 relative flex-col
        `}>
            {/* Mobile: back button inside detail */}
            <button
                onClick={onBackToList}
                className="lg:hidden flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-bold cursor-pointer"
            >
                <ArrowLeft size={18} /> Back
            </button>

            {selectedRequest ? (
                <div className="max-w-5xl w-full space-y-10 md:space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pt-2 lg:pt-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4 text-left">
                            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">{selectedRequest.badge}</h2>
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                                    <img src={selectedRequest.avatar} className="w-6 h-6 rounded-full border border-white/10" alt="student" />
                                    <span className="text-sm font-bold text-slate-300">{selectedRequest.studentFull}</span>
                                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider ml-2 opacity-50">ID: {selectedRequest.studentId}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                                    <Clock size={14} className="text-slate-600" />
                                    <span className="text-xs font-bold text-slate-400 tracking-widest leading-none mt-0.5">Submitted {selectedRequest.submittedAt}</span>
                                </div>
                                <div className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest leading-none flex items-center gap-1.5 ${selectedRequest.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : selectedRequest.status === 'revisions' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                    {selectedRequest.status === 'approved' ? <ShieldCheck size={10} /> : <Clock size={10} />} {selectedRequest.status} Review
                                </div>
                            </div>
                        </div>
                        <button className="hidden md:block p-3 hover:bg-white/5 rounded-full transition-colors text-slate-600 cursor-pointer"><MoreVertical size={20} /></button>
                    </div>

                    {/* Evidence */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                            <FileText size={16} className="text-[#ff4f40]" /> Student Evidence <div className="flex-1 h-px bg-white/5" />
                        </h3>
                        <div className="bg-[#0f0f11] border border-white/5 rounded-3xl p-6 md:p-10 space-y-8 md:space-y-10 shadow-2xl">
                            <p className="text-base text-slate-300 leading-relaxed font-semibold text-left">&quot;{selectedRequest.evidenceText}&quot;</p>
                            <a
                                href={selectedRequest.evidenceLink || "#"}
                                target={selectedRequest.evidenceLink ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                onClick={(e) => { if (!selectedRequest.evidenceLink) e.preventDefault(); }}
                                className={`bg-[#050505] border border-white/5 rounded-2xl p-5 md:p-6 flex items-center justify-between transition-all shadow-inner block w-full ${selectedRequest.evidenceLink ? 'group hover:border-[#ff4f40]/30 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                            >
                                <div className="flex items-center gap-4 md:gap-5">
                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${selectedRequest.evidenceLink ? 'bg-[#ff4f40]/5 text-[#ff4f40]' : 'bg-white/5 text-slate-500'}`}>
                                        <FileText size={24} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className={`font-bold text-sm transition-colors leading-none ${selectedRequest.evidenceLink ? 'text-white group-hover:text-[#ff4f40]' : 'text-slate-500'}`}>
                                            {selectedRequest.evidenceLink ? selectedRequest.fileName : "No file attached"}
                                        </h4>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase mt-2 leading-none">
                                            {selectedRequest.evidenceLink ? "Uploaded Project File" : "No Evidence File"}
                                        </p>
                                    </div>
                                </div>
                                {selectedRequest.evidenceLink && (
                                    <Download size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                                )}
                            </a>
                        </div>
                    </section>

                    {/* Criteria */}
                    {displayCriteria.length > 0 && (
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                                <CheckCircle2 size={16} className="text-[#ff4f40]" /> Evaluation Criteria <div className="flex-1 h-px bg-white/5" />
                            </h3>
                            <div className="bg-[#0f0f11] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                                {displayCriteria.map((c: any, i: number) => (
                                    <div key={c.id} onClick={() => { if (selectedRequest.status === 'pending') toggleCriteria(c.id); }}
                                        className={`p-6 md:p-8 flex items-start gap-5 md:gap-6 group transition-colors ${selectedRequest.status === 'pending' ? 'hover:bg-white/1 cursor-pointer' : 'cursor-not-allowed'} ${i !== displayCriteria.length - 1 ? 'border-b border-white/5' : ''}`}>
                                        <button className={`mt-1 shrink-0 transition-all transform active:scale-90 ${criteriaStates[c.id] ? 'text-emerald-500' : 'text-slate-800 group-hover:text-slate-600'}`}>
                                            {criteriaStates[c.id] ? <CheckSquare size={24} /> : <Square size={24} />}
                                        </button>
                                        <div className="text-left space-y-1.5 flex-1">
                                            <h4 className={`font-bold text-md leading-tight transition-colors ${criteriaStates[c.id] ? 'text-white' : 'text-slate-400'}`}>{c.label}</h4>
                                            <p className="text-xs text-slate-400 leading-relaxed font-light">{c.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Feedback */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                            <MessageSquare size={16} className="text-[#ff4f40]" /> Official Feedback <div className="flex-1 h-px bg-white/5" />
                        </h3>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isSubmitting || selectedRequest.status !== 'pending'}
                            placeholder="Write constructive feedback for the student..."
                            className="w-full bg-[#0f0f11] border border-white/5 rounded-3xl font-semibold p-6 md:p-10 text-base min-h-40 md:min-h-50 outline-none focus:border-[#ff4f40]/50 transition-all leading-relaxed placeholder:text-slate-500 text-white shadow-inner disabled:opacity-50"
                        />
                    </section>

                    {/* Action buttons */}
                    <div className="sticky bottom-0 pt-8 pb-6 mt-10 bg-linear-to-t from-[#050505] to-transparent z-20 flex justify-end gap-3 md:gap-4">
                        <button
                            onClick={() => handleSubmitFeedback('revisions')}
                            disabled={isSubmitting || selectedRequest.status !== 'pending'}
                            className="cursor-pointer  bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 md:px-10 py-3.5 md:py-4 rounded-2xl font-semibold flex items-center gap-2 md:gap-3 transition-all active:scale-95 text-[14px] md:text-[14px] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RotateCcw size={15} /> Revisions
                        </button>
                        <button
                            onClick={() => handleSubmitFeedback('approved')}
                            disabled={isSubmitting || selectedRequest.status !== 'pending'}
                            className="cursor-pointer  bg-[#059669] hover:bg-[#10b981] text-white px-6 md:px-10 py-3.5 md:py-4 rounded-2xl font-semibold flex items-center gap-2 md:gap-3 transition-all active:scale-95 text-[14px] md:text-[14px] shadow-[0_10px_30px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Processing..." : <><Check size={18} strokeWidth={4} /> Approve Badge</>}
                        </button>
                    </div>
                </div>
            ) : (
                /* Welcome screen */
                <div className="h-full flex-col items-center justify-center p-10 text-center animate-in fade-in duration-1000 hidden md:flex">
                    <div className="w-48 h-48 rounded-[3rem] bg-[#0f0f11] border border-white/5 flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.02)] mb-10 relative">
                        <InboxIcon size={80} strokeWidth={0.5} className="text-slate-700" />
                        <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-[#ff4f40] rounded-2xl flex items-center justify-center text-white shadow-2xl rotate-12">
                            <ShieldCheck size={28} />
                        </div>
                    </div>
                    <div className="max-w-2xl space-y-6">
                        <h2 className="text-3xl font-semibold tracking-tight text-white leading-tight">Evaluation Inbox</h2>
                        <p className="text-md text-slate-500 leading-relaxed font-light">
                            You have <span className="text-[#ff4f40] font-black">{requestsData.filter(r => r.status === 'pending').length} pending submissions</span> waiting for your review today.
                            <br />Select an item from the queue on the left to begin evaluating student credentials.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
