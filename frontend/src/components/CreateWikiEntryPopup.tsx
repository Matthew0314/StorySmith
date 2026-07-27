import React, { useState, useEffect, useMemo } from "react";
import "../assets/CSS/CreateWikiEntryPopup.css";
import axios from "axios";

interface WikiEntryProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  categoryId?: number;
  categories?: { id: number; name: string }[];
  subcategories?: { id: number; name: string; position: number; categoryId: number }[];
  onEntryCreated: () => void;
}

export default function CreateWikiEntryPopup({
  isOpen,
  onClose,
  projectId,
  categoryId: initialCategoryId,
  categories = [],
  subcategories = [],
  onEntryCreated,
}: WikiEntryProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeSubcategories = Array.isArray(subcategories) ? subcategories : [];

  // 1. FILTER SUBCATEGORIES DYNAMICALLY
  const filteredSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return safeSubcategories.filter(
      (sub) => Number(sub.categoryId) === Number(selectedCategory)
    );
  }, [selectedCategory, safeSubcategories]);

  // 2. SYNC INITIAL CATEGORY WHEN MODAL OPENS
  useEffect(() => {
    if (isOpen) {
      if (initialCategoryId && initialCategoryId !== 0) {
        console.log("Available subcategories for initial category:", subcategories);
        setSelectedCategory(initialCategoryId);
      } else if (safeCategories.length > 0) {
        setSelectedCategory(safeCategories[0].id);
      }
    }
  }, [isOpen, initialCategoryId, safeCategories]);

  // 3. AUTO-SELECT FIRST SUBCATEGORY WHEN FILTERED LIST CHANGES
  useEffect(() => {
    if (filteredSubcategories.length > 0) {
      // Check if current selection is valid for the new filtered list
      const isValid = filteredSubcategories.some(
        (sub) => Number(sub.id) === Number(selectedSubcategory)
      );
      if (!isValid) {
        setSelectedSubcategory(filteredSubcategories[0].id);
      }
    } else {
      setSelectedSubcategory("");
    }
  }, [filteredSubcategories]);

  // EARLY RETURN MUST BE BELOW ALL HOOKS
  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const createEntry = async () => {
    const activeCategory = selectedCategory || initialCategoryId;

    if (!title || !projectId || !activeCategory) {
      console.error("Missing required fields", {
        title,
        projectId,
        categoryId: activeCategory,
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/projects/${projectId}/wiki/create/${activeCategory}`,
        {
          title,
          subcategoryId: selectedSubcategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      setTitle("");
      setImagePreview(null);
      setSelectedSubcategory("");
      onEntryCreated();
      onClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Entry</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Entry Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., The Battle of Oakhaven"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(Number(e.target.value))}
              >
                {safeCategories.length > 0 ? (
                  safeCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value={initialCategoryId || 0}>
                    Default Category
                  </option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subcategory</label>
              <select
                className="form-select"
                value={selectedSubcategory}
                onChange={(e) => { setSelectedSubcategory(Number(e.target.value)); console.log("Selected subcategory:", e.target.value); 
                console.log("Check " + selectedSubcategory);
                }}
                disabled={filteredSubcategories.length === 0}
              >
                {filteredSubcategories.length > 0 ? (
                  filteredSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))
                ) : (
                  <option value="">No subcategories available</option>
                )}
              </select>
            </div>
          </div>

          {/* <div className="form-group">
            <label className="form-label">Cover Artwork</label>
            <div className="image-upload-wrapper">
              <div className="image-preview-frame">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview-img"
                  />
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
                    <span>No Image Chosen</span>
                  </div>
                )}
              </div>

              <label className="file-input-btn">
                <span>Upload Artwork</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div> */}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button
            disabled={!title || !selectedCategory || loading}
            onClick={createEntry}
            className="btn-submit"
          >
            {loading ? "Creating..." : "Create Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}