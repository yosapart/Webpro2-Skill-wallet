import { useState, useEffect, useMemo } from 'react';
import { AuthService } from '../../../../services/auth.service';
import { timeAgo } from '../components/constants';

export interface RequestItem {
    id: string;
    student: string;
    studentFull: string;
    studentId: string;
    avatar: string;
    badge: string;
    category: string;
    status: string;
    submittedAt: string;
    evidenceText: string;
    evidenceLink: string;
    fileName: string;
    fileSize: string;
    rawCriteria: any[];
    comment: string;
    result: any[];
}

export const useRequestData = () => {
    const [requestsData, setRequestsData] = useState<RequestItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = await AuthService.getFreshToken();
                if (!token) return;

                const res = await fetch("https://webpro2-skill-wallet-1.onrender.com/api/professor/badge-requests", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();

                if (data.status === "success") {
                    const mappedData: RequestItem[] = data.data.map((req: any) => {
                        // Extract filename from URL or use a default
                        let fileName = "evidence-file";
                        if (req.evidence_link) {
                            try {
                                const urlObj = new URL(req.evidence_link);
                                const pathnameParts = urlObj.pathname.split('/');
                                fileName = pathnameParts[pathnameParts.length - 1] || "evidence-file";
                            } catch (e) {
                                fileName = "evidence-file";
                            }
                        }

                        // Generate a short name
                        const nameParts = (req.student_name || "Student").split(" ");
                        const shortName = nameParts.length > 1
                            ? `${nameParts[0]} ${nameParts[1].charAt(0)}.`
                            : nameParts[0];

                        // Use the exact URL from Cloudinary without modification
                        let downloadLink = req.evidence_link || "";

                        return {
                            id: req.id,
                            student: shortName,
                            studentFull: req.student_name || "Unknown Student",
                            studentId: req.user_id.substring(0, 6).toUpperCase(),
                            avatar: req.student_avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                            badge: req.badge_name,
                            category: req.category,
                            status: req.status,
                            submittedAt: timeAgo(req.created_at),
                            evidenceText: req.description,
                            evidenceLink: downloadLink,
                            fileName: fileName,
                            fileSize: req.evidence_link ? "Uploaded" : "No file",
                            rawCriteria: req.criteria || [],
                            comment: req.comment || "",
                            result: req.result || []
                        };
                    });

                    setRequestsData(mappedData);
                }
            } catch (err) {
                console.error("Failed to fetch badge requests:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const processedRequests = useMemo(() => {
        const filtered = requestsData.filter(item => {
            const matchesSearch =
                item.studentFull.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.badge.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
        const statusOrder: Record<string, number> = { pending: 1, revisions: 2, approved: 3 };
        return [...filtered].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }, [searchQuery, filterStatus, requestsData]);

    return {
        requestsData,
        setRequestsData,
        isLoading,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        processedRequests
    };
};
