import React from 'react';
import { Search, Clock } from 'lucide-react';

interface StudentRosterProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterTrack: string;
    setFilterTrack: (track: string) => void;
    isLoading: boolean;
    processedStudents: any[];
    selectedId: string | null;
    handleSelectStudent: (id: string) => void;
    mobileView: 'list' | 'detail';
}

const getTrackBadgeClass = (track: string) => {
    switch (track) {
        case 'SOFTWARE / WEB': return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
        case 'DATA / AI': return 'text-[#ff4f40] border-[#ff4f40]/20 bg-[#ff4f40]/5';
        case 'CYBER / NETWORK': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5';
        case 'GAME / GRAPHICS': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
        default: return 'text-slate-400 border-white/10 bg-white/5';
    }
};

const filterButtons = [
    { id: 'all', label: 'All' },
    { id: 'SOFTWARE / WEB', label: 'SOFTWARE / WEB', activeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
    { id: 'DATA / AI', label: 'DATA / AI', activeClass: 'bg-[#ff4f40]/20 text-[#ff4f40] border-[#ff4f40]/40' },
    { id: 'CYBER / NETWORK', label: 'CYBER / NETWORK', activeClass: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40' },
    { id: 'GAME / GRAPHICS', label: 'GAME / GRAPHICS', activeClass: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40' },
];

export const StudentRoster: React.FC<StudentRosterProps> = ({
    searchQuery,
    setSearchQuery,
    filterTrack,
    setFilterTrack,
    isLoading,
    processedStudents,
    selectedId,
    handleSelectStudent,
    mobileView,
}) => {
    return (
        <div className={`
            ${mobileView === 'list' ? 'flex' : 'hidden'}
            lg:flex
            w-full lg:w-95
            h-full bg-[#0a0a0a] border-r border-white/5 flex-col shrink-0
        `}>
            <div className="p-5 md:p-8 border-b border-white/5 space-y-4 md:space-y-6">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Student Directory</h1>
                <div className="relative">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by ID or Name..."
                        className="w-full bg-[#121214] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-[#ff4f40]/50 transition-all"
                    />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-start content-start w-full">
                    {filterButtons.map(btn => {
                        const isActive = filterTrack === btn.id;
                        return (
                            <button key={btn.id} onClick={() => setFilterTrack(btn.id)}
                                className={`cursor-pointer shrink-0 border px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none transition-all ${btn.id === 'all'
                                    ? isActive ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'
                                    : isActive ? (btn.activeClass || '') + ' border' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1 bg-[#0a0a0a]">
                {isLoading ? (
                    <div className="py-20 text-center space-y-3 opacity-20">
                        <Clock size={40} className="mx-auto animate-spin" />
                        <p className="text-sm font-bold uppercase tracking-widest">Loading Directory...</p>
                    </div>
                ) : processedStudents.length > 0 ? processedStudents.map(student => {
                    const isLegendary = student.matrix &&
                        student.matrix.sw === 100 &&
                        student.matrix.da === 100 &&
                        student.matrix.gg === 100 &&
                        student.matrix.cn === 100;

                    return (
                        <div key={student.id} onClick={() => handleSelectStudent(student.id)}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer group relative overflow-hidden ${selectedId === student.id ? 'bg-[#121214] border border-white/10 shadow-2xl' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                            {selectedId === student.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff4f40] rounded-r-md shadow-[0_0_10px_#ff4f40]" />
                            )}
                            <div className="flex items-center gap-3">
                                <img src={student.avatar} className="w-10 h-10 rounded-full border border-white/5 transition-all object-cover shrink-0" alt="avatar" />
                                <div className="min-w-0">
                                    <p className={`text-sm font-bold truncate ${selectedId === student.id ? 'text-white' : 'text-slate-300'}`}>{student.name}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter leading-none mt-1">ID: {student.id}</p>
                                </div>
                            </div>
                            <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border shrink-0 ml-2 transition-all ${
                                isLegendary 
                                    ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5 shadow-[0_0_8px_rgba(234,179,8,0.15)]' 
                                    : getTrackBadgeClass(student.focus)
                            }`}>
                                {isLegendary ? 'FULL-STACK MASTER' : student.focus}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="py-20 text-center space-y-3 opacity-20">
                        <Search size={40} className="mx-auto" />
                        <p className="text-sm font-bold uppercase tracking-widest">No results found</p>
                    </div>
                )}
            </div>
        </div>
    );
};
