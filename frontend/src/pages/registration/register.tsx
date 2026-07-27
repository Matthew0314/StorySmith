import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useHistory } from 'react-router-dom';
import { loginUser, registerUser } from "../../api/auth";
// import Navbar from "../components/Navbar";
import "../../assets/CSS/Auth.css";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log("SUBMIT CLICKED");
        e.preventDefault();
        console.log("SUBMIT CLICKED");

        try {
            const res = await registerUser({
                email,
                username,
                firstName,
                lastName,
                password
            });

            setMessage(res.data);

            const { token } = await loginUser({ email, password });
            localStorage.setItem("token", token);

            navigate("/projects");

            



        } catch (err: any) {
            console.log(err);
            setMessage(err.response?.data || "Error registering user");
        }
    };

    return (
        <div className="auth-container">
        <div className="auth-card">
            
            <header className="auth-header">
            <h1>Create Account</h1>
            <p>Join StorySmith to start building your lore</p>
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
                <label className="auth-label">Username</label>
                <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
                required
                />
            </div>

            <div className="form-grid-two">
                <div className="form-group">
                <label className="auth-label">First Name</label>
                <input
                    type="text"
                    placeholder="First"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="auth-input"
                    required
                />
                </div>

                <div className="form-group">
                <label className="auth-label">Last Name</label>
                <input
                    type="text"
                    placeholder="Last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="auth-input"
                    required
                />
                </div>
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
                Register
            </button>
            </form>

            {message && <div className="auth-message">{message}</div>}

            <footer className="auth-footer">
            <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                Sign in
                </Link>
            </p>
            </footer>

        </div>
        </div>
    )
}

export default Register;