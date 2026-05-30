// Master criteria fallback definitions per category
export const MASTER_CRITERIA: Record<string, any[]> = {
    "SOFTWARE / WEB": [
        { id: 'sw1', label: 'Basic HTML Tags Usage', desc: 'ใช้แท็กพื้นฐาน (<h1>, <p>, <img>, <ul>) ได้ถูกต้องตามหลัก Semantics' },
        { id: 'sw2', label: 'File Linking & Attributes', desc: 'การเชื่อมโยง src และ href ทำงานได้ปกติ ไม่มี Broken links' },
        { id: 'sw3', label: 'Code Formatting', desc: 'การจัดย่อหน้าโค้ดเป็นระเบียบและอ่านง่ายตามมาตรฐาน' },
    ],
    "DATA / AI": [
        { id: 'da1', label: 'Query Correctness', desc: 'ผลลัพธ์การ Query ถูกต้องตามโจทย์กำหนด' },
        { id: 'da2', label: 'Database Schema Design', desc: 'การออกแบบตารางและความสัมพันธ์มีความเหมาะสม' },
        { id: 'da3', label: 'Join Optimization', desc: 'เลือกใช้ Join ประเภทต่างๆ ได้อย่างมีประสิทธิภาพ' },
    ],
    "GAME / GRAPHICS": [
        { id: 'gg1', label: 'User Flow Clarity', desc: 'ลำดับการใช้งานของแอปพลิเคชันมีความเป็นเหตุเป็นผล' },
        { id: 'gg2', label: 'Visual Hierarchy', desc: 'การจัดวางองค์ประกอบศิลป์เน้นจุดสำคัญได้ถูกต้อง' },
        { id: 'gg3', label: 'Component Consistency', desc: 'การใช้สีและฟอนต์มีความสม่ำเสมอทั้งโปรเจกต์' },
    ]
};

// Color scheme per badge category
export const CATEGORY_COLOR: Record<string, string> = {
    "SOFTWARE / WEB": "bg-blue-500/10 border border-blue-500/20 text-blue-500",
    "DATA / AI": "bg-rose-500/10 border border-rose-500/20 text-rose-500",
    "CYBER / NETWORK": "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500",
    "GAME / GRAPHICS": "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500",
};

// Helper function to format relative time
export const timeAgo = (dateString: string): string => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + " seconds ago";
};
