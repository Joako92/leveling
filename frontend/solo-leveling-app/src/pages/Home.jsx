//Home.jsx
import { useEffect } from "react";
import SoloTrainingLogo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  // Detectar si el jugador ya esta logeado y redirigir a status  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = JSON.parse(atob(token.split(".")[1])); // decodificar payload del JWT
        if (user && (user.jugadorId || localStorage.getItem("jugadorId"))) {
          navigate("/status"); // redirige automáticamente
        }
      } catch (err) {
        console.error("Token inválido:", err);
        // si falla la decodificación, no hacemos nada (se queda en Home)
      }
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <img src={SoloTrainingLogo} className="logo" alt="Solo Training Logo" />

      <div className="status-window">
        <h2>- Bienvenido Jugador -</h2>
        {/* Botones */}
        <button className="red-button" onClick={() => navigate("/login")}>
          Iniciar Sesión
        </button>
        <button className="red-button" onClick={() => navigate("/register")}>
          Registrarme
        </button>
      </div>
    </div>
  );
}

export default Home;
