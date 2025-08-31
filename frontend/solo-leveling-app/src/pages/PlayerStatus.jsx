import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlayerCreate from './PlayerCreate';
import './PlayerStatus.css';

const PlayerStatus = () => {
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState("");
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    const fetchPlayerStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuario no autenticado");
          return;
        }
  
        const user = JSON.parse(atob(token.split(".")[1]));
        let storedPlayerId = localStorage.getItem("jugadorId") || user.jugadorId;
  
        if (!storedPlayerId) {
          setPlayerId(null);
          return;
        }
  
        setPlayerId(storedPlayerId);
  
        const response = await axios.get(`http://localhost:3000/players/${storedPlayerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setPlayer(response.data);
      } catch (err) {
        console.error("Error al obtener el estado del jugador:", err);
        setError("Error al cargar los datos del jugador");
      }
    };
  
    fetchPlayerStatus();
  }, []);  

  if (!playerId) {
    return <PlayerCreate onClose={(newPlayerId) => setPlayerId(newPlayerId)} />;
  }

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!player) return <p>Cargando estado del jugador...</p>;
  let availablePoints = (player.nivel * 5);

  return (
    <div className="home-container">
      <div className="status-window">
        <h2 className="window-title">- VENTANA DE ESTADO -</h2>

        <div className="section general-info">
          <p><strong>Nombre:</strong> {player.nombre} <strong>Nivel:</strong> {player.nivel}</p>
          <p><strong>Rango:</strong> {player.rango} <strong>Título:</strong> {player.titulo}</p>
        </div>

        <hr className="divider" />

        <div className="section hp-mp">
          <p><strong>HP:</strong> {player.hp} <strong>MP:</strong> {player.mp}</p>
        </div>

        <hr className="divider" />

        <div className="section stats">
          <p><strong>Fuerza:</strong> {player.estadisticas.fuerza} <strong>Resistencia:</strong> {player.estadisticas.resistencia}</p>
          <p><strong>Agilidad:</strong> {player.estadisticas.agilidad} <strong>Inteligencia:</strong> {player.estadisticas.inteligencia}</p>
        </div>

        <hr className="divider" />

        <div className="section points">
          <p><strong>Puntos disponibles:</strong> {availablePoints}</p>
        </div>

        <hr className="divider" />

        <div className="section skills">
          <p><strong>Habilidades pasivas:</strong> Ninguna</p>
          <p><strong>Habilidades activas:</strong> Autoridad de Gobernante: LV. {player.nivel}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatus;
