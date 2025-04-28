
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Profile } from "@/types";
import { getProfiles } from "./storage";

interface ProfileContextType {
  profile: Profile | null;
  login: (username: string) => boolean;
  logout: () => void;
  updateCurrentProfile: (data: Partial<Profile>) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  login: () => false,
  logout: () => {},
  updateCurrentProfile: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Try to get stored profile on initial load
    const storedProfileId = localStorage.getItem("currentProfileId");
    if (storedProfileId) {
      const profiles = getProfiles();
      const foundProfile = profiles.find(p => p.id === storedProfileId);
      if (foundProfile) {
        setProfile(foundProfile);
      }
    }
  }, []);

  const login = (username: string): boolean => {
    const profiles = getProfiles();
    const foundProfile = profiles.find(p => p.username.toLowerCase() === username.toLowerCase());
    
    if (foundProfile) {
      setProfile(foundProfile);
      localStorage.setItem("currentProfileId", foundProfile.id);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setProfile(null);
    localStorage.removeItem("currentProfileId");
  };

  const updateCurrentProfile = (data: Partial<Profile>) => {
    if (!profile) return;
    
    const updatedProfile = { ...profile, ...data };
    setProfile(updatedProfile);
    
    // Update in storage
    const profiles = getProfiles();
    const updatedProfiles = profiles.map(p => 
      p.id === profile.id ? updatedProfile : p
    );
    
    localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
  };

  return (
    <ProfileContext.Provider value={{ profile, login, logout, updateCurrentProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
