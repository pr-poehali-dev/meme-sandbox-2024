
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { addMeme, getCategories, addCategory, uploadImage } from "@/lib/storage";
import { Category } from "@/types";
import Header from "@/components/Header";
import { toast } from "@/components/ui/use-toast";
import { useProfile } from "@/lib/useProfile";

const AddMeme = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      const imageDataUrl = await uploadImage(file);
      setImageUrl(imageDataUrl);
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки",
        description: error.message || "Не удалось загрузить изображение",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMeme = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !imageUrl.trim()) {
      toast({
        title: "Ошибка!",
        description: "Название и изображение обязательны",
        variant: "destructive",
      });
      return;
    }
    
    if (!profile) {
      toast({
        title: "Необходимо войти",
        description: "Для добавления мема нужно войти в аккаунт",
        variant: "destructive",
      });
      return;
    }
    
    try {
      addMeme({
        title,
        image: imageUrl,
        category: category || categories[0]?.id || "",
        author: profile.username,
        authorId: profile.id,
        description: description.trim() || undefined,
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-10">
            <h2 className="text-3xl font-bold mb-4 sharp-title">НУЖНО ВОЙТИ</h2>
            <p className="mb-6 text-gray-600">Чтобы добавлять мемы, нужно войти в аккаунт</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => navigate("/")}
                className="rad-button px-4 py-2 bg-gray-300 text-black rounded"
              >
                На главную
              </button>
              <button 
                onClick={() => navigate("/login")}
                className="rad-button px-4 py-2 bg-gray-800 text-white rounded"
              >
                Войти
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2 sharp-title">ЗАЛЕЙ МЕМАС</h2>
            <p className="text-gray-600">Загружай картинку и заполняй поля</p>
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
                placeholder="Введи крутое название (можно **жирный** и *курсив*)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Для форматирования: **жирный**, *курсив*, [текст ссылки](url)
              </p>
            </div>
            
            <div>
              <label className="block font-bold mb-2">
                Изображение*
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rad-button px-4 py-2 bg-gray-800 text-white rounded"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Загрузить с устройства
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">или</span>
                  <input
                    type="text"
                    className="flex-1 cool-input p-2 rounded"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Вставь URL картинки"
                  />
                </div>
              </div>
              
              {isUploading && (
                <div className="mt-2 text-center">
                  <p>Загрузка...</p>
                </div>
              )}
              
              {imageUrl && !isUploading && (
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
              <label className="block font-bold mb-2" htmlFor="description">
                Описание (необязательно)
              </label>
              <textarea
                id="description"
                className="w-full cool-input p-2 rounded min-h-24"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Расскажи историю мема (можно **жирный** и *курсив*)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Для форматирования: **жирный**, *курсив*, [текст ссылки](url)
              </p>
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
                  {categories.length === 0 && (
                    <option value="">Нет категорий</option>
                  )}
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
