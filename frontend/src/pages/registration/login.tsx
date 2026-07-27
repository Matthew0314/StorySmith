import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
import "../../assets/CSS/Auth.css";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // const { token } = await loginUser({ email, password });

            // localStorage.setItem("token", token);

            const responseData = await loginUser({ email, password });

        // Safely extract the token string out of the object
        const tokenString = responseData.token;
        localStorage.setItem("token", tokenString);

        // Optional: You can also save their username for the UI!
        localStorage.setItem("username", responseData.username);

            setMessage("Login successful!");

            navigate("/projects");
        } catch (err) {
            setMessage("Invalid email or password");
        }
    };

    return (
        <div className="auth-container">
        <div className="auth-card">
            
            <header className="auth-header">
            <h1>Welcome Back</h1>
            <p>Enter your credentials to access your workspace</p>
            </header>

            <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <label className="auth-label">Email</label>
                <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
                />
            </div>

            <div className="form-group">
                <label className="auth-label">Password</label>
                <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
                />
            </div>

            <button type="submit" className="btn-auth-submit">
                Login
            </button>
            </form>

            {message && <div className="auth-message">{message}</div>}

            <footer className="auth-footer">
            <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                Register here
                </Link>
            </p>
            </footer>

        </div>
        </div>
    );
}

export default Login;