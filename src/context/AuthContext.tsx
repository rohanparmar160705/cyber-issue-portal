"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI, UserResponse } from "@/api/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const userData = await AuthAPI.getMe();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (data: any) => {
    const response = await AuthAPI.login(data);
    setUser(response.user);
    // Token is usually handled by cookies in the backend or stored here
    // Our api.ts doesn't seem to handle token storage yet, assuming cookies
    router.push("/dashboard");
  };

  const register = async (data: any) => {
    await AuthAPI.register(data);
    await login({ email: data.email, password: data.password });
  };

  const logout = async () => {
    await AuthAPI.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

