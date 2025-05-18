import { useNavigate, useLocation } from "react-router-dom";

export default function NavigationMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 w-full flex justify-around bg-gray-800 text-white py-3 shadow-lg z-50">
      <button
        onClick={() => navigate("/status")}
        className={`px-4 py-2 rounded ${
          isActive("/status") ? "bg-blue-600" : "bg-gray-700"
        }`}
      >
        Status
      </button>
      <button
        onClick={() => navigate("/daily-quest")}
        className={`px-4 py-2 rounded ${
          isActive("/daily-quest") ? "bg-blue-600" : "bg-gray-700"
        }`}
      >
        Quest
      </button>
    </div>
  );
}
