import React, { useState, useEffect } from 'react';

export default function DailyQuest() {
  const [showInventory, setShowInventory] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [dailyQuest, setDailyQuest] = useState(null);
  const [loadingQuest, setLoadingQuest] = useState(true);
  const [questError, setQuestError] = useState(null);

  useEffect(() => {
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

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Quest Diaria</h2>
        {loadingQuest && <p>Cargando quest...</p>}
        {questError && <p style={{ color: 'red' }}>{questError}</p>}
        {dailyQuest && (
          <ul className="list-disc pl-5 mt-2">
            {dailyQuest.map((ejer, i) => (
              <li key={i}>
                {ejer.nombre} - {ejer.descripcion} - {ejer.grupo}
              </li>
            ))}
          </ul>
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
                </tr>
              </thead>
              <tbody>
                {sortedExercises.map((ejer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border text-center">{ejer.nivelMinimo}</td>
                    <td className="py-2 px-4 border text-center capitalize">{ejer.grupo}</td>
                    <td className="py-2 px-4 border">{ejer.nombre}</td>
                    <td className="py-2 px-4 border">{ejer.descripcion}</td>
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
