import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PlayerCreate = ({ onClose }) => {
  const [nombre, setNombre] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState({
    pushUps: "",
    sentadillas: "",
    crunches: "",
    correrTiempo: "",
    problemasRespiratorios: "no",
    deportesRapidos: "si",
    movimientosRapidos: "si",
    motivacion: "si",
    rendirse: "no",
  });

  // Obtener el userId del token almacenado en localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del JWT
      setUserId(decodedToken.userId);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRespuestas({ ...respuestas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("No se encontró el ID del usuario. Inicie sesión nuevamente.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Usuario no autenticado");
        return;
      }

      const body = {
        nombre,
        respuestas: Object.values(respuestas),
      };

      const response = await axios.post(`http://localhost:3000/players/${userId}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.playerId) {
        //localStorage.setItem("playerId", response.data._id);
        alert("Jugador creado con éxito");

        // Llamar a onClose para actualizar `playerId` en App.js
      if (onClose) {
        onClose(response.data._id);
      }

        navigate("/status");
      } else {
        alert("Error: No se recibió el ID del jugador.");
      }
    } catch (error) {
      console.error("Error al crear el jugador", error);
      alert("Error al crear el jugador");
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content p-4">
          <h2 className="text-center">Crear Jugador</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">

            <div className="mb-3">
              <label className="form-label">Nombre de jugador:</label>
              <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label">¿Cuántas repeticiones de push ups podés hacer seguidas?</label>
              <input type="number" className="form-control" name="pushUps" value={respuestas.pushUps} onChange={handleChange} min="1" required />
            </div>

            <div className="mb-3">
              <label className="form-label">¿Cuántas repeticiones de sentadillas podés hacer seguidas?</label>
              <input type="number" className="form-control" name="sentadillas" value={respuestas.sentadillas} onChange={handleChange} min="1" required />
            </div>

            <div className="mb-3">
              <label className="form-label">¿Cuántas repeticiones de crunches de abdominales podés hacer seguidas?</label>
              <input type="number" className="form-control" name="crunches" value={respuestas.crunches} onChange={handleChange} min="1" required />
            </div>

            <div className="mb-3">
              <label className="form-label">¿Cuánto tiempo podés correr sin detenerte? (minutos)</label>
              <input type="number" className="form-control" name="correrTiempo" value={respuestas.correrTiempo} onChange={handleChange} min="1" required />
            </div>

            <div className="mb-3">
              <label className="form-label">¿Fumás o tenés antecedentes de problemas respiratorios?</label>
              <select className="form-select" name="problemasRespiratorios" value={respuestas.problemasRespiratorios} onChange={handleChange}>
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">¿Practicás deportes que requieran movimientos rápidos?</label>
              <select className="form-select" name="deportesRapidos" value={respuestas.deportesRapidos} onChange={handleChange}>
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">¿Sentís que podés moverte rápido y con precisión?</label>
              <select className="form-select" name="movimientosRapidos" value={respuestas.movimientosRapidos} onChange={handleChange}>
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">¿Te sentís motivado para empezar a entrenar?</label>
              <select className="form-select" name="motivacion" value={respuestas.motivacion} onChange={handleChange}>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">¿Sentís que querés rendirte rápido cuando entrenás?</label>
              <select className="form-select" name="rendirse" value={respuestas.rendirse} onChange={handleChange}>
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary mt-2">Crear Jugador</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlayerCreate;
