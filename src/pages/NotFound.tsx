
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold mb-4 cool-title">404</h1>
        <h2 className="text-2xl font-bold mb-6">О НЕТ! МЕМ НЕ НАЙДЕН</h2>
        <p className="mb-8 text-gray-600 max-w-lg mx-auto">
          Возможно, мем был настолько смешным, что ушел в другую вселенную. Или просто страницы не существует ¯\_(ツ)_/¯
        </p>
        <div className="text-8xl mb-8">💀</div>
        <Link to="/" className="rad-button px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black inline-block">
          ВЕРНИСЬ ДОМОЙ, БРАТАН
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
