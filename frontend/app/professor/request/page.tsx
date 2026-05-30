"use client";

import React, { useState } from 'react';
import { useRequestData } from './hooks/useRequestData';
import { useFeedback } from './hooks/useFeedback';
import { RequestQueuePanel } from './components/RequestQueuePanel';
import { RequestDetailPanel } from './components/RequestDetailPanel';

export default function Request_Professor() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

    const {
        requestsData,
        setRequestsData,
        isLoading,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        processedRequests
    } = useRequestData();

    const handleBackToList = () => {
        setMobileView('list');
        setSelectedId(null);
    };

    const {
        selectedRequest,
        criteriaStates,
        comment,
        setComment,
        isSubmitting,
        displayCriteria,
        toggleCriteria,
        handleSubmitFeedback
    } = useFeedback({
        selectedId,
        requestsData,
        setRequestsData,
        onMobileBack: handleBackToList
    });

    const handleSelectRequest = (id: string) => {
        setSelectedId(id);
        setMobileView('detail');
    };

    return (
        <div className="flex flex-1 overflow-hidden h-full text-left">

            {/* QUEUE PANEL */}
            <RequestQueuePanel
                mobileView={mobileView}
                isLoading={isLoading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                processedRequests={processedRequests}
                selectedId={selectedId}
                onSelectRequest={handleSelectRequest}
            />

            {/* DETAIL PANEL */}
            <RequestDetailPanel
                mobileView={mobileView}
                selectedRequest={selectedRequest}
                requestsData={requestsData}
                comment={comment}
                setComment={setComment}
                isSubmitting={isSubmitting}
                displayCriteria={displayCriteria}
                criteriaStates={criteriaStates}
                toggleCriteria={toggleCriteria}
                handleSubmitFeedback={handleSubmitFeedback}
                onBackToList={handleBackToList}
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