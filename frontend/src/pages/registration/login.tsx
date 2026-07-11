import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";


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
        <div className="Login">

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
            </form>

            {message && <p>{message}</p>}

            <div>
                <p>Don't have an account? <Link to="/register">Register here</Link></p> 
            </div>
        </div>
    );
}

export default Login;