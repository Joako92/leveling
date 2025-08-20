//DailyQuest.jsx
import React, { useState, useEffect } from 'react';
import './DailyQuest.css';

export default function DailyQuest() {
  const [showInventory, setShowInventory] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [dailyQuest, setDailyQuest] = useState(null);
  const [loadingQuest, setLoadingQuest] = useState(true);
  const [questError, setQuestError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({}); // Al cambiar de pagina vuelve al estado inicial TODO!

  const fetchDailyQuest = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(atob(token.split(".")[1]));
      const playerId = localStorage.getItem('jugadorId') || user.jugadorId;

      if (!token || !playerId) {
        setQuestError("Faltan credenciales del jugador");
        setLoadingQuest(false);
        return;
      }

      const response = await fetch('http://localhost:3000/quest', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener la quest diaria');
      }

      const data = await response.json();
      setDailyQuest(data);
    } catch (error) {
      console.error('Error al cargar la quest diaria:', error);
      setQuestError('No se pudo cargar la quest diaria');
    } finally {
      setLoadingQuest(false);
    }
  };

  useEffect(() => {
    fetchDailyQuest();
  }, []);

  // Cargar inventario de ejercicios
  const toggleInventory = () => {
    setShowInventory(!showInventory);
  };

  useEffect(() => {
    if (showInventory) {
      fetch('http://localhost:3000/exercises')
        .then(res => res.json())
        .then(data => setExercises(data))
        .catch(err => console.error('Error al cargar ejercicios:', err));
    }
  }, [showInventory]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedExercises = [...exercises].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (!sortConfig.key) return 0;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    const aStr = aVal?.toString().toLowerCase() || '';
    const bStr = bVal?.toString().toLowerCase() || '';
    return sortConfig.direction === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '⬆️' : '⬇️';
  };

  // Quitar ejercicio de la quest diaria
  const handleRemoveFromQuest = async (questExerciseId) => {
  const confirmDelete = window.confirm("¿Seguro desea eliminar el ejercicio? Se perderá la XP acumulada.");
  if (!confirmDelete) return;

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`http://localhost:3000/quest/remove/${questExerciseId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el ejercicio');
    }

    await fetchDailyQuest();
  } catch (error) {
    console.error('No se pudo eliminar el ejercicio:', error);
  }
};

  // Agregar ejercicio a la quest diaria
  const handleAddToQuest = async (exerciseId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/quest/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ exerciseId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al agregar ejercicio a la quest');
      }

      const data = await response.json();
      console.log('Ejercicio agregado:', data);

      fetchDailyQuest();
    } catch (error) {
      console.error('Error al agregar ejercicio:', error.message);
      alert('No se pudo agregar el ejercicio: ' + error.message);
    }
  };

  // Marcar ejercicio como completo
  const handleCompleteExercise = async (exerciseId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/quest/complete', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ exerciseId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al completar ejercicio');
      }

      const data = await response.json();
      console.log('Ejercicio completado: ', data);

      fetchDailyQuest();
    } catch (error) {
      console.error('Error al completar ejercicio: ', error.message);
      alert('No se pudo completar el ejercicio: ' + error.message);
    }

    setCompletedExercises((prev) => ({
      ...prev,
      [exerciseId]: true,
    }));
  };

  return (
    <div className='home-container'>
      <div className="daily-quest-window">
        <div className="mb-4">
          <h2 className="window-title">QUEST DIARIA</h2>

          {loadingQuest && <p>Cargando quest...</p>}
          {questError && <p style={{ color: 'red' }}>{questError}</p>}
          
          {dailyQuest && (
            <table className="daily-quest-table">
              <thead>
                <tr>
                  <th>Ejercicio</th>
                  <th>Nivel</th>
                  <th>Repeticiones</th>
                  <th>Completado</th>
                  <th>Más</th>
                </tr>
              </thead>
              <tbody>
                {dailyQuest.map((ejer) => (
                  <tr key={ejer._id}>
                    <td>{ejer.nombre}</td>
                    <td className="text-center">Nv.{ejer.nivel}</td>
                    <td className="text-center">{ejer.repeticiones}</td>
                    <td className="text-center">
                      <button
                        className={`daily-quest-button ${completedExercises[ejer._id] ? 'completed' : ''}`}
                        onClick={() => handleCompleteExercise(ejer._id)}
                        disabled={completedExercises[ejer._id]}
                      >
                        {completedExercises[ejer._id] ? 'Completo' : 'Completar'}
                      </button>
                    </td>
                    <td className="text-center">
                    <button
                      className="daily-quest-button"
                      onClick={() => setSelectedExercise(ejer)}
                    >Ver más</button>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal con más detalles */}
        {selectedExercise && (
          <div
            className="inventory-modal"
            onClick={() => setSelectedExercise(null)}
          >
            <div
              className="inventory-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="window-title">{selectedExercise.nombre}</h2>
              <p><strong>XP:</strong> {selectedExercise.xp}</p>
              <p><strong>Grupo:</strong> {selectedExercise.grupo}</p>
              <p><strong>Descripción:</strong> {selectedExercise.descripcion}</p>
              <p className="text-center">
                      <button
                        onClick={() => handleRemoveFromQuest(selectedExercise._id)}
                        className="red-button"
                      >
                        Quitar ejercicio
                      </button>
                    </p>

              <button
                onClick={() => setSelectedExercise(null)}
                className="daily-quest-button bg-red-500 mt-4"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        
      </div>
      <button onClick={toggleInventory} className="daily-quest-button mt-4">
          Inventario
        </button>

        {showInventory && (
          <div className="inventory-modal">
            <div className="inventory-content">
              <h2 className="window-title">Inventario de Ejercicios</h2>
              <button onClick={toggleInventory} className="daily-quest-button mt-4 bg-red-500 hover:bg-red-600">
                Cerrar
              </button>
              <table className="status-window">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('nivelMinimo')}>Nivel mínimo {renderSortArrow('nivelMinimo')}</th>
                    <th onClick={() => handleSort('grupo')}>Grupo {renderSortArrow('grupo')}</th>
                    <th onClick={() => handleSort('nombre')}>Nombre {renderSortArrow('nombre')}</th>
                    <th onClick={() => handleSort('descripcion')}>Descripción {renderSortArrow('descripcion')}</th>
                    <th>Agregar</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExercises.map((ejer, index) => (
                    <tr key={index}>
                      <td className="text-center">{ejer.nivelMinimo}</td>
                      <td className="text-center capitalize">{ejer.grupo}</td>
                      <td>{ejer.nombre}</td>
                      <td>{ejer.descripcion}</td>
                      <td className="text-center">
                        <button
                          className="add-button"
                          onClick={() => handleAddToQuest(ejer._id)}
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  
);
}
