
import { Meme, Category, Profile } from "@/types";

// Memes
export const getMemes = (): Meme[] => {
  const memes = localStorage.getItem("memes");
  return memes ? JSON.parse(memes) : [];
};

export const addMeme = (memeData: Omit<Meme, "id" | "createdAt" | "likes" | "donations">): Meme => {
  const memes = getMemes();
  
  const newMeme: Meme = {
    ...memeData,
    id: `meme_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: Date.now(),
    likes: 0,
    donations: 0
  };
  
  localStorage.setItem("memes", JSON.stringify([newMeme, ...memes]));
  return newMeme;
};

export const likeMeme = (id: string): void => {
  const memes = getMemes();
  const updatedMemes = memes.map(meme => 
    meme.id === id ? { ...meme, likes: meme.likes + 1 } : meme
  );
  
  localStorage.setItem("memes", JSON.stringify(updatedMemes));
};

export const donateMeme = (id: string, amount: number): void => {
  const memes = getMemes();
  const updatedMemes = memes.map(meme => 
    meme.id === id ? { ...meme, donations: (meme.donations || 0) + amount } : meme
  );
  
  localStorage.setItem("memes", JSON.stringify(updatedMemes));
};

// Categories
export const getCategories = (): Category[] => {
  const categories = localStorage.getItem("categories");
  return categories ? JSON.parse(categories) : [];
};

export const addCategory = (name: string): Category => {
  const categories = getCategories();
  
  // Check if category already exists
  if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("Такая категория уже существует");
  }
  
  const newCategory: Category = {
    id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name,
    createdAt: Date.now()
  };
  
  localStorage.setItem("categories", JSON.stringify([...categories, newCategory]));
  return newCategory;
};

// Profiles
export const getProfiles = (): Profile[] => {
  const profiles = localStorage.getItem("profiles");
  return profiles ? JSON.parse(profiles) : [];
};

export const getProfileById = (id: string): Profile | undefined => {
  const profiles = getProfiles();
  return profiles.find(profile => profile.id === id);
};

export const getProfileByUsername = (username: string): Profile | undefined => {
  const profiles = getProfiles();
  return profiles.find(profile => profile.username.toLowerCase() === username.toLowerCase());
};

export const addProfile = (profileData: Omit<Profile, "id" | "createdAt">): Profile => {
  const profiles = getProfiles();
  
  // Check if username already exists
  if (profiles.some(profile => profile.username.toLowerCase() === profileData.username.toLowerCase())) {
    throw new Error("Такой пользователь уже существует");
  }
  
  const newProfile: Profile = {
    ...profileData,
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: Date.now()
  };
  
  localStorage.setItem("profiles", JSON.stringify([...profiles, newProfile]));
  return newProfile;
};

export const updateProfile = (id: string, profileData: Partial<Profile>): Profile => {
  const profiles = getProfiles();
  
  const updatedProfiles = profiles.map(profile => 
    profile.id === id ? { ...profile, ...profileData } : profile
  );
  
  localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
  return updatedProfiles.find(profile => profile.id === id) as Profile;
};

// Image upload helper
export const uploadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Не удалось загрузить изображение"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Не удалось прочитать файл"));
    };
    
    reader.readAsDataURL(file);
  });
};
