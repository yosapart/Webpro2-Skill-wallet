import React from 'react';
import {
    Clock, RotateCcw, ShieldCheck, Search,
    CheckCircle2, FileText
} from 'lucide-react';
import { CATEGORY_COLOR } from './constants';
import type { RequestItem } from '../hooks/useRequestData';

interface RequestQueuePanelProps {
    mobileView: 'list' | 'detail';
    isLoading: boolean;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    filterStatus: string;
    setFilterStatus: (s: string) => void;
    processedRequests: RequestItem[];
    selectedId: string | null;
    onSelectRequest: (id: string) => void;
}

export const RequestQueuePanel: React.FC<RequestQueuePanelProps> = ({
    mobileView,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    processedRequests,
    selectedId,
    onSelectRequest
}) => {
    return (
        <div className={`
            ${mobileView === 'list' ? 'flex' : 'hidden'}
            lg:flex
            w-full lg:w-95
            h-full bg-[#0a0a0a] border-r border-white/5 flex-col shrink-0
        `}>
            {/* Mobile back button row */}
            <div className="lg:hidden flex items-center gap-2 px-5 pt-4 pb-0">
                {/* intentionally empty — back is handled by topbar */}
            </div>

            <div className="p-5 md:p-8 border-b border-white/5 space-y-4 md:space-y-6 pt-7 md:pt-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Request Badge</h1>

                <div className="relative">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search student or badge..."
                        className="w-full bg-[#121214] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-[#ff4f40]/50 transition-all"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    <button onClick={() => setFilterStatus('all')}
                        className={`${filterStatus === 'all' ? 'bg-white text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'} cursor-pointer shrink-0 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none transition-all`}
                    >All</button>
                    <button onClick={() => setFilterStatus('approved')}
                        className={`${filterStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-transparent'} cursor-pointer shrink-0 border px-2.5 py-1.5 rounded-full text-[9px] font-bold flex items-center gap-1 leading-none transition-all hover:bg-emerald-500/10`}
                    ><CheckCircle2 size={10} /> Approved</button>
                    <button onClick={() => setFilterStatus('pending')}
                        className={`${filterStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40' : 'bg-white/5 text-slate-400 border-transparent'} cursor-pointer shrink-0 border px-2.5 py-1.5 rounded-full text-[9px] font-bold flex items-center gap-1 leading-none transition-all hover:bg-yellow-500/10`}
                    ><Clock size={10} /> Pending</button>
                    <button onClick={() => setFilterStatus('revisions')}
                        className={`${filterStatus === 'revisions' ? 'bg-rose-500/20 text-rose-500 border-rose-500/40' : 'bg-white/5 text-slate-400 border-transparent'} cursor-pointer shrink-0 border px-2.5 py-1.5 rounded-full text-[9px] font-bold flex items-center gap-1 leading-none transition-all hover:bg-rose-500/10`}
                    ><RotateCcw size={10} /> Revisions</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                {isLoading ? (
                    <div className="py-20 text-center space-y-3 opacity-20">
                        <Clock size={40} className="mx-auto animate-spin" />
                        <p className="text-sm font-bold uppercase tracking-widest">Loading Requests...</p>
                    </div>
                ) : processedRequests.length > 0 ? processedRequests.map(item => (
                    <div
                        key={item.id}
                        onClick={() => onSelectRequest(item.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${selectedId === item.id ? 'bg-[#121214] border-white/10 shadow-2xl' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                    >
                        {selectedId === item.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff4f40] rounded-r-md shadow-[0_0_10px_#ff4f40]" />}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase border leading-none ${CATEGORY_COLOR[item.category] ?? 'bg-white/5 text-slate-400 border-white/10'}`}>
                                    {item.category}
                                </span>
                                <div className={`p-1 rounded-md border ${item.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : item.status === 'revisions' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
                                    {item.status === 'approved' ? <ShieldCheck size={10} /> : item.status === 'revisions' ? <RotateCcw size={10} /> : <Clock size={10} />}
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-600 font-bold uppercase leading-none">{item.submittedAt}</span>
                        </div>
                        <h3 className={`text-sm font-bold leading-tight mb-3 transition-colors ${selectedId === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{item.badge}</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img src={item.avatar} className="w-6 h-6 rounded-full border border-white/10 grayscale group-hover:grayscale-0 transition-all" alt="S" />
                                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors leading-none">{item.student}</span>
                            </div>
                            <span className="text-[10px] text-slate-600 flex items-center gap-1 font-bold tracking-tighter uppercase leading-none"><FileText size={10} /> 1 File</span>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center space-y-3 opacity-20">
                        <Search size={40} className="mx-auto" />
                        <p className="text-sm font-bold uppercase tracking-widest">No results found</p>
                    </div>
                )}
            </div>
        </div>
    );
};
