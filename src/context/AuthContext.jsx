import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  };

  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenValid(token)) {
      try {
        const decodedUser = jwtDecode(token);
        return { token, user: decodedUser };
      } catch (error) {
        localStorage.removeItem("token");
        return { token: null, user: null };
      }
    }
    return { token: null, user: null };
  });

  const {
    responseData: profileData,
    loading: profileLoading,
    error: profileError,
    refetch: profileRefetch,
  } = useFetch("/profile/me", {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    skip: !auth.token || !isTokenValid(auth.token),
  });

  const {
    responseData: settingsData,
    loading: settingsLoading,
    error: settingsError,
    refetch: settingsRefetch,
  } = useFetch("/dashboard/settings", {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    skip: !auth.token || !isTokenValid(auth.token),
  });

  useEffect(() => {
    if (auth.token && !isTokenValid(auth.token)) {
      logout();
    }
  }, [auth.token, isTokenValid]);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData.userProfile);
    }
  }, [profileData]);

  const login = (token) => {
    if (isTokenValid(token)) {
      localStorage.setItem("token", token);
      const user = jwtDecode(token);
      setAuth({
        token,
        user,
      });
      if (user?.role === "admin" || user?.role === "super") {
        navigate("/dashboard");
      } else {
        profileRefetch();
        navigate("/homepage");
      }
    } else {
      console.error("Invalid or expired token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({
      token: null,
      user: null,
    });
    setProfile(null);
    setSettingsPreference(null);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        profile,
        profileLoading,
        profileError,
        login,
        logout,
        profileRefetch,
        settingsRefetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
