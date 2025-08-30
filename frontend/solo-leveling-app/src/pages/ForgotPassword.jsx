import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/users/forgot-password", { email });
      setMensaje("Revisá tu correo para restablecer tu contraseña (ver consola backend)");
      console.log("Reset Link:", res.data.resetLink);
    } catch (err) {
      setMensaje("Error al enviar solicitud");
      console.error(err);
    }
  };

  // to do !
  return (
    <div className="home-container">
      <div className="status-window">
        <h2>- Recuperar contraseña -</h2>
        
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="red-button">
            Enviar enlace
          </button>
          {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
