
import { useState, useEffect } from "react";
import { getCategories, addCategory, getMemes } from "@/lib/storage";
import { Category, Meme } from "@/types";
import Header from "@/components/Header";
import { toast } from "@/components/ui/use-toast";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [memes, setMemes] = useState<Meme[]>([]);

  useEffect(() => {
    setCategories(getCategories());
    setMemes(getMemes());
  }, []);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      toast({
        title: "Ошибка!",
        description: "Название категории не может быть пустым",
        variant: "destructive",
      });
      return;
    }
    
    try {
      addCategory(newCategory);
      setCategories(getCategories());
      setNewCategory("");
      
      toast({
        title: "Категория создана!",
        description: `Категория "${newCategory}" добавлена`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка!",
        description: error.message || "Не удалось создать категорию",
        variant: "destructive",
      });
    }
  };

  const getMemesCountByCategory = (categoryId: string) => {
    return memes.filter(meme => meme.category === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2 cool-title">КАТЕГОРИИ МЕМОВ</h2>
            <p className="text-gray-600">Добавляй свои категории и сортируй мемы</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border-2 border-gray-800 mb-8">
            <h3 className="text-xl font-bold mb-4">Создать категорию</h3>
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                className="flex-1 cool-input p-2 rounded"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Название новой категории"
              />
              <button 
                type="submit"
                className="rad-button px-4 py-2 bg-gray-800 text-white rounded whitespace-nowrap"
              >
                Создать категорию
              </button>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-lg border-2 border-gray-800">
            <h3 className="text-xl font-bold mb-4">Существующие категории</h3>
            
            {categories.length === 0 ? (
              <p className="text-gray-600 text-center py-4">Категорий пока нет ¯\_(ツ)_/¯</p>
            ) : (
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li 
                    key={category.id}
                    className="p-3 border border-gray-300 rounded flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <span className="font-bold">{category.name}</span>
                      <div className="text-xs text-gray-500">
                        Создана: {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-200 text-xs px-2 py-1 rounded">
                        {getMemesCountByCategory(category.id)} мемов
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
      
      <footer className="border-t border-gray-300 py-4 text-center text-sm text-gray-500 mt-10">
        <p>© 2024 MPOMEME | made by 11 класс</p>
        <p className="text-xs">Работает на чистой магии и localStorage</p>
      </footer>
    </div>
  );
};

export default Categories;
