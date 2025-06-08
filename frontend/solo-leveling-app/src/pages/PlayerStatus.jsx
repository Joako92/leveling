import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlayerCreate from './PlayerCreate';

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
  let availablePoints = (player.nivel * 5)

  return (
    <div>
      <h1>Estado del Jugador</h1>
      <h2>----------♦</h2>
      <p>Nombre: {player.nombre} - Nivel: {player.nivel}</p>
      <p>Rango: {player.rango} - Título: {player.titulo}</p>
      <p>XP: {player.racha}</p>
      <h2>----------♦</h2>
      <p>Fuerza: {player.estadisticas.fuerza} - Resistencia: {player.estadisticas.resistencia}</p>
      <p>Agilidad: {player.estadisticas.agilidad} - Inteligencia: {player.estadisticas.inteligencia}</p>
      <p>Puntos disponibles: {availablePoints}</p>
      <h2>----------♦</h2>
    </div>
  );
};

export default PlayerStatus;
