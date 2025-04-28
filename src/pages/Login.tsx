
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProfile, getProfileByUsername } from "@/lib/storage";
import Header from "@/components/Header";
import { toast } from "@/components/ui/use-toast";
import { useProfile } from "@/lib/useProfile";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useProfile();
  
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!username.trim()) {
      toast({
        title: "Ошибка!",
        description: "Имя пользователя не может быть пустым",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      if (isLogin) {
        // Login
        const success = login(username);
        if (success) {
          toast({
            title: "Успешный вход!",
            description: `Добро пожаловать, ${username}!`,
          });
          navigate("/profile");
        } else {
          toast({
            title: "Ошибка входа",
            description: "Пользователь не найден",
            variant: "destructive",
          });
        }
      } else {
        // Register
        const existingUser = getProfileByUsername(username);
        if (existingUser) {
          toast({
            title: "Ошибка регистрации",
            description: "Пользователь с таким именем уже существует",
            variant: "destructive",
          });
        } else {
          const newProfile = addProfile({
            username,
            links: {},
          });
          
          login(username);
          
          toast({
            title: "Регистрация успешна!",
            description: "Ваш профиль создан",
          });
          
          navigate("/profile");
        }
      }
    } catch (error: any) {
      toast({
        title: "Ошибка!",
        description: error.message || "Что-то пошло не так",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2 sharp-title">
              {isLogin ? "ВХОД" : "РЕГИСТРАЦИЯ"}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? "Войди, чтобы добавлять мемы и получать донаты" 
                : "Создай аккаунт для публикации мемов"
              }
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border-2 border-gray-800">
            <div>
              <label className="block font-bold mb-2" htmlFor="username">
                Имя пользователя
              </label>
              <input
                id="username"
                type="text"
                className="w-full cool-input p-2 rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введи своё имя"
                required
              />
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                type="button"
                className="text-sm text-gray-600 underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin 
                  ? "Нет аккаунта? Зарегистрируйся" 
                  : "Уже есть аккаунт? Войти"
                }
              </button>
              
              <button 
                type="submit"
                className="rad-button px-6 py-2 bg-gray-800 text-white rounded"
                disabled={isLoading}
              >
                {isLoading ? "Загрузка..." : isLogin ? "ВОЙТИ" : "СОЗДАТЬ АККАУНТ"}
              </button>
            </div>
          </form>
          
          <div className="mt-10 text-center text-sm text-gray-500">
            <p>Мы используем супер передовую технологию: localStorage.</p>
            <p>Твои данные надёжно хранятся на твоём компьютере!</p>
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

export default Login;
