
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "@/lib/storage";
import Header from "@/components/Header";
import { toast } from "@/components/ui/use-toast";
import { useProfile } from "@/lib/useProfile";

const Profile = () => {
  const navigate = useNavigate();
  const { profile, updateCurrentProfile, logout } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [telegramLink, setTelegramLink] = useState(profile?.links.telegram || "");
  const [vkLink, setVkLink] = useState(profile?.links.vk || "");
  const [youtubeLink, setYoutubeLink] = useState(profile?.links.youtube || "");
  const [cardNumber, setCardNumber] = useState(profile?.cardNumber || "");

  if (!profile) {
    navigate("/login");
    return null;
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      const imageDataUrl = await uploadImage(file);
      updateCurrentProfile({ avatar: imageDataUrl });
      
      toast({
        title: "Аватар обновлен!",
        description: "Твой новый аватар установлен",
      });
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

  const handleSaveProfile = () => {
    try {
      updateCurrentProfile({
        links: {
          telegram: telegramLink.trim() || undefined,
          vk: vkLink.trim() || undefined,
          youtube: youtubeLink.trim() || undefined,
        },
        cardNumber: cardNumber.trim() || undefined,
      });
      
      setIsEditing(false);
      
      toast({
        title: "Профиль обновлен!",
        description: "Твои данные сохранены",
      });
    } catch (error) {
      toast({
        title: "Ошибка!",
        description: "Не удалось обновить профиль",
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
            <h2 className="text-3xl font-bold mb-2 sharp-title">МОЙ ПРОФИЛЬ</h2>
            <p className="text-gray-600">Настрой свой аккаунт и получай донаты</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border-2 border-gray-800">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
              <div className="text-center">
                <div className="relative w-32 h-32 mb-2 mx-auto">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-800">
                    {profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt={profile.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/150x150?text=😎";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-4xl">
                        😎
                      </div>
                    )}
                  </div>
                  
                  <button 
                    type="button"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? "..." : "+"}
                  </button>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </div>
                <h3 className="text-xl font-bold">{profile.username}</h3>
                <p className="text-xs text-gray-500">
                  Регистрация: {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Данные профиля</h3>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        className="text-sm rad-button px-3 py-1 bg-gray-300 rounded"
                        onClick={() => setIsEditing(false)}
                      >
                        Отмена
                      </button>
                      <button 
                        type="button"
                        className="text-sm rad-button px-3 py-1 bg-gray-800 text-white rounded"
                        onClick={handleSaveProfile}
                      >
                        Сохранить
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      className="text-sm rad-button px-3 py-1 bg-gray-800 text-white rounded"
                      onClick={() => setIsEditing(true)}
                    >
                      Редактировать
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Ссылка Telegram</label>
                      <input
                        type="text"
                        className="w-full cool-input p-2 rounded text-sm"
                        value={telegramLink}
                        onChange={(e) => setTelegramLink(e.target.value)}
                        placeholder="https://t.me/username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold mb-1">Ссылка ВКонтакте</label>
                      <input
                        type="text"
                        className="w-full cool-input p-2 rounded text-sm"
                        value={vkLink}
                        onChange={(e) => setVkLink(e.target.value)}
                        placeholder="https://vk.com/username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold mb-1">Ссылка YouTube</label>
                      <input
                        type="text"
                        className="w-full cool-input p-2 rounded text-sm"
                        value={youtubeLink}
                        onChange={(e) => setYoutubeLink(e.target.value)}
                        placeholder="https://youtube.com/@username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold mb-1">Номер карты для донатов</label>
                      <input
                        type="text"
                        className="w-full cool-input p-2 rounded text-sm"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Это нужно для получения донатов от пользователей
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold">Социальные сети:</h4>
                      <ul className="space-y-1 mt-1">
                        {profile.links.telegram ? (
                          <li>
                            <a 
                              href={profile.links.telegram} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-gray-600 hover:underline"
                            >
                              Telegram
                            </a>
                          </li>
                        ) : null}
                        
                        {profile.links.vk ? (
                          <li>
                            <a 
                              href={profile.links.vk} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-gray-600 hover:underline"
                            >
                              ВКонтакте
                            </a>
                          </li>
                        ) : null}
                        
                        {profile.links.youtube ? (
                          <li>
                            <a 
                              href={profile.links.youtube} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-gray-600 hover:underline"
                            >
                              YouTube
                            </a>
                          </li>
                        ) : null}
                        
                        {!profile.links.telegram && !profile.links.vk && !profile.links.youtube && (
                          <li className="text-sm text-gray-500 italic">
                            Нет добавленных ссылок
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-bold">Карта для донатов:</h4>
                      {profile.cardNumber ? (
                        <p className="text-sm">
                          {profile.cardNumber}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Не указана
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-300 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  *Все данные хранятся только в localStorage вашего браузера
                </p>
                <button 
                  type="button"
                  className="rad-button px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Выйти
                </button>
              </div>
            </div>
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

export default Profile;
