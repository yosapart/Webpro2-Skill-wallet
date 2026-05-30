import { signInWithPopup, setPersistence, browserSessionPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

export const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export const AuthService = {
  // ล็อกอินด้วย Google (Frontend)
  async loginWithGoogle() {
    try {
      // ตั้งค่าให้ไม่จำบัญชีเมื่อปิดเบราว์เซอร์
      await setPersistence(auth, browserSessionPersistence);

      const result = await signInWithPopup(auth, googleProvider);
      // ได้ Token มา
      const idToken = await result.user.getIdToken();

      // ส่ง Token ไปตรวจสอบกับ Backend
      const response = await fetch("http://localhost:3001/api/auth/login-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (data.status === "not_registered") {
        // ถ้าล็อกอินใน Firebase สำเร็จ แต่ยังไม่ได้สมัคร (ลง Firestore)
        return { success: false, requireRegistration: true, idToken, name: result.user.displayName };
      }

      if (data.status === "success") {
        // เก็บ Token และ Role ไว้ใน localStorage และ Cookies เพื่อให้ Middleware เช็คได้
        localStorage.setItem("token", idToken);
        localStorage.setItem("userRole", data.role);
        document.cookie = `token=${idToken}; path=/; max-age=86400`;
        document.cookie = `userRole=${data.role}; path=/; max-age=86400`;

        return { success: true, role: data.role, user: data.data };
      }

      throw new Error(data.message || "Login failed");
    } catch (error: any) {
      console.error("Login Error:", error);
      throw error;
    }
  },

  // ล็อกอินด้วย Email + Password (รองรับทั้งนักศึกษาผ่าน Firebase และอาจารย์ผ่าน API)
  async loginWithVerifierId(email: string, password?: string) {
    try {
      // 1. ลองล็อกอินผ่าน Firebase Authentication ก่อน (สำหรับนักศึกษา)
      try {
        const result = await signInWithEmailAndPassword(auth, email, password || "");
        const idToken = await result.user.getIdToken();

        // ส่ง Token ไปตรวจสอบกับ Backend เพื่อเอา Role
        const response = await fetch("http://localhost:3001/api/auth/login-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        const data = await response.json();

        if (data.status === "success") {
          localStorage.setItem("token", idToken);
          localStorage.setItem("userRole", data.role);
          document.cookie = `token=${idToken}; path=/; max-age=86400`;
          document.cookie = `userRole=${data.role}; path=/; max-age=86400`;

          return { success: true, role: data.role, user: data.data };
        }
      } catch (firebaseError: any) {
        // ถ้า Firebase หายูสเซอร์ไม่เจอ หรือรหัสผิด จะตกมาตรงนี้
        // เราปล่อยผ่านไปลองวิธีที่ 2 (ระบบอาจารย์)
        console.log("Firebase login failed, trying custom API...", firebaseError.code);
      }

      // 2. ถ้าวิธีแรกไม่สำเร็จ ให้ลองยิง API ตรวจสอบกับ Firestore โดยตรง (สำหรับอาจารย์)
      const response = await fetch("http://localhost:3001/api/auth/login/verifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password || "" }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // ใช้ Access Token ที่ได้จาก Backend จริงๆ (แทนของเดิมที่เป็น test-)
        const accessToken = data.accessToken || `test-${data.user_id}`;

        localStorage.setItem("token", accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        localStorage.setItem("userRole", data.role);
        document.cookie = `token=${accessToken}; path=/; max-age=3600`; // 1 ชั่วโมง
        document.cookie = `userRole=${data.role}; path=/; max-age=3600`;

        return { success: true, role: data.role, user: data.data };
      }

      throw new Error(data.message || "Invalid Email or Password");
    } catch (error: any) {
      console.error("Verifier Login Error:", error);
      throw error;
    }
  },

  // สมัครนักศึกษาใหม่ (ลง Firestore)
  async registerStudent(idToken: string, name: string) {
    const response = await fetch("http://localhost:3001/api/auth/register/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, name, avatar_url: DEFAULT_AVATAR }),
    });
    const data = await response.json();
    return data;
  },

  // ออกจากระบบ
  async logout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken"); // ลบ Refresh Token ด้วย
      localStorage.removeItem("userRole");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      await auth.signOut();
    } catch (error) {
      console.error("Logout error in AuthService:", error);
      throw error;
    }
  },

  // ดึง Token ที่สดใหม่เสมอ (ป้องกัน Token หมดอายุ) และอัปเดตลง localStorage/Cookie
  async getFreshToken(): Promise<string | null> {
    await auth.authStateReady();
    if (auth.currentUser) {
      // getIdToken() จะคืนค่า Token ปัจจุบัน หรือขอใหม่ให้ถ้าใกล้หมดอายุ
      const idToken = await auth.currentUser.getIdToken();

      // อัปเดตเก็บตัวล่าสุดไว้
      localStorage.setItem("token", idToken);
      document.cookie = `token=${idToken}; path=/; max-age=86400`;

      return idToken;
    }
    // Fallback สำหรับกรณีล็อกอินของอาจารย์ (Test Token) ที่ไม่ได้มาจาก Firebase
    return localStorage.getItem("token");
  }
};
