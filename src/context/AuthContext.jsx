import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    user: null,
  });
  const [settingsPreference, setSettingsPreference] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isVerified, setIsVerfied] = useState(false);

  const {
    responseData: profileData,
    loading: profileLoading,
    error: profileError,
    refetch: profileRefetch,
  } = useFetch("/profile/me", {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });

  const {
    responseData: Settings,
    loading: SettingsLoading,
    error: SettingsError,
    refetch: SettingsRefetch,
  } = useFetch("/dashboard/settings", {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (auth.token) {
      if (!isTokenValid(auth.token)) {
        logout();
      } else {
        const decodedUser = jwtDecode(auth.token);
        setAuth((prevAuth) => ({ ...prevAuth, user: decodedUser }));
      }
    }
  }, [auth.token]);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
    if (profileData?.documents?.some((doc) => doc?.documentName?.startsWith("KTPPhoto"))) {
      setIsVerfied(true);
    }
  }, [profileData]);

  useEffect(() => {
    if (Settings) {
      setSettingsPreference(Settings);
    }
  }, [Settings]);

  const login = (token) => {
    if (isTokenValid(token)) {
      localStorage.setItem("token", token);
      setAuth({
        token: token,
        user: jwtDecode(token),
      });
      profileRefetch();
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
        isVerified,
        profileRefetch,
        SettingsLoading,
        SettingsError,
        settingsPreference,
        SettingsRefetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
