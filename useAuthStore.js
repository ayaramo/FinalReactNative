import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config"; // استيراد الفايربيز

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      login: (userData) => set({ user: userData }), // تسجيل الدخول
      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null });
        } catch (error) {
          console.error("Error logging out: ", error.message);
        }
      },
    }),
    { name: "auth-storage" } // تخزين البيانات في localStorage
  )
);

export default useAuthStore;
