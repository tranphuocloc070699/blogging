"use client";

import { useUserStore } from "@/store/user.store";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { setGlobalAuth } from "@/lib/api";
import { UserService } from "@/services";
import { useTaxonomyStore } from "@/store/taxonomy.store";
import { useTermStore } from "@/store/term.store";
import type { User } from "@/types/users";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, accessToken, setUser, setAccessToken } = useUserStore();
  const userService = new UserService();
  const isAuthenticated = !!user && !!accessToken;

  const termStore = useTermStore();
  const taxonomyStore = useTaxonomyStore();



  // Sync access token with global auth whenever it changes
  useEffect(() => {
    if (accessToken) {
      setGlobalAuth(accessToken, refreshToken);
    } else {
      setGlobalAuth(null, null);
    }
  }, [accessToken]);

  // Try to refresh token on app start using refresh token cookie
  useEffect(() => {
    termStore.initialTerms();
    taxonomyStore.initialTaxonomies();
    refreshToken();
  }, []);

  const refreshToken = async (): Promise<boolean> => {
    try {
      const { body } = await userService.authenticate();

      if (body.data && body.data.accessToken && body.data.data) {
        setUser(body.data.data);
        setAccessToken(body.data.accessToken);
        // Update global auth for API calls
        setGlobalAuth(body.data.accessToken, refreshToken);
        setIsLoading(false);
        return true;
      }

      setUser({
        id: "",
        username: "",
        role: "",
        createdAt: "",
        updatedAt: "",
      });
      setAccessToken("");
      setGlobalAuth(null, null);
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      setUser({
        id: "",
        username: "",
        role: "",
        createdAt: "",
        updatedAt: "",
      });
      setAccessToken("");
      setGlobalAuth(null, null);
      setIsLoading(false);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
      setIsLoading(true);

      const { body } = await userService.login({ email, password });

      if (body.data && body.data.accessToken && body.data.data) {
        setUser(body.data.data);
        setAccessToken(body.data.accessToken);
        // Update global auth for API calls
        setGlobalAuth(body.data.accessToken, refreshToken);
        toast.success("Login successful");
        return { success: true, user: body.data.data };
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials.",
      );
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    }

    // Clear local state regardless of API call success
    setUser({
      id: "",
      username: "",
      role: "",
      createdAt: "",
      updatedAt: "",
    });
    setAccessToken("");
    setGlobalAuth(null, null);
    router.push("/login");
    toast.success("Logged out successfully");
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        accessToken,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
