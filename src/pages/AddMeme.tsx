
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addMeme, getCategories, addCategory } from "@/lib/storage";
import { Category } from "@/types";
import Header from "@/components/Header";
import { toast } from "@/components/ui/use-toast";

const AddMeme = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const handleAddMeme = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !imageUrl.trim()) {
      toast({
        title: "Ошибка!",
        description: "Название и URL картинки обязательны",
        variant: "destructive",
      });
      return;
    }
    
    try {
      addMeme({
        title,
        image: imageUrl,
        category: category || categories[0]?.id || "",
        author: author || "Анонимус",
      });
      
      toast({
        title: "Мем добавлен!",
        description: "Твой мем теперь в коллекции",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Ошибка!",
        description: "Не удалось добавить мем",
        variant: "destructive",
      });
    }
  };

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
      const createdCategory = addCategory(newCategory);
      setCategories(getCategories());
      setCategory(createdCategory.id);
      setNewCategory("");
      setShowCategoryForm(false);
      
      toast({
        title: "Категория создана!",
        description: `Категория "${createdCategory.name}" добавлена`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка!",
        description: error.message || "Не удалось создать категорию",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2 cool-title">ЗАЛЕЙ МЕМАС</h2>
            <p className="text-gray-600">Просто вставь ссылку на картинку и заполни поля</p>
          </div>
          
          <form onSubmit={handleAddMeme} className="space-y-6 bg-white p-6 rounded-lg border-2 border-gray-800">
            <div>
              <label className="block font-bold mb-2" htmlFor="title">
                Название мема*
              </label>
              <input
                id="title"
                type="text"
                className="w-full cool-input p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введи крутое название"
                required
              />
            </div>
            
            <div>
              <label className="block font-bold mb-2" htmlFor="imageUrl">
                URL картинки*
              </label>
              <input
                id="imageUrl"
                type="text"
                className="w-full cool-input p-2 rounded"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/meme.jpg"
                required
              />
              {imageUrl && (
                <div className="mt-2 border border-gray-300 rounded overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Предпросмотр"
                    className="w-full h-48 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Ошибка+загрузки";
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block font-bold mb-2" htmlFor="author">
                Твой ник (необязательно)
              </label>
              <input
                id="author"
                type="text"
                className="w-full cool-input p-2 rounded"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Кто ты такой?"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-bold" htmlFor="category">
                  Категория
                </label>
                <button 
                  type="button"
                  className="text-sm text-gray-600 underline"
                  onClick={() => setShowCategoryForm(prev => !prev)}
                >
                  {showCategoryForm ? "Отмена" : "Добавить категорию"}
                </button>
              </div>
              
              {showCategoryForm ? (
                <div className="border border-gray-300 p-3 rounded">
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
                      className="rad-button px-4 py-2 bg-gray-800 text-white rounded"
                    >
                      Создать
                    </button>
                  </form>
                </div>
              ) : (
                <select
                  id="category"
                  className="w-full cool-input p-2 rounded"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="flex justify-end gap-4">
              <button 
                type="button"
                className="rad-button px-6 py-2 bg-gray-300 rounded"
                onClick={() => navigate("/")}
              >
                Отмена
              </button>
              <button 
                type="submit"
                className="rad-button px-6 py-2 bg-gray-800 text-white rounded"
              >
                ЗАЛИТЬ МЕМ
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <footer className="border-t border-gray-300 py-4 text-center text-sm text-gray-500 mt-10">
        <p>© 2024 MPOMEME | made by 11 класс</p>
        <p className="text-xs">Работает на чистой магии и localStorage</p>
      </footer>
    </div>
  );
};

export default AddMeme;
