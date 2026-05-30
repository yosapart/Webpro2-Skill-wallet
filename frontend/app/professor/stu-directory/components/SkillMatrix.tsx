import React from 'react';

interface SkillMatrixProps {
    matrix: {
        sw: number;
        da: number;
        gg: number;
        cn: number;
    } | null;
}

export const SkillMatrix: React.FC<SkillMatrixProps> = ({ matrix }) => {
    const isLegendary = matrix &&
        matrix.sw === 100 &&
        matrix.da === 100 &&
        matrix.gg === 100 &&
        matrix.cn === 100;

    return (
        <section className="space-y-4 md:space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                Skill Matrix Analytics <div className="flex-1 h-px bg-white/5" />
            </h3>
            <div className={`border rounded-4xl md:rounded-[2.5rem] p-8 md:p-16 flex items-center justify-center min-h-90 md:min-h-130 relative shadow-2xl overflow-hidden transition-all ${
                isLegendary 
                    ? 'bg-[#120f0a] border-yellow-500/20 shadow-[0_0_50px_rgba(234,179,8,0.08)]' 
                    : 'bg-[#0f0f11] border-white/5 shadow-2xl'
            }`}>
                <div className={`absolute inset-0 blur-3xl rounded-full opacity-50 transition-all ${
                    isLegendary ? 'bg-yellow-500/10' : 'bg-[#ff4f40]/5'
                }`} />
                <div className="relative w-full max-w-[320px] md:max-w-110 aspect-square flex items-center justify-center z-10">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20 animate-pulse">
                        {[0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
                            <circle key={i} cx="50" cy="50" r={45 * r} fill="none" stroke="white" strokeWidth="0.3" />
                        ))}
                        <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="0.3" />
                        <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="0.3" />
                    </svg>
                    {matrix && (
                        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full transition-all ${
                            isLegendary 
                                ? 'drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]' 
                                : 'drop-shadow-[0_0_30px_rgba(255,79,64,0.2)]'
                        }`}>
                            <polygon
                                points={`
                                    50,${50 - (matrix.sw / 100) * 45}
                                    ${50 + (matrix.da / 100) * 45},50
                                    50,${50 + (matrix.gg / 100) * 45}
                                    ${50 - (matrix.cn / 100) * 45},50
                                `}
                                fill={isLegendary ? "rgba(234, 179, 8, 0.25)" : "rgba(59, 130, 246, 0.3)"} 
                                stroke={isLegendary ? "#eab308" : "#3b82f6"} 
                                strokeWidth="0.8"
                                className="animate-in zoom-in duration-1000"
                            />
                            <circle cx="50" cy={50 - (matrix.sw / 100) * 45} r="1.5" fill={isLegendary ? "#eab308" : "#3b82f6"} />
                            <circle cx={50 + (matrix.da / 100) * 45} cy="50" r="1.5" fill={isLegendary ? "#eab308" : "#f43f5e"} />
                            <circle cx="50" cy={50 + (matrix.gg / 100) * 45} r="1.5" fill={isLegendary ? "#eab308" : "#10b981"} />
                            <circle cx={50 - (matrix.cn / 100) * 45} cy="50" r="1.5" fill={isLegendary ? "#eab308" : "#eab308"} />
                        </svg>
                    )}
                    <div className="absolute top-0 text-[9px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.15em] md:tracking-[0.2em] -translate-y-4 text-center whitespace-nowrap">Software / Web</div>
                    <div className="absolute bottom-0 text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-[0.15em] md:tracking-[0.2em] translate-y-4 text-center whitespace-nowrap">Game / Graphics</div>
                    <div className="absolute right-0 translate-x-16 md:translate-x-20 text-[9px] md:text-[10px] font-black text-[#ff4f40] uppercase tracking-[0.15em] md:tracking-[0.2em] whitespace-nowrap">Data / AI</div>
                    <div className="absolute left-0 -translate-x-16 md:-translate-x-20 text-[9px] md:text-[10px] font-black text-yellow-500 uppercase tracking-[0.15em] md:tracking-[0.2em] whitespace-nowrap">Cyber</div>
                </div>
            </div>
        </section>
    );
};
