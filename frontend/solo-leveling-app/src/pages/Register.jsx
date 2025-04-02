import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
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

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            await axios.post("http://localhost:3000/users/register", {
                email: formData.email,
                password: formData.password,
            });

            alert("Registrado con éxito");
            navigate("/login"); // Redirigir al login tras registro exitoso
        } catch (err) {
            console.error("Error en el registro:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Error en el registro");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Registro</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Contraseña:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <label>Confirmar Contraseña:</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
}

// Estilos en línea para mostrar el formulario en columna
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

export default Register;
