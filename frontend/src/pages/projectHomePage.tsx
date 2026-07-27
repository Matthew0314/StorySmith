import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../assets/CSS/ProjectHomePage.css";
import ProjectNavBar from "../components/ProjectNavBar";
import api from "../api/axiosConfig"; // Import the configured axios instance
import type { ChangeEvent } from "react";

interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  color: string;
  coverImage: string | null;
}

export default function ProjectHomePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Image Upload States
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Form States
  const [text, setText] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textareas
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [text]);

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  }, [description]);

  // Fetch Project Details
  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProject(res.data);
        setText(res.data.name || "");
        setDescription(res.data.description || "");
        setCoverImage(res.data.coverImage || null);
        getImageUrl(); // Ensure the image URL is set correctly
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load project:", err);
        setError("Failed to load project details.");
        setLoading(false);
      });
  }, [projectId]);

  // Handle File Selection & Upload
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Show instant local preview in browser
    const localPreviewUrl = URL.createObjectURL(file);
    setImagePreview(localPreviewUrl);
    setIsUploading(true);

    // 2. Prepare FormData payload
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const data = res.data;

      if (data.imageUrl) {
        setCoverImage(data.imageUrl);
      } else {
        console.warn("Upload response missing 'imageUrl' key:", data);
      }

      await api.put(
        `/projects/${projectId}/cover-image`,
        { coverImage: data.imageUrl }
      );
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image. Check server logs or CORS configuration.");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to resolve cover image full URL
  const getImageUrl = () => {
    if (imagePreview) return imagePreview;
    if (!coverImage) return null;
    if (coverImage.startsWith("http://") || coverImage.startsWith("https://")) {
      return coverImage;
    }
    const cleanPath = coverImage.startsWith("/") ? coverImage : `/${coverImage}`;

    return `http://localhost:8080${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="project-container loading-state">
        <p>Loading workspace...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-container error-state">
        <p>{error || "Project not found."}</p>
        <Link to="/projects" className="secondary-btn">
          Back to Projects
        </Link>
      </div>
    );
  }

  const currentImageUrl = getImageUrl();

  return (
    <div className="project-home-page">
      <ProjectNavBar />
      <div className="project-container">
        {/* Header Banner */}
        <div className="banner-wrapper">
          <header
            className="project-banner"
            style={{
              borderLeftColor: project.color || "var(--color-primary)",
            }}
          >
            <div className="banner-content">
              <textarea
                ref={titleRef}
                className="project-title"
                value={text}
                rows={1}
                onChange={(e) => setText(e.target.value)}
              />
              <textarea
                ref={descriptionRef}
                className="project-description"
                value={description}
                rows={1}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </header>

          {/* Main Content Grid */}
          {/* <div className="project-grid">
            <section className="section-container">
              <h2 className="section-title">Quick Actions</h2>
              <div className="card-grid">
                <Link to={`/projects/${projectId}/wiki`} className="action-card">
                  <div className="card-icon">📖</div>
                  <div className="card-info">
                    <h3>Project Wiki</h3>
                    <p>Documentation, guides, and project notes.</p>
                  </div>
                </Link>

                <Link to={`/projects/${projectId}/settings`} className="action-card">
                  <div className="card-icon">⚙️</div>
                  <div className="card-info">
                    <h3>Project Settings</h3>
                    <p>Manage permissions, integrations, and preferences.</p>
                  </div>
                </Link>
              </div>
            </section>
          </div> */}
        </div>

        {/* Cover Image Upload Area */}
        <div className="picture-section">
          <div className="form-group">
            <div className="image-upload-wrapper">
              <label htmlFor="cover-image-input" className="image-preview-frame">
                {currentImageUrl ? (
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img
                      src={currentImageUrl}
                      alt="Cover Preview"
                      className="image-preview-img"
                    />
                    {isUploading && (
                      <div className="uploading-overlay">
                        <span>Uploading...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="image-upload-placeholder">
                    <svg
                      className="upload-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{isUploading ? "Uploading..." : "Upload Cover Image"}</span>
                  </div>
                )}
              </label>

              <input
                type="file"
                id="cover-image-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}