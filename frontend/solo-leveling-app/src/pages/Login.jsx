import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Enviar datos al backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/users/login", {
                email: formData.email,
                password: formData.password,
            });

            const token = response.data.token;
            localStorage.setItem("token", token); // Guardar JWT en localStorage
            alert("Inicio de sesión exitoso");
            navigate("/status"); // Redirigir al estado del jugador
        } catch (err) {
            console.error("Error en el login:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Credenciales incorrectas");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Contraseña:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
}

// Estilos en línea para el formulario en columna
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        width: "300px",
        gap: "10px",
    }
};

export default Login;
