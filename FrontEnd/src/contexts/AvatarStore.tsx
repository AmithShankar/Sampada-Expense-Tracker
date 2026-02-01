import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AvatarState {
  avatar: string | null;
  setAvatar: (avatar: string) => void;
  clearAvatar: () => void;
}

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set) => ({
      avatar: null,
      setAvatar: (avatar) => set({ avatar }),
      clearAvatar: () => set({ avatar: null }),
    }),
    {
      name: "avatar-session-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
