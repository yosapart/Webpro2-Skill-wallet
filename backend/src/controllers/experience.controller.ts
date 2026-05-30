import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export const ExperienceController = {
    async addItem(userId: string, body: any) {
        try {
            const userRef = db.collection("users").doc(userId);
            const userDoc = await userRef.get();
            const currentData = userDoc.data()?.experience || [];
            
            const newItem = {
                id: crypto.randomUUID(),
                ...body,
                created_at: new Date().toISOString()
            };

            await userRef.update({
                experience: [...currentData, newItem]
            });

            return { status: "success", data: newItem };
        } catch (error: any) {
            return { status: "error", message: error.message };
        }
    },

    async updateItem(userId: string, itemId: string, body: any) {
        try {
            const userRef = db.collection("users").doc(userId);
            const userDoc = await userRef.get();
            const currentData = userDoc.data()?.experience || [];
            
            const updatedData = currentData.map((item: any) => 
                item.id === itemId ? { ...item, ...body, updated_at: new Date().toISOString() } : item
            );

            await userRef.update({ experience: updatedData });
            return { status: "success", message: "Experience updated successfully" };
        } catch (error: any) {
            return { status: "error", message: error.message };
        }
    },

    async deleteItem(userId: string, itemId: string) {
        try {
            const userRef = db.collection("users").doc(userId);
            const userDoc = await userRef.get();
            const currentData = userDoc.data()?.experience || [];
            
            const filteredData = currentData.filter((item: any) => item.id !== itemId);
            await userRef.update({ experience: filteredData });
            return { status: "success", message: "Experience deleted successfully" };
        } catch (error: any) {
            return { status: "error", message: error.message };
        }
    }
};
