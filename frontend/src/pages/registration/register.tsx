import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useHistory } from 'react-router-dom';
import { loginUser, registerUser } from "../../api/auth";
// import Navbar from "../components/Navbar";


function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div className="Register">

            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /> <br></br>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default Register;