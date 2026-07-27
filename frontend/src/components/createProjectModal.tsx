import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../assets/CSS/CreateProjectModal.css";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
}: CreateProjectModalProps) {
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

      const payload = JSON.parse(atob(token.split(".")[1]));
      const ownerId = payload.userId;

      await axios.post(
        "http://localhost:8080/api/projects/create",
        {
          name,
          description,
          ownerId,
          color,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onProjectCreated();
      setName("");
      setDescription("");
      setColor("#8B4513");
      onClose();
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Error creating project.");
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Create New Project</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="project-title" className="form-label">
              Project Title:
            </label>
            <input
              id="project-title"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-desc" className="form-label">
              Description:
            </label>
            <textarea
              id="project-desc"
              className="form-textarea"
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="color-section">
            <div
              className="book-preview"
              style={{ backgroundColor: color }}
              aria-label="Book Spine Preview"
            />

            <div className="color-picker-group">
              <label htmlFor="book-color" className="form-label">
                Book Color:
              </label>
              <div className="color-input-wrapper">
                <input
                  id="book-color"
                  type="color"
                  className="color-input"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <span className="color-code">{color}</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}