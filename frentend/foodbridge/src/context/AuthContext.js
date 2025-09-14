
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setTokenState] = useState(() => localStorage.getItem("token") || null);

  const [userRole, setUserRoleState] = useState(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) return storedRole;
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser).role || JSON.parse(storedUser).userType : null;
  });

  const normalizeUser = (data, tokenValue = null) => {
    if (!data) return null;
    return {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role || data.userType || "user",
      profilePic: data.profilePic || "/default-avatar.png",
      image: data.profilePic || "/default-avatar.png", // for Navbar alias
      phone: data.phone || "",
      address: data.address || "",
      gender: data.gender || "",
      dob: data.dob || "",
      token: tokenValue || data.token || token,
      isVerified: data.isVerified ?? true,
      isBlocked: data.isBlocked ?? false,
    };
  };

  const login = (userData, tokenValue) => {
    if (!tokenValue) return console.error("❌ Token missing in login()");

    const normalized = normalizeUser(userData?.user || userData, tokenValue);

    setUserState(normalized);
    setTokenState(tokenValue);
    setUserRoleState(normalized.role);

    localStorage.setItem("user", JSON.stringify(normalized));
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("userRole", normalized.role);

    console.log("✅ User logged in:", normalized);
  };

  const logout = () => {
    setUserState(null);
    setTokenState(null);
    setUserRoleState(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    console.log("👋 User logged out");
  };

  const updateUser = (updatedData) => {
    const normalized = normalizeUser(updatedData, token);

    setUserState(normalized);
    localStorage.setItem("user", JSON.stringify(normalized));

    setUserRoleState(normalized.role);
    localStorage.setItem("userRole", normalized.role);

    console.log("🔄 User updated:", normalized);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userRole,
        login,
        logout,
        setUser: updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
