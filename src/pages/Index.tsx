
import { useState, useEffect } from "react";
import { getMemes, getCategories, likeMeme, donateMeme } from "@/lib/storage";
import { Meme, Category } from "@/types";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import TextFormatter from "@/lib/TextFormatter";
import { useProfile } from "@/lib/useProfile";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [donationAmount, setDonationAmount] = useState<{ [key: string]: number }>({});
  const { profile } = useProfile();

  useEffect(() => {
    setMemes(getMemes());
    setCategories(getCategories());
  }, []);

  const handleLike = (id: string) => {
    likeMeme(id);
    setMemes(getMemes());
  };

  const handleDonate = (id: string, memeAuthorId?: string) => {
    const amount = donationAmount[id] || 0;
    if (amount <= 0) {
      toast({
        title: "Ошибка доната",
        description: "Сумма должна быть больше нуля",
        variant: "destructive",
      });
      return;
    }

    if (!memeAuthorId) {
      toast({
        title: "Ошибка доната",
        description: "У автора мема не указана карта для доната",
        variant: "destructive",
      });
      return;
    }

    donateMeme(id, amount);
    setMemes(getMemes());
    
    toast({
      title: "Донат отправлен!",
      description: `Вы задонатили ${amount} рублей`,
    });
    
    // Reset donation amount
    setDonationAmount(prev => ({ ...prev, [id]: 0 }));
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
            <h2 className="text-3xl font-bold mb-4 sharp-title">ЗДЕСЬ ПОКА ПУСТО :/</h2>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemes.length > 0 ? (
                filteredMemes.map((meme) => (
                  <div key={meme.id} className="border-2 border-gray-800 rounded-lg overflow-hidden bg-white">
                    <div className="p-3 bg-gray-100 border-b border-gray-300">
                      <TextFormatter text={meme.title} className="text-xl font-bold" />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{meme.author || "Anonymous"}</span>
                        <span>{new Date(meme.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <img 
                      src={meme.image} 
                      alt={meme.title}
                      className="w-full h-64 object-cover object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Ошибка+загрузки";
                      }}
                    />
                    
                    {meme.description && (
                      <div className="p-3 border-t border-gray-300 bg-gray-50">
                        <TextFormatter text={meme.description} className="text-sm" />
                      </div>
                    )}
                    
                    <div className="p-3 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
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
                      
                      <div className="flex flex-col gap-2 mt-2 border-t border-gray-300 pt-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-bold">Донаты: {meme.donations || 0} ₽</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            min="1"
                            className="cool-input p-1 text-sm w-24" 
                            placeholder="Сумма"
                            value={donationAmount[meme.id] || ''}
                            onChange={(e) => setDonationAmount(prev => ({ 
                              ...prev, 
                              [meme.id]: parseInt(e.target.value) || 0 
                            }))}
                          />
                          <button 
                            className="rad-button bg-gray-800 text-white px-3 py-1 rounded text-sm"
                            onClick={() => handleDonate(meme.id, meme.authorId)}
                            disabled={!profile}
                          >
                            {profile ? "Задонатить" : "Войдите для доната"}
                          </button>
                        </div>
                      </div>
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
