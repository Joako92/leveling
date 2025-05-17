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

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Recuperar contraseña</h2>
      <input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-2"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Enviar enlace
      </button>
      {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
    </form>
  );
}

export default ForgotPassword;
