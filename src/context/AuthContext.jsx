import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect, useCallback } from "react";
import useFetch from "../hooks/useFetch";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    user: null,
  });
  const [settingsPreference, setSettingsPreference] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Helper to check if the token is valid
  const isTokenValid = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      console.error("Error decoding token", error);
      return false;
    }
  }, []);

  const {
    responseData: profileData,
    loading: profileLoading,
    error: profileError,
    refetch: profileRefetch,
  } = useFetch("/profile/me", {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    skip: !auth.token || !isTokenValid(auth.token), // Only fetch if the token is valid
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
    skip: !auth.token || !isTokenValid(auth.token), // Only fetch if the token is valid
  });

  useEffect(() => {
    // Token validation effect
    if (auth.token && !isTokenValid(auth.token)) {
      logout();
    }
  }, [auth.token, isTokenValid]);

  useEffect(() => {
    // Decode token and set user state
    if (auth.token && isTokenValid(auth.token)) {
      const decodedUser = jwtDecode(auth.token);
      setAuth((prevAuth) => ({ ...prevAuth, user: decodedUser }));
    }
  }, [auth.token, isTokenValid]);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData.userProfile);
      setIsProfileComplete(profileData.isComplete);
    }
  }, [profileData]);

  useEffect(() => {
    if (settingsData) {
      setSettingsPreference(settingsData);
    }
  }, [settingsData]);

  const login = (token) => {
    if (isTokenValid(token)) {
      localStorage.setItem("token", token);
      setAuth({
        token,
        user: jwtDecode(token),
      });
      profileRefetch();
      settingsRefetch();
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
        isProfileComplete,
        profileRefetch,
        settingsLoading,
        settingsError,
        settingsPreference,
        settingsRefetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
