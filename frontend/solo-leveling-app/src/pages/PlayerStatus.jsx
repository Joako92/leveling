import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlayerStatus = () => {
  const [playerStatus, setPlayerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = "67e71721881db86001415854"; 

  useEffect(() => {
    const fetchPlayerStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/players/${userId}`);
        setPlayerStatus(response.data); 
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPlayerStatus();
  }, [userId]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar el estado del jugador: {error.message}</div>;

  if (!playerStatus) {
    return <div>No hay información del jugador disponible.</div>;
  }

  return (
    <div>
      <h1>Estado del Jugador</h1>
      <p>Nombre: {playerStatus.nombre}</p>
      <p>Nivel: {playerStatus.nivel}</p>
      <p>Rango: {playerStatus.rango}</p>
      <p>Título: {playerStatus.titulo}</p>
      <p>Racha: {playerStatus.racha}</p>
      <h2>Estadísticas</h2>
      <p>Fuerza: {playerStatus.estadisticas.fuerza}</p>
      <p>Agilidad: {playerStatus.estadisticas.agilidad}</p>
      <p>Resistencia: {playerStatus.estadisticas.resistencia}</p>
      <p>Inteligencia: {playerStatus.estadisticas.inteligencia}</p>
    </div>
  );
};

export default PlayerStatus;
