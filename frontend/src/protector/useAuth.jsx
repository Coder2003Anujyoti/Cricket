import { useContext, createContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (newUser) => {
    sessionStorage.setItem("user", JSON.stringify(newUser)); // ✅ persist on login
    setUser(newUser);
  };

  const logout = () => {
    sessionStorage.removeItem("user"); // ✅ remove on logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAutho = () => useContext(AuthContext);
