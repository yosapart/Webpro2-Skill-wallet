import { useState, useEffect, useMemo } from 'react';
import { AuthService } from '../../../../services/auth.service';

export const useDirectory = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTrack, setFilterTrack] = useState('all');
    const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
    
    // Data state
    const [studentsData, setStudentsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = await AuthService.getFreshToken();
                if (!token) return;
                
                const res = await fetch("https://webpro2-skill-wallet-1.onrender.com/api/professor/students", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.status === "success") {
                    setStudentsData(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch students data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const processedStudents = useMemo(() => {
        return studentsData.filter(s => {
            const name = s.name || '';
            const id = s.id || '';
            const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || id.includes(searchQuery);
            const matchFilter = filterTrack === 'all' || s.focus === filterTrack;
            return matchSearch && matchFilter;
        });
    }, [searchQuery, filterTrack, studentsData]);

    const selectedStudent = studentsData.find(s => s.id === selectedId);

    const handleSelectStudent = (id: string) => {
        setSelectedId(id);
        setMobileView('detail');
    };

    const handleBackToList = () => {
        setMobileView('list');
        setSelectedId(null);
    };

    return {
        selectedId,
        setSelectedId,
        searchQuery,
        setSearchQuery,
        filterTrack,
        setFilterTrack,
        mobileView,
        setMobileView,
        studentsData,
        isLoading,
        processedStudents,
        selectedStudent,
        handleSelectStudent,
        handleBackToList
    };
};
