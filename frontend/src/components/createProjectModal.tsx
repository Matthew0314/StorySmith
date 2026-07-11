import React, { useState } from "react";
import axios from "axios";

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProjectCreated: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const [color, setColor] = useState("#8B4513");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authorization token found.");

            // Extract the userId from your token payload dynamically
            const payload = JSON.parse(atob(token.split(".")[1]));
            const ownerId = payload.userId;

            // Send standard Axios post with Authorization headers manually appended
            await axios.post(
                "http://localhost:8080/api/projects/create", 
                { 
                    name, 
                    description, 
                    ownerId,
                    color
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            onProjectCreated(); // Call refresh on dashboard
            setName("");
            setDescription("");
            setColor("#8B4513");
            onClose(); // Hide modal
        } catch (error) {
            console.error("Failed to create project:", error);
            alert("Error creating project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.content}>
                <h2>Create New Project</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block" }}>Project Title:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            style={{ width: "100%", padding: "8px" }}
                        />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block" }}>Description:</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            style={{ width: "100%", padding: "8px", height: "80px" }}
                        />
                    </div>

                    <div
                        style={{
                            width:"40px",
                            height:"120px",
                            backgroundColor: color,
                            borderRadius:"4px",
                            marginTop:"15px",
                            boxShadow:"4px 4px 8px rgba(0,0,0,.3)"
                        }}
                    />
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", marginBottom: "8px" }}>
                            Book Color:
                        </label>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                style={{
                                    width: "50px",
                                    height: "40px",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            />

                            <span>{color}</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const modalStyles: Record<string, React.CSSProperties> = {
    overlay: {
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
        alignItems: "center", justifyContent: "center", zIndex: 1000
    },
    content: {
        background: "white", padding: "24px", borderRadius: "8px",
        width: "400px", maxWidth: "90%", color: "#333"
    }
};