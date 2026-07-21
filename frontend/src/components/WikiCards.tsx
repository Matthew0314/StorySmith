import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/CSS/wikiHome.css";

export interface WikiEntryDTO {
  id: number;
  title: string;
  content: string;
  position: number;
  subCategoryName: string;
  categoryName: string;
}

interface WikiEntriesListProps {
  entries: WikiEntryDTO[];
  selectedCategoryName?: string;
  selectedCategoryId: number | null;
  projectId: string | number;
  onCreateClick: () => void;
  onDiscardEntry?: (entryId: number) => void;
}

export default function WikiEntriesList({
  entries,
  selectedCategoryName,
  selectedCategoryId,
  projectId,
  onCreateClick,
  onDiscardEntry,
}: WikiEntriesListProps) {

    
  const navigate = useNavigate();

  const handleEdit = (entryId: number) => {
    // Navigate to the edit route for this entry
    navigate(`/projects/${projectId}/wiki/entries/${entryId}/edit`);
  };

  return (
    <div className="entries-section">
      <div className="entries-header">
        <h2 className="entries-title">
          {selectedCategoryName ? `Entries in ${selectedCategoryName}` : "Entries"}
        </h2>
        <button onClick={onCreateClick} className="btn-create">
          + Create New Entry
        </button>
      </div>

      {selectedCategoryId && entries.length > 0 ? (
        <div className="entries-grid">
          {entries.map((entry) => (
            <div key={entry.id} className="entry-card">
              {/* Top Content Area */}
              <div className="card-top">
                <div className="card-header-flex">
                  {/* Framed Image Placeholder */}
                  <div className="image-frame">
                    <div className="image-placeholder">
                      <svg
                        className="icon-svg"
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
                      <span className="placeholder-text">No Image</span>
                    </div>
                  </div>

                  {/* Title & Subcategory */}
                  <div className="card-details">
                    <h3 className="card-title">{entry.title}</h3>

                    <div className="card-tags">
                      <span>{entry.categoryName || "CATEGORY"}</span>
                      {entry.subCategoryName && (
                        <>
                          <span className="tag-bullet">•</span>
                          <span>{entry.subCategoryName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thin Divider Line */}
                <div className="card-divider"></div>

                {/* Summary Section */}
                <div className="summary-container">
                  <span className="summary-label">SUMMARY</span>
                  <p className="summary-text">
                    {entry.content || "No summary available."}
                  </p>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="card-footer">
                <button
                  className="action-btn border-right"
                  onClick={() => handleEdit(entry.id)}
                >
                  <svg
                    className="action-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  EDIT
                </button>

                <button
                  className="action-btn discard"
                  onClick={() => onDiscardEntry && onDiscardEntry(entry.id)}
                >
                  <svg
                    className="action-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  DISCARD
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-text">No entries available for this category.</p>
      )}
    </div>
  );
}