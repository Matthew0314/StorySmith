import { useState, useEffect } from "react";
import axios from "axios";
import CreateProjectModal from "../components/createProjectModal";
import "../assets/CSS/projects.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";
  
interface Project {
    id: number;
    name: string;
    description: string;
    ownerId: number;
    color: string;
    deleted: boolean;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    
    
    let token = localStorage.getItem("token");
    let currentUserId: number | null = null;

    if (token) {
        try {
            currentUserId = JSON.parse(atob(token.split(".")[1])).userId;
        } catch (e) {
            console.error("Error decoding token context:", e);
        }
    }

    const fetchProjects = async () => {
        if (!token) return;

        try {
            // Pass raw axios query along with manually configured headers
            const res = await axios.get(`http://localhost:8080/api/projects/${currentUserId}/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProjects(res.data);
        } catch (err) {
            console.error("Failed to fetch projects database list:", err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Split listings on the UI frontend layer directly
    const ownedProjects = projects.filter(p => p.ownerId === currentUserId);
    const collaboratorProjects = projects.filter(p => p.ownerId !== currentUserId);

    function createBookGradient(hex: string) {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);

        const lighten = (value: number) =>
            Math.min(255, Math.floor(value * 1.35));

        const darken = (value: number) =>
            Math.floor(value * 0.55);


        const light = `rgb(
            ${lighten(r)},
            ${lighten(g)},
            ${lighten(b)}
        )`;

        const dark = `rgb(
            ${darken(r)},
            ${darken(g)},
            ${darken(b)}
        )`;

        return `linear-gradient(
            to bottom,
            ${light},
            ${hex},
            ${dark}
        )`;
    }

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Projects Dashboard</h1>
                <button onClick={() => setIsModalOpen(true)} style={{ padding: "10px 16px", cursor: "pointer" }}>
                    + New Project
                </button>
            </div>

            <hr />

            {/* --- OWNED --- */}
            <h2>My Projects (Owner)</h2>
            {/* {ownedProjects.length === 0 ? <p>You haven't created any projects yet.</p> : (
                <div style={gridStyle}>
                    {ownedProjects.map(project => (
                        <div key={project.id} style={cardStyle}>
                            <h3>{project.name}</h3>
                            <p>{project.description}</p>
                        </div>
                    ))}
                </div>
            )} */}
            <div className="bookshelf">
                {ownedProjects
                .filter(project => !project.deleted)
                .map(project => (
                    <div className="book" 
                    key={project.id} 
                    onClick={() => navigate(`/projects/${project.id}`)}>
                        <div className="book-inner">

                            <div className="book-spine"
                                style={{ background: createBookGradient(project.color) }}>
                                <span>{project.name}</span>
                            </div>

                            <div className="book-cover">
                                <h3>{project.name}</h3>
                                <p>{project.description}</p>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {/* --- COLLABORATOR --- */}
            <h2>Collaborations</h2>
            {collaboratorProjects.length === 0 ? <p>You are not a collaborator on any projects.</p> : (
                <div className="bookshelf">
                    {collaboratorProjects
                    .filter(project => !project.deleted)
                    .map(project => (
                        <div className="book" key={project.id} onClick={() => navigate(`/projects/${project.id}`)}>
                            <div className="book-inner">

                                <div className="book-spine"
                                    style={{ background: createBookGradient(project.color) }}>
                                    <span>{project.name}</span>
                                </div>

                                <div className="book-cover">
                                    <h3>{project.name}</h3>
                                    <p>{project.description}</p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL POPUP (NO INTERCEPTORS USED) --- */}
            <CreateProjectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onProjectCreated={fetchProjects} 
            />
        </div>
    );
}

const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
    marginBottom: "40px"
};

const cardStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "16px",
    backgroundColor: "#fafafa",
    color: "#333"
};