import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export const EducationController = {
    async addItem(userId: string, body: any) {
        try {
            const userRef = db.collection("users").doc(userId);
            const userDoc = await userRef.get();
            const currentData = userDoc.data()?.education || [];
            
            const newItem = {
                id: crypto.randomUUID(),
                ...body,
                created_at: new Date().toISOString()
            };

            await userRef.update({
                education: [...currentData, newItem]
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
            const currentData = userDoc.data()?.education || [];
            
            const updatedData = currentData.map((item: any) => 
                item.id === itemId ? { ...item, ...body, updated_at: new Date().toISOString() } : item
            );

            await userRef.update({ education: updatedData });
            return { status: "success", message: "Education updated successfully" };
        } catch (error: any) {
            return { status: "error", message: error.message };
        }
    },

    async deleteItem(userId: string, itemId: string) {
        try {
            const userRef = db.collection("users").doc(userId);
            const userDoc = await userRef.get();
            const currentData = userDoc.data()?.education || [];
            
            const filteredData = currentData.filter((item: any) => item.id !== itemId);
            await userRef.update({ education: filteredData });
            return { status: "success", message: "Education deleted successfully" };
        } catch (error: any) {
            return { status: "error", message: error.message };
        }
    }
};
