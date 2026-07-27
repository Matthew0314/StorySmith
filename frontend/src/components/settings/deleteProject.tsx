import React, { useState } from "react";
import "../../assets/CSS/settings/deleteProject.css";
import axios from "axios";
import api from "../../api/axiosConfig"; // Import the configured axios instance

interface DeleteProjectModalProps {
    isOpen: boolean;
    projectId: number;
    projectName: string;
    onClose: () => void;
    onDeleted: () => void;
}

export default function DeleteProject({ isOpen, projectId, projectName, onClose, onDeleted }: DeleteProjectModalProps) {
    const [confirmation, setConfirmation] = useState("");
    const [loading, setLoading] = useState(false);

    const matches = confirmation === projectName;


    const deleteProject = async () => {

        if (!matches) return;

        setLoading(true);

        try {

            const token = localStorage.getItem("token");

            await api.delete(
                `/projects/${projectId}/settings`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            onDeleted();

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    return (
        <>
        {isOpen && (
            <div className="delete-modal-overlay">

                <div className="delete-modal">

                    <h2>Delete Project</h2>

                    <p>
                        This will remove the project from everyone's dashboard.
                    </p>

                    <p className="warning">
                        Type <strong>{projectName}</strong> to confirm.
                    </p>

                    <input
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        placeholder={projectName}
                    />

                    <div className="buttons">

                        <button
                            onClick={onClose}
                            className="secondary-btn"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={!matches || loading}
                            className="delete-btn"
                            onClick={deleteProject}
                        >
                            {loading ? "Deleting..." : "Delete Project"}
                        </button>

                    </div>

                </div>

            </div>
            )}
        </>
    );
}