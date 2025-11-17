import { create } from "zustand";
import { initialUser, User } from "@/types/users";

interface UserProps {
  accessToken: string;
  user: User;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
}
export const useUserStore = create<UserProps>((set) => ({
  accessToken: "",
  setAccessToken: (newToken) => set({ accessToken: newToken }),
  user: initialUser,
  setUser: (newUser) =>
    set(({ user: newUser, isAuthenticated: newUser.username.length > 0 })),
  isAuthenticated: false,
}));
