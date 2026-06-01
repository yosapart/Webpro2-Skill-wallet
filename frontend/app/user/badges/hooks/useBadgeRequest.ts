import { useState, useEffect, useRef } from 'react';
import { BadgeService } from '../../../../services/badge.service';
import { AuthService } from '../../../../services/auth.service';
import { auth } from '../../../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const getLocalActiveSubmissions = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = JSON.parse(localStorage.getItem('submitting_badge_ids') || '[]');
    const now = Date.now();
    // Keep only submissions newer than 5 minutes (300,000 ms)
    const valid = data.filter((item: any) => {
      const time = item.timestamp || 0;
      return now - time < 300000;
    });
    localStorage.setItem('submitting_badge_ids', JSON.stringify(valid));
    return valid.map((item: any) => item.id);
  } catch (e) {
    return [];
  }
};

const addLocalActiveSubmission = (badgeId: string) => {
  if (typeof window === 'undefined') return;
  try {
    const data = JSON.parse(localStorage.getItem('submitting_badge_ids') || '[]');
    const now = Date.now();
    const updated = [
      ...data.filter((item: any) => item.id !== badgeId),
      { id: badgeId, timestamp: now }
    ];
    localStorage.setItem('submitting_badge_ids', JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
};

const removeLocalActiveSubmission = (badgeId: string) => {
  if (typeof window === 'undefined') return;
  try {
    const data = JSON.parse(localStorage.getItem('submitting_badge_ids') || '[]');
    const updated = data.filter((item: any) => item.id !== badgeId);
    localStorage.setItem('submitting_badge_ids', JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
};

export const useBadgeRequest = (isOpen: boolean, onClose: () => void) => {
  const [badges, setBadges] = useState<any[]>([]);
  const [approvedBadgeIds, setApprovedBadgeIds] = useState<string[]>([]);
  const [pendingBadgeIds, setPendingBadgeIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [evidence, setEvidence] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; file: File }[]>([]);
  const [badgeDropdownOpen, setBadgeDropdownOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeCategory, setActiveCategory] = useState('SOFTWARE / WEB');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      BadgeService.getAllBadges().then(res => {
        if (res.status === 'success') {
          setBadges(res.data);
        } else {
          setBadges([]);
        }
      }).catch(err => {
        setBadges([]);
      });

      BadgeService.getMyRequests().then(res => {
        const localSubmissions = getLocalActiveSubmissions();
        if (res.status === 'success') {
          const approvedIds: string[] = [];
          const pendingIds: string[] = [];

          // Sort requests by date so that the latest request status takes precedence
          const sortedRequests = [...res.data].sort((a: any, b: any) => {
            const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
            const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
            return dateA - dateB; // ascending
          });

          const latestStatusMap: Record<string, string> = {};
          sortedRequests.forEach((req: any) => {
            if (req.badge_id) {
              latestStatusMap[req.badge_id.toString()] = req.status;
            }
          });

          Object.entries(latestStatusMap).forEach(([badgeId, status]) => {
            if (status === 'approved') {
              approvedIds.push(badgeId);
            } else if (status === 'pending') {
              pendingIds.push(badgeId);
            }
          });

          setApprovedBadgeIds(approvedIds);
          // Merge actual pending requests with local ones in-flight
          const mergedPending = Array.from(new Set([...pendingIds, ...localSubmissions]));
          setPendingBadgeIds(mergedPending);
        } else {
          setApprovedBadgeIds([]);
          setPendingBadgeIds(localSubmissions);
        }
      }).catch(err => {
        const localSubmissions = getLocalActiveSubmissions();
        setApprovedBadgeIds([]);
        setPendingBadgeIds(localSubmissions);
      });

      // Reset states
      setEvidence('');
      setUploadedFiles([]);
      setSelectedBadge(null);
      setBadgeDropdownOpen(false);
      setActiveCategory('SOFTWARE / WEB');
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({
          displayName: payload.name || '',
          uid: payload.user_id || payload.uid || '',
          email: payload.email || ''
        });
      } catch (e) {
        console.error("Error decoding token for user info:", e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [isOpen]);

  const addFiles = (files: FileList | null) => {
    setFileError(''); // reset error
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    
    if (file.size > maxSize) {
      setFileError("File size exceeds 10MB limit.");
      return;
    }
    
    const singleFile = {
      id: Math.random().toString(36).substring(7),
      file: file
    };
    setUploadedFiles([singleFile]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = async () => {
    if (!selectedBadge) return console.error("Please select a badge title first!");

    setSubmitting(true);

    try {
      // 1. Get fresh token for backend authorization
      const token = await AuthService.getFreshToken();
      if (!token) throw new Error("No authorization token found");

      // 2. Calculate max score from criteria_template
      const max_score = selectedBadge?.criteria_template?.reduce((sum: number, c: any) => sum + (c.max_score || 0), 0) || 0;

      // 3. Prepare payload (evidence_link will be populated by worker after upload)
      const payload = {
        badge_id: selectedBadge.id,
        badge_name: selectedBadge.name,
        category: selectedBadge.category,
        description: evidence,
        criteria: selectedBadge.criteria_template || [],
        max_score: max_score
      };

      // 4. Create Web Worker to process file upload and create request in the background
      const worker = new Worker(new URL('../../../../workers/background-upload.worker.ts', import.meta.url));
      
      const file = uploadedFiles.length > 0 ? uploadedFiles[0].file : null;

      // Add to local active submissions immediately (optimistic UI)
      addLocalActiveSubmission(selectedBadge.id.toString());

      // 5. Send message to start background processing
      worker.postMessage({
        file,
        token,
        payload,
        uploadUrl: "http://localhost:3001/api/badge-requests/upload",
        createRequestUrl: "http://localhost:3001/api/badge-requests"
      });

      // Handle worker messages for logging or debug
      worker.onmessage = (event) => {
        // Remove from local submissions when finished or failed
        removeLocalActiveSubmission(selectedBadge.id.toString());

        if (event.data.status === 'success') {
          console.log("Background Badge Request Submission succeeded:", event.data.data);
          // Dispatch window event so any other open components can listen and refresh
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('badge-request-submitted'));
          }
        } else {
          console.error("Background Badge Request Submission failed:", event.data.error);
        }
        worker.terminate();
      };

      // 6. CLOSE MODAL IMMEDIATELY - NO WAITING!
      console.log("Background upload started successfully. Closing modal immediately...");
      setSubmitting(false);
      onClose();

    } catch (err: any) {
      console.error("Failed to initialize background upload:", err);
      if (selectedBadge) {
        removeLocalActiveSubmission(selectedBadge.id.toString());
      }
      setSubmitting(false);
    }
  };

  return {
    badges,
    approvedBadgeIds,
    pendingBadgeIds,
    submitting,
    evidence,
    setEvidence,
    uploadedFiles,
    badgeDropdownOpen,
    setBadgeDropdownOpen,
    selectedBadge,
    setSelectedBadge,
    currentUser,
    isDragging,
    activeCategory,
    setActiveCategory,
    fileError,
    fileInputRef,
    addFiles,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSubmit
  };
};
