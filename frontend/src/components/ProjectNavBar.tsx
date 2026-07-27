import { Link, useParams } from 'react-router-dom';
import '../assets/CSS/ProjectNavBar.css';

export default function ProjectNavBar() {
  const { projectId } = useParams<{ projectId: string; entryId: string }>();

  return (
    <header className="navbar-header">
      {/* Left side */}
      <div className="navbar-section navbar-left">
        <Link to="/projects" className="navbar-link-brand">
          ← Projects
        </Link>
      </div>

      {/* Middle navigation */}
      <nav className="navbar-section navbar-middle">
        <Link
          to={`/projects/${projectId}`}
          className="navbar-link"
        >
          Home
        </Link>

        <Link
          to={`/projects/${projectId}/wiki`}
          className="navbar-link"
        >
          Wiki
        </Link>

        <Link
            to={`/projects/${projectId}/ai-chat`}
            className="navbar-link"
        >
            AI Chat
        </Link>

        <Link
          to={`/projects/${projectId}/settings`}
          className="navbar-link"
        >
          Settings
        </Link>
      </nav>

      {/* Right side */}
      <div className="navbar-section navbar-right">
        <Link to="/profile/" className="navbar-link">
          Profile
        </Link>
      </div>
    </header>
  );
}