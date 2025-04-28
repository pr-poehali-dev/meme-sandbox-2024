
import { Link } from "react-router-dom";
import { useProfile } from "@/lib/useProfile";

const Header = () => {
  const { profile } = useProfile();

  return (
    <header className="border-b-2 border-gray-800 py-4 mb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/">
            <h1 className="text-5xl sharp-title mb-2 md:mb-0">
              MPOMEME
            </h1>
          </Link>
          <div className="flex gap-2">
            <p className="text-sm italic mb-2 md:mb-0 hidden md:block">Раньше здесь был мат, пам пам пам</p>
          </div>
          <nav className="flex gap-4">
            <Link to="/" className="rad-button px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">
              Главная
            </Link>
            <Link to="/add" className="rad-button px-4 py-2 bg-gray-800 text-white rounded hover:bg-black">
              + Добавить
            </Link>
            <Link to="/categories" className="rad-button px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              Категории
            </Link>
            <Link to={profile ? "/profile" : "/login"} className="rad-button px-4 py-2 bg-gray-800 text-white rounded hover:bg-black">
              {profile ? "Профиль" : "Войти"}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
