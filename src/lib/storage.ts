
import { Meme, Category } from "@/types";

// Local storage keys
const MEMES_KEY = "mpomeme_memes";
const CATEGORIES_KEY = "mpomeme_categories";

// Get all memes from local storage
export const getMemes = (): Meme[] => {
  const memes = localStorage.getItem(MEMES_KEY);
  return memes ? JSON.parse(memes) : [];
};

// Add a new meme to local storage
export const addMeme = (meme: Omit<Meme, "id" | "createdAt" | "likes">): Meme => {
  const memes = getMemes();
  const newMeme: Meme = {
    ...meme,
    id: Date.now().toString(),
    createdAt: Date.now(),
    likes: 0,
  };
  
  localStorage.setItem(MEMES_KEY, JSON.stringify([newMeme, ...memes]));
  return newMeme;
};

// Like a meme
export const likeMeme = (id: string): void => {
  const memes = getMemes();
  const updatedMemes = memes.map(meme => 
    meme.id === id ? { ...meme, likes: meme.likes + 1 } : meme
  );
  
  localStorage.setItem(MEMES_KEY, JSON.stringify(updatedMemes));
};

// Get all categories from local storage
export const getCategories = (): Category[] => {
  const categories = localStorage.getItem(CATEGORIES_KEY);
  return categories ? JSON.parse(categories) : [
    { id: "random", name: "Рандом", createdAt: Date.now() }
  ];
};

// Add a new category to local storage
export const addCategory = (name: string): Category => {
  const categories = getCategories();
  
  // Check if category already exists
  if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("Такая категория уже существует!");
  }
  
  const newCategory: Category = {
    id: Date.now().toString(),
    name,
    createdAt: Date.now(),
  };
  
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify([...categories, newCategory]));
  return newCategory;
};
