import React, { useState } from 'react'; // 1. เพิ่ม useState
import {
    ShieldCheck,
    Clock,
    TrendingUp,
    Award,
    ExternalLink,
    ArrowLeft,
    User as UserIcon,
    X, // 2. นำเข้าไอคอน X สำหรับปุ่มปิด
} from 'lucide-react';
import { SkillMatrix } from './SkillMatrix';

interface StudentDetailPanelProps {
    selectedStudent: any;
    mobileView: 'list' | 'detail';
    handleBackToList: () => void;
}

export const StudentDetailPanel: React.FC<StudentDetailPanelProps> = ({
    selectedStudent,
    mobileView,
    handleBackToList,
}) => {
    // 3. เพิ่ม State สำหรับควบคุมการเปิด/ปิด Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isLegendary = selectedStudent?.matrix &&
        selectedStudent.matrix.sw === 100 &&
        selectedStudent.matrix.da === 100 &&
        selectedStudent.matrix.gg === 100 &&
        selectedStudent.matrix.cn === 100;

    return (
        <div className={`
            ${mobileView === 'detail' ? 'flex' : 'hidden'}
            lg:flex
            flex-1 h-full overflow-y-auto custom-scrollbar bg-[#050505] p-6 md:p-8 lg:p-12 relative flex-col items-center
        `}>
            {/* Mobile back button */}
            <button onClick={handleBackToList}
                className="lg:hidden self-start flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-bold">
                <ArrowLeft size={18} /> Back
            </button>

            {selectedStudent ? (
                <div className="max-w-5xl w-full space-y-10 md:space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pt-2 lg:pt-8">
                    {/* ... (โค้ดส่วน Profile Header และ Skill Matrix เหมือนเดิม) ... */}

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 text-left">
                        <div className="flex items-center gap-5 md:gap-8">
                            <div className="relative shrink-0">
                                <img
                                    src={selectedStudent.avatar}
                                    className={`w-20 h-20 md:w-32 md:h-32 rounded-xl md:rounded-2xl border-2 shadow-2xl object-cover shrink-0 transition-all ${isLegendary
                                        ? 'border-yellow-500 shadow-yellow-500/20'
                                        : 'border-white/5'
                                        }`}
                                    alt="Avatar"
                                />
                                {isLegendary && (
                                    <div className="absolute inset-0 rounded-xl md:rounded-2xl border border-yellow-400/40 animate-ping opacity-75 pointer-events-none" />
                                )}
                            </div>
                            <div className="space-y-2 md:space-y-3 min-w-0">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-white leading-tight">{selectedStudent.name}</h2>
                                </div>
                                <p className="text-slate-500 font-semibold uppercase tracking-[0.2em] text-[10px] md:text-xs">ID: {selectedStudent.id}</p>
                            </div>
                        </div>
                        <div className={`border rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center min-w-30 md:min-w-35 shadow-2xl shrink-0 self-start sm:self-auto transition-all ${isLegendary
                            ? 'bg-[#1a1610] border-yellow-500/20 shadow-yellow-500/5'
                            : 'bg-[#121214] border-white/5'
                            }`}>
                            <Award className={`mb-1 transition-colors ${isLegendary ? 'text-yellow-500' : 'text-slate-600'}`} size={16} />
                            <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isLegendary ? 'text-yellow-500/70' : 'text-slate-500'}`}>Badges</span>
                            <span className={`text-3xl md:text-4xl font-black leading-none ${isLegendary ? 'text-yellow-500' : 'text-[#ff4f40]'}`}>{selectedStudent.badgesCount}</span>
                        </div>
                    </div>

                    {selectedStudent.summary && (
                        <p className="text-base md:text-md text-slate-400 leading-relaxed max-w-3xl text-left border-l-4 border-[#ff4f40]/20 pl-5 md:pl-6">
                            "{selectedStudent.summary}"
                        </p>
                    )}

                    <SkillMatrix matrix={selectedStudent.matrix || null} />

                    {/* Latest Verification Activity */}
                    <section className="space-y-4 md:space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold flex items-center gap-3 text-white">Latest Verified Activity</h3>
                            {/* 4. เพิ่ม onClick เพื่อเปิด Modal */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-[10px] font-black text-[#ff4f40] uppercase tracking-widest hover:underline transition-all cursor-pointer"
                            >
                                View All
                            </button>
                        </div>
                        <div className="bg-[#0f0f11] border border-white/5 rounded-4xl overflow-hidden shadow-2xl text-left">
                            {selectedStudent.latestVerifications && selectedStudent.latestVerifications.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {selectedStudent.latestVerifications.slice(0, 3).map((v: any, idx: number) => (
                                        <div key={idx} className="p-5 md:p-7 flex items-center justify-between hover:bg-white/1 transition-all cursor-pointer group">
                                            <div className="flex items-center gap-4 md:gap-6">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform shrink-0">
                                                    <ShieldCheck size={20} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-base md:text-lg text-white group-hover:text-[#ff4f40] transition-colors leading-none">{v.title}</p>
                                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 mt-1 leading-none">
                                                        <Clock size={12} /> Verified On {v.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <ExternalLink size={18} className="text-slate-700 group-hover:text-white transition-colors shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-16 md:p-20 flex flex-col items-center justify-center opacity-20 gap-4">
                                    <TrendingUp size={64} strokeWidth={1} />
                                    <p className="text-xs uppercase font-black tracking-[0.3em]">No Verification Ledger Entry</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-1000 hidden md:flex">
                    <div className="w-48 h-48 rounded-[3.5rem] bg-[#0f0f11] border border-white/5 flex items-center justify-center mb-10 shadow-2xl relative">
                        <div className="absolute inset-0 bg-[#ff4f40]/5 blur-3xl rounded-full" />
                        <UserIcon size={72} strokeWidth={0.5} className="text-slate-600 relative z-10" />
                    </div>
                    <div className="max-w-md space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">Student Roster</h2>
                        <p className="text-md text-slate-500 font-light leading-relaxed">
                            Select a student from the directory on the left to analyze their skill progression.
                        </p>
                    </div>
                </div>
            )}

            {/* 5. ส่วนของป็อปอัป (Modal) - แสดงเมื่อ isModalOpen เป็น true */}
            {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    {/* พื้นหลัง Modal สามารถคลิกเพื่อปิดได้ */}
                    <div
                        className="absolute inset-0"
                        onClick={() => setIsModalOpen(false)}
                    ></div>

                    {/* กล่อง Modal เนื้อหา */}
                    <div className="relative w-full max-w-2xl bg-[#0a0a0c] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] md:max-h-[80vh] overflow-hidden">

                        {/* Header ของ Modal */}
                        <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5 shrink-0 bg-[#0f0f11]">
                            <h3 className="text-lg md:text-xl font-bold flex items-center gap-3 text-white">
                                All Verified Activities
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="cursor-pointer p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>


                        <div className="overflow-y-auto custom-scrollbar p-2 md:p-4">
                            {selectedStudent.latestVerifications && selectedStudent.latestVerifications.length > 0 ? (
                                <div className="space-y-2">

                                    {selectedStudent.latestVerifications.map((v: any, idx: number) => (
                                        <div key={idx} className="p-4 md:p-5 rounded-xl border border-transparent hover:border-white/5 bg-transparent hover:bg-white/5 transition-all flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="cursor-pointer w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                                    <ShieldCheck size={18} />
                                                </div>
                                                <div className="space-y-1 text-left">
                                                    <p className="font-bold text-sm md:text-base text-white leading-tight">{v.title}</p>
                                                    <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                                                        <Clock size={10} /> {v.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <ExternalLink size={16} className="text-slate-600 group-hover:text-white transition-colors shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center opacity-50 gap-4">
                                    <TrendingUp size={48} strokeWidth={1} />
                                    <p className="text-xs uppercase font-black tracking-widest text-center">No Data Available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};