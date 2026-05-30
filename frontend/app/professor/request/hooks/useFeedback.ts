import { useState, useEffect } from 'react';
import { FeetbackService } from '../../../../services/feetback.service';
import { MASTER_CRITERIA } from '../components/constants';
import type { RequestItem } from './useRequestData';

interface UseFeedbackOptions {
    selectedId: string | null;
    requestsData: RequestItem[];
    setRequestsData: React.Dispatch<React.SetStateAction<RequestItem[]>>;
    onMobileBack: () => void;
}

export const useFeedback = ({ selectedId, requestsData, setRequestsData, onMobileBack }: UseFeedbackOptions) => {
    const [criteriaStates, setCriteriaStates] = useState<Record<string, boolean>>({});
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedRequest = requestsData.find(r => r.id === selectedId) || null;

    // Sync criteria/comment when selection changes
    useEffect(() => {
        const found = requestsData.find(r => r.id === selectedId);
        if (found) {
            setComment(found.comment || "");
            const initialStates: Record<string, boolean> = {};
            if (found.result && found.result.length > 0) {
                found.result.forEach((c: any, idx: number) => {
                    initialStates[`c_${idx}`] = !!c.passed;
                });
                setCriteriaStates(initialStates);
            } else {
                setCriteriaStates({});
            }
        } else {
            setComment("");
            setCriteriaStates({});
        }
    }, [selectedId, requestsData]);

    // Get criteria to display (either from the specific request, or fallback to MASTER_CRITERIA if none exist)
    const displayCriteria = (selectedRequest?.rawCriteria?.length ?? 0) > 0
        ? selectedRequest!.rawCriteria.map((c: any, idx: number) => ({
            id: `c_${idx}`,
            label: c.name || c.label || (typeof c === 'string' ? c : 'Criterion'),
            desc: c.description || c.desc || ''
        }))
        : (MASTER_CRITERIA[selectedRequest?.category || ""] || []);

    const toggleCriteria = (id: string) => {
        setCriteriaStates(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSubmitFeedback = async (status: 'approved' | 'revisions' | 'rejected') => {
        const found = requestsData.find(r => r.id === selectedId);
        if (!found) return;

        setIsSubmitting(true);
        try {
            const res = await FeetbackService.submitFeedback(
                found.id,
                status,
                comment,
                criteriaStates
            );

            if (res.status === "success") {
                console.log(`Successfully marked request as ${status}`);

                // Update local list state so UI updates immediately
                setRequestsData(prev => prev.map(req => {
                    if (req.id === found.id) {
                        return {
                            ...req,
                            status: status,
                            comment: comment,
                            result: req.rawCriteria.map((c: any, idx: number) => ({
                                ...c,
                                passed: !!criteriaStates[`c_${idx}`]
                            }))
                        };
                    }
                    return req;
                }));

                if (window.innerWidth < 1024) {
                    onMobileBack();
                }
            } else {
                console.error(`Error submitting evaluation: ${res.message || "Unknown error"}`);
            }
        } catch (error: any) {
            console.error(`Failed to submit: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        selectedRequest,
        criteriaStates,
        comment,
        setComment,
        isSubmitting,
        displayCriteria,
        toggleCriteria,
        handleSubmitFeedback
    };
};
