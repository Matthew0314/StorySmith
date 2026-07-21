import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";



interface Project {
    id: number;
    name: string;
    description: string;
    ownerId: number;
    color: string;
}

export default function ProjectHomePage() {

    const { projectId } = useParams();

    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {

        const token = localStorage.getItem("token");

        axios.get(
            `http://localhost:8080/api/projects/${projectId}`,
            {headers: {
                Authorization: `Bearer ${token}`
            }}
        )
        .then(res => {
            setProject(res.data);
        });

    }, [projectId]);

    return (
        <div>
            <h1>
                Project {project?.name}
            </h1>

            <p>
                This is the project workspace.

            </p>

            <Link to={`/projects/${projectId}/settings`}>
                <button className="primary-btn">
                    Project Settings
                </button>
            </Link>

            <Link to={`/projects/${projectId}/wiki`}>
                <button className="primary-btn">
                    Project Wiki
                </button>
            </Link>
        </div>
    );
}

