import React, { useEffect, useState } from "react";
import "./Calendar.css"; // Importar el CSS

function Calendar() {
  const [racha, setRacha] = useState(0);
  const [dias, setDias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        const rachaRes = await fetch("http://localhost:3000/calendar/racha", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rachaData = await rachaRes.json();
        setRacha(rachaData.racha);

        const calendarRes = await fetch("http://localhost:3000/calendar", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const calendarData = await calendarRes.json();

        const fechasFormateadas = Array.isArray(calendarData.calendario)
          ? calendarData.calendario.map((fechaISO) => {
              const f = new Date(fechaISO);
              return `${f.getDate().toString().padStart(2, "0")}/${(f.getMonth() + 1)
                .toString()
                .padStart(2, "0")}/${f.getFullYear()}`;
            })
          : [];

        setDias(fechasFormateadas);
      } catch (err) {
        console.error("Error fetching calendar data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className='home-container'>
      <div className="status-window">
        <h2 className="window-title">CALENDARIO</h2>
        <div className="racha-card">
          <h2>Racha: {racha}</h2>
        </div>

        <hr className="divider" />

        <h2 className="window-title">Días completados:</h2>
        {dias.length === 0 ? (
          <p>No hay días registrados</p>
        ) : (
          <ul className="days-list">
            {dias.map((dia, index) => (
              <li key={index}>{dia}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Calendar;
