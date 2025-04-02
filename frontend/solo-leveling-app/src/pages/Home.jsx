import '../App.css';
import SoloTrainingLogo from '../assets/solo-training-logo.png';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <>
            <div>
                <img src={SoloTrainingLogo} className="logo" alt="Solo Training Logo" />
            </div>
            <h2>- Bienvenido Jugador -</h2>
            <div className="card">
                <button onClick={() => navigate('/register')}>
                    Registrarme
                </button>
                <p></p>
                <button onClick={() => navigate('/login')}>
                    Iniciar Sesión
                </button>
            </div>
            <p className="read-the-docs">
                App en desarrollo...
            </p>
        </>
    );
}

export default Home;
