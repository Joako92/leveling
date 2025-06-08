import React, { useState, useEffect } from 'react';

export default function DailyQuest() {
  const [showInventory, setShowInventory] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [dailyQuest, setDailyQuest] = useState(null);
  const [loadingQuest, setLoadingQuest] = useState(true);
  const [questError, setQuestError] = useState(null);

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
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Error al obtener la quest diaria');
      }

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

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Quest Diaria</h2>
        {loadingQuest && <p>Cargando quest...</p>}
        {questError && <p style={{ color: 'red' }}>{questError}</p>}
        {dailyQuest && (
          <table className="w-full border border-gray-300 text-sm mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Ejercicio</th>
                <th className="py-2 px-4 border">Nivel</th>
                <th className="py-2 px-4 border">XP</th>
                <th className="py-2 px-4 border">Grupo</th>
                <th className="py-2 px-4 border">Descripción</th>
                <th className="py-2 px-4 border">Repeticiones</th>
                <th className="py-2 px-4 border">Quitar</th>
              </tr>
            </thead>
            <tbody>
              {dailyQuest.map((ejer) => (
                <tr key={ejer._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{ejer.nombre}</td>
                  <td className="py-2 px-4 border text-center">Nv.{ejer.nivel}</td>
                  <td className="py-2 px-4 border text-center">{ejer.xp}</td>
                  <td className="py-2 px-4 border capitalize text-center">{ejer.grupo}</td>
                  <td className="py-2 px-4 border">{ejer.descripcion}</td>
                  <td className="py-2 px-4 border text-center">{ejer.repeticiones}</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      onClick={() => handleRemoveFromQuest(ejer._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                      title="Eliminar ejercicio"
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button
        onClick={toggleInventory}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
      >
        Inventario
      </button>

      {showInventory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-11/12 max-w-5xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Inventario de Ejercicios</h2>
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100 cursor-pointer select-none">
                <tr>
                  <th onClick={() => handleSort('nivelMinimo')} className="py-2 px-4 border">Nivel mínimo {renderSortArrow('nivelMinimo')}</th>
                  <th onClick={() => handleSort('grupo')} className="py-2 px-4 border">Grupo {renderSortArrow('grupo')}</th>
                  <th onClick={() => handleSort('nombre')} className="py-2 px-4 border">Nombre {renderSortArrow('nombre')}</th>
                  <th onClick={() => handleSort('descripcion')} className="py-2 px-4 border">Descripción {renderSortArrow('descripcion')}</th>
                  <th className="py-2 px-4 border">Agregar</th>
                </tr>
              </thead>
              <tbody>
                {sortedExercises.map((ejer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border text-center">{ejer.nivelMinimo}</td>
                    <td className="py-2 px-4 border text-center capitalize">{ejer.grupo}</td>
                    <td className="py-2 px-4 border">{ejer.nombre}</td>
                    <td className="py-2 px-4 border">{ejer.descripcion}</td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        onClick={() => handleAddToQuest(ejer._id)}
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={toggleInventory}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
