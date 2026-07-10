import { Link } from "react-router-dom"


function Home() {
  return (
    <>
        <div className="home">
        <h1>Welcome to StorySmith</h1>
        <p>Your ultimate tool for story development and project management.</p>
        </div>

        <div>
            <h2>
                Login
            </h2>
            <Link to="/login">Go to Login</Link>
            <Link to="/register">Go to Register</Link>
        </div>
    </>
  )
}

export default Home