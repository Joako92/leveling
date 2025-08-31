import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            localStorage.setItem("token", token);
            navigate("/status");
        } catch (err) {
            console.error("Error en el login:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Credenciales incorrectas");
        }
    };
    
    // formulario
    return (
        <div className="home-container">
            <div className="status-window">
                <h2>- Iniciar Sesión -</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <form onSubmit={handleSubmit} className="form-container">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="input-field"
                    />

                    <label>Contraseña:</label>
                    <div style={{ position: "relative", width: "100%" }}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="input-field"
                            style={{ width: "100%", paddingRight: "40px" }}
                        />
                        <span 
                            onClick={() => setShowPassword(!showPassword)} 
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#555"
                            }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button type="submit" className="red-button">Ingresar</button>

                    <p>
                        <a href="/forgot-password" className="link">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </p>
                    <p>
                        <a href="/register" className="link">
                            ¿No tenés cuenta? Registrarse
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
