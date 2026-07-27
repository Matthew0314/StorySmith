import { Link } from 'react-router-dom';
import '../assets/CSS/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      
      {/* Top Navbar */}
      <nav className="home-navbar">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">⚔️</span> StorySmith
        </Link>
        
        <div className="nav-actions">
          <Link to="/login" className="btn-nav-primary">
            Log In
          </Link>
          <Link to="/register" className="btn-nav-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        {/* <div className="hero-badge">
          ✨ Your AI-Powered Worldbuilding Workspace
        </div> */}

        <h1 className="hero-title">
          Forge worlds, craft lore, and <br />
          <span className="hero-title-accent">build story universes</span>
        </h1>

        <p className="hero-description">
          The ultimate story development and project management tool. Organize characters, 
          factions, and lore while querying your entire universe in real-time.
        </p>

        <div className="hero-cta-group">
          <Link to="/register" className="btn-hero-primary">
            Start Building Free
          </Link>
          <Link to="/login" className="btn-hero-secondary">
            Sign In
          </Link>
        </div>
      </main>

      {/* Feature Showcase Grid */}
      <section className="features-section">
        <div className="features-grid">
          
          <div className="feature-card">
            <span className="feature-icon">📚</span>
            <h3>Custom Wikis</h3>
            <p>Structure your world with interconnected entries for characters, factions, and artifacts.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🔮</span>
            <h3>AI Lore Oracle</h3>
            <p>Ask questions about your world’s rules, find lore contradictions, and brainstorm motives.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🗺️</span>
            <h3>Team Collaboration</h3>
            <p>Collaborate with your team in real-time, keeping your narrative projects organized and synchronized.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        © {new Date().getFullYear()} StorySmith. All rights reserved.
      </footer>

    </div>
  );
}