import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/CSS/settings.css";
import axios from "axios";
import DeleteProjectModal from "../components/settings/deleteProject.tsx";
import { useNavigate } from "react-router-dom";
import InviteUsers from "../components/settings/inviteUsers.tsx";
import ProjectNavBar from "../components/ProjectNavBar.tsx";

import api from "../api/axiosConfig"; // Import the configured axios instance

interface Role {
    id: number;
    name: string;
    permissions: string[];
}


interface Member {
    userId: number;
    username: string;
    email: string;
    roles: Role[];
}


interface ProjectSettingsDTO {
    projectId: number;
    projectName: string;
    members: Member[];
    roles: Role[];
}


export default function ProjectSettings() {

    const { projectId } = useParams();

    const [aiEnabled, setAiEnabled] = useState();

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [inviteOpen, setInviteOpen] = useState(false);

    const [roles, setRoles] = useState<Role[]>([]);

    const [settings, setSettings] = useState<ProjectSettingsDTO | null>(null);

    const params = useParams();
    let token = localStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(() => {
        if (projectId) {
            fetchSettings();
        } else {
            console.error("Project ID is missing in URL parameters. PARAMS:", params);
            console.error(`Project ID is missing in URL parameters. ${projectId}`);
        }
    }, [projectId]);

    

    const fetchSettings = async () => {
        if (!token) return;


        try {
            // Pass raw axios query along with manually configured headers
            const res = await api.get(`/projects/${projectId}/settings`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const id = JSON.parse(atob(token.split(".")[1])).userId;
            const roles = await api.get(`/projects/${projectId}/roles/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setRoles(roles.data);

            console.log(res.data);
            setSettings(res.data);
            setAiEnabled(res.data.useAI);
            console.log("Fetched project settings:", res.data);
        } catch (err) {
            console.error("Failed to fetch projects database list:", err);
        }
    };

    const toggleAIFeatures = async (enabled: boolean) => {

        if (!roles.some(role => role.name.toUpperCase() === "OWNER")) {
            alert("Only project owners can change AI settings.");
            return;
        }
        
        setAiEnabled(enabled);

        

        try {
            const res = await api.post(
                `/projects/${projectId}/settings/ai`, 
                { enabled },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("AI settings updated:", res.data);
        } catch (err) {
            console.error("Failed to update AI settings:", err);
        }
        // Here you would also send this preference to your backend to save it
    };

    const removeUser = async (userId: number) => {

        try {

            await api.delete(
                `/projects/${projectId}/settings/members/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchSettings();

        } catch (err) {
            console.error("Failed to remove user:", err);
        }
    };

    if(!settings){
        return <div>Loading settings...</div>;
    }





    return (
        <>
        <ProjectNavBar />
        <div className="settings-container">


            <div className="settings-header">
                <div>
                    <h1>Project Settings</h1>
                    {/* <p>
                        Manage members, roles, and project configuration
                    </p> */}
                </div>

                {/* <span className="project-id">
                    Project #{settings.projectId}
                </span> */}
            </div>



            {/* MEMBERS */}
            <section className="settings-section">

                <div className="section-title">
                    <h2>Members</h2>

                    <button className="primary-btn" onClick={() => setInviteOpen(true)}>
                        + Invite Member
                    </button>
                </div>

                {inviteOpen && (
                    <InviteUsers
                        isOpen={inviteOpen}
                        projectId={settings.projectId}
                        onClose={() => setInviteOpen(false)}
                        onInvited={() => {
                            fetchSettings();
                            setInviteOpen(false);
                        }}
                    />
                )}

                <div className="member-list">

                    {settings.members.map(member => (

                        <div className="member-card" key={member.userId}>

                            <div className="avatar">
                                {member.username[0].toUpperCase()}
                            </div>

                            <div className="member-info">
                                <h3>
                                    {member.username}
                                </h3>

                                <p>
                                    {
                                        member.roles
                                        .map(role => role.name)
                                        .join(", ")
                                    }
                                </p>
                            </div>


                            {
                                !member.roles.some(
                                    role => role.name === "Owner"
                                ) &&
                                <>
                                {!member.roles.some(role => role.name.toUpperCase() === "OWNER") && 
                                <button className="secondary-btn" onClick={() => removeUser(member.userId)}>
                                    Remove Member
                                </button>
                                }
                                
                                <button className="secondary-btn">
                                    Edit Roles
                                </button>
                                </>

                            }

                        </div>

                    ))}

                </div>

            </section>




            {/* ROLES */}
            {/* <section className="settings-section">

                <div className="section-title">
                    <h2>Roles</h2>

                    <button className="primary-btn">
                        + Create Role
                    </button>
                </div>


                <div className="role-grid">

                    {
                        settings.roles.map(role => (

                            <div className="role-card" key={role.id}>

                                <h3>
                                    {role.name}
                                </h3>


                                <ul>

                                    {
                                        role.permissions.map(permission => (
                                            <li key={permission}>
                                                ✓ {permission}
                                            </li>
                                        ))
                                    }

                                </ul>

                                {
                                    role.name !== "Owner" &&
                                    <button className="secondary-btn">
                                        Manage Permissions
                                    </button>
                                }

                            </div>

                        ))
                    }

                </div>


            </section> */}




            {/* AI */}
            <section className="settings-section">

                <h2>
                    AI Features
                </h2>


                <div className="toggle-card">

                    <div>
                        <h3>
                            Enable AI Assistance
                        </h3>

                        <p>
                            Allows AI tools to analyze and assist with project content.
                        </p>
                    </div>


                    <label className="switch">

                        <input
                            type="checkbox"
                            
                            onChange={() =>
                                toggleAIFeatures(!aiEnabled)
                            }
                            checked={aiEnabled}
                        />

                        <span className="slider"></span>

                    </label>

                </div>

            </section>




            {/* DELETE */}
            {roles.some(role => role.name === "OWNER") && (
                <section className="danger-section">

                    <h2>
                        Danger Zone
                    </h2>

                    <p>
                        Deleting this project will remove it from your dashboard.
                        You can restore it later.
                    </p>


                    <button
                        className="delete-btn"
                        onClick={() => setDeleteOpen(true)}
                    >
                        Delete Project
                    </button>


                </section>
            )}

            <DeleteProjectModal
                isOpen={deleteOpen} 
                projectId={settings.projectId}
                projectName={settings.projectName}
                onClose={() => setDeleteOpen(false)}
                onDeleted={() => navigate("/projects")}
            />


            


        </div>
        </>
    );
}