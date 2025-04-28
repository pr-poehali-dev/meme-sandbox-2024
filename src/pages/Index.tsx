
import { useState, useEffect } from "react";
import { getMemes, getCategories, likeMeme } from "@/lib/storage";
import { Meme, Category } from "@/types";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const Index = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setMemes(getMemes());
    setCategories(getCategories());
  }, []);

  const handleLike = (id: string) => {
    likeMeme(id);
    setMemes(getMemes());
  };

  const filteredMemes = selectedCategory === "all" 
    ? memes 
    : memes.filter(meme => meme.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {memes.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-3xl font-bold mb-4 cool-title">ЗДЕСЬ ПОКА ПУСТО :/</h2>
            <p className="mb-6 text-gray-600">Добавь первый мем и стань легендой!</p>
            <Link to="/add" className="rad-button px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black inline-block">
              ЗАЛИТЬ МЕМ
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="font-bold">Фильтр:</span>
              <button 
                className={`px-3 py-1 rounded ${selectedCategory === "all" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
                onClick={() => setSelectedCategory("all")}
              >
                Все мемы
              </button>
              {categories.map(category => (
                <button 
                  key={category.id}
                  className={`px-3 py-1 rounded ${selectedCategory === category.id ? "bg-gray-800 text-white" : "bg-gray-200"}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <div className="meme-container">
              {filteredMemes.length > 0 ? (
                filteredMemes.map((meme) => (
                  <div key={meme.id} className="meme-card">
                    <div className="p-3 bg-gray-100 border-b border-gray-300">
                      <h3 className="text-lg font-bold truncate">{meme.title}</h3>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{meme.author || "Anonymous"}</span>
                        <span>{new Date(meme.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <img 
                      src={meme.image} 
                      alt={meme.title}
                      className="w-full h-64 object-cover object-center"
                    />
                    <div className="p-3 flex justify-between items-center">
                      <span className="bg-gray-200 text-xs px-2 py-1 rounded">
                        {categories.find(c => c.id === meme.category)?.name || "Без категории"}
                      </span>
                      <button 
                        className="flex items-center gap-1 rad-button bg-gray-200 px-3 py-1 rounded"
                        onClick={() => handleLike(meme.id)}
                      >
                        👍 {meme.likes}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-xl">В этой категории пока нет мемов ¯\_(ツ)_/¯</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      
      <footer className="border-t border-gray-300 py-4 text-center text-sm text-gray-500">
        <p>© 2024 MPOMEME | made by 11 класс</p>
        <p className="text-xs">Работает на чистой магии и localStorage</p>
      </footer>
    </div>
  );
};

export default Index;
