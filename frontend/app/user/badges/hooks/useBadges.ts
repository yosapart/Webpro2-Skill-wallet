import { useState, useEffect } from 'react';
import { BadgeService } from '../../../../services/badge.service';

export const useBadges = (showRequestModal: boolean) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        const res = await BadgeService.getMyEnrichedRequests();
        if (res.status === 'success') {
          setMyRequests(res.data);
        }
      } catch (error) {
        console.error("Error fetching badge data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    if (!showRequestModal) {
      fetchData();
    }
  }, [showRequestModal]);

  const approvedRequests = myRequests.filter(b => b.status === 'approved');
  const filteredBadges = activeFilter === 'all'
    ? approvedRequests
    : approvedRequests.filter(b => b.category === activeFilter);

  return {
    activeFilter,
    setActiveFilter,
    isDataLoading,
    filteredBadges
  };
};
