'use client';
import React from 'react';
import { BadgeRequest } from '../../../services/overview.service';
import { OverviewService } from '../../../services/overview.service';

// แปลง score (0-1) เป็น SVG point บน radar (center 50,50, radius 45)
function scoreToPoint(score: number, angle: number) {
  const r = score * 45;
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
}

const AXES = [
  { name: 'SOFTWARE / WEB', angle: 0 },
  { name: 'DATA / AI', angle: 90 },
  { name: 'GAME / GRAPHICS', angle: 180 },
  { name: 'CYBER / NETWORK', angle: 270 },
];

export const MatrixPage = ({ requests }: { requests: BadgeRequest[] }) => {
  const matrix = OverviewService.computeSkillMatrix(requests);

  // คำนวณ polygon จาก score จริง
  const points = AXES.map((axis) => {
    const item = matrix.find((m) => m.name === axis.name);
    return scoreToPoint(item?.score ?? 0, axis.angle);
  });
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (

    <div className="xl:col-span-7 bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center relative min-h-[520px] shadow-2xl shadow-black/50">
      <div className="absolute top-10 left-10 text-left">
        <h3 className="text-xl font-bold">Skill Matrix Analytics</h3>
        <p className="text-xs text-slate-500 mt-1">Proficiency based on completed tracks</p>
      </div>

      {/* Radar Chart SVG */}
      <div className="relative mt-12">
        {/* Grid วงกลม */}
        <svg width="340" height="340" viewBox="0 0 100 100" className="opacity-20 animate-pulse">
          {[0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
            <circle key={i} cx="50" cy="50" r={45 * r} fill="none" stroke="white" strokeWidth="0.2" />
          ))}
          <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="0.2" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="0.2" />
        </svg>

        {/* Polygon จากข้อมูลจริง */}
        <svg width="340" height="340" viewBox="0 0 100 100" className="absolute inset-0">
          <polygon
            points={polygonPoints}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="#3b82f6"
            strokeWidth="0.8"
            className="animate-in zoom-in duration-1000"
          />
          <circle cx={points[0].x} cy={points[0].y} r="1.2" fill="#3b82f6" />
          <circle cx={points[1].x} cy={points[1].y} r="1.2" fill="#f43f5e" />
          <circle cx={points[2].x} cy={points[2].y} r="1.2" fill="#10b981" />
          <circle cx={points[3].x} cy={points[3].y} r="1.2" fill="#eab308" />
        </svg>

        {/* Labels เหมือนเดิมทุกตัว */}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-400 uppercase text-center leading-tight">SOFTWARE /<br />WEB</span>
        <span className="absolute top-1/2 -right-14 -translate-y-1/2 text-[10px] font-bold text-rose-400 uppercase tracking-tighter">DATA / AI</span>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-400 uppercase text-center leading-tight">GAME /<br />GRAPHICS</span>
        <span className="absolute top-1/2 -left-16 -translate-y-1/2 text-[10px] font-bold text-yellow-400 uppercase text-center leading-tight">CYBER /<br />NETWORK</span>
      </div>
    </div>
  );
}
