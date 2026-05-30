"use client";

import React from 'react';
import { useDirectory } from './hooks/useDirectory';
import { StudentRoster } from './components/StudentRoster';
import { StudentDetailPanel } from './components/StudentDetailPanel';

export default function DirectoryPage() {
    const {
        selectedId,
        searchQuery,
        setSearchQuery,
        filterTrack,
        setFilterTrack,
        mobileView,
        isLoading,
        processedStudents,
        selectedStudent,
        handleSelectStudent,
        handleBackToList
    } = useDirectory();

    return (
        <div className="flex flex-1 overflow-hidden h-full text-left bg-[#050505] text-white font-lineseed w-full">
            {/* ── ROSTER PANEL ── */}
            <StudentRoster
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterTrack={filterTrack}
                setFilterTrack={setFilterTrack}
                isLoading={isLoading}
                processedStudents={processedStudents}
                selectedId={selectedId}
                handleSelectStudent={handleSelectStudent}
                mobileView={mobileView}
            />

            {/* ── PROFILE DETAIL PANEL ── */}
            <StudentDetailPanel
                selectedStudent={selectedStudent}
                mobileView={mobileView}
                handleBackToList={handleBackToList}
            />

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-in { animation: fadeIn 0.4s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
        </div>
    );
}