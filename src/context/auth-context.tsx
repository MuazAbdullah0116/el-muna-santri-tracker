
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type UserType = "Asatidz" | "Musyrif" | "Wali" | null;

type AuthContextType = {
  user: UserType;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  skipLogin: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  skipLogin: () => {},
  isAuthenticated: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser as UserType);
      setIsAuthenticated(storedUser !== "Wali");
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Simple authentication logic based on specifications
    if (
      (username === "Asatidz" && password === "Elmuna123") ||
      (username === "Musyrif" && password === "Elmuna123")
    ) {
      setUser(username as UserType);
      setIsAuthenticated(true);
      localStorage.setItem("user", username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const skipLogin = () => {
    setUser("Wali");
    setIsAuthenticated(false);
    localStorage.setItem("user", "Wali");
  };

  const value = {
    user,
    login,
    logout,
    skipLogin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
