import { useState, useEffect } from "react";
import "../../assets/CSS/wiki/categoryManagerModal.css";

export interface WikiCategory {
    id: number;
    name: string;
    position: number;
}

export interface WikiSubcategory {
    id: number;
    name: string;
    position: number;
    categoryId: number;
}

export interface SavePayload {
    categories: WikiCategory[];
    subcategories: WikiSubcategory[];
}

interface LocalCategoryState {
    id?: number;
    name: string;
    position: number;
    subcategories: {
        id?: number;
        name: string;
        position: number;
        categoryId?: number;
    }[];
}

interface CategoryManagerModalProps {
    isOpen: boolean;
    categories: WikiCategory[];
    subcategories: WikiSubcategory[];
    onClose: () => void;
    onSave: (payload: SavePayload) => Promise<void> | void;
}

export default function CategoryManagerModal({
    isOpen,
    categories: initialCategories,
    subcategories: initialSubcategories,
    onClose,
    onSave,
}: CategoryManagerModalProps) {
    const [localState, setLocalState] = useState<LocalCategoryState[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newSubCategoryNames, setNewSubCategoryNames] = useState<Record<number, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync incoming props into a nested editable structure when opening
    useEffect(() => {
        if (isOpen) {
            const sortedCategories = [...initialCategories].sort((a, b) => a.position - b.position);

            const mappedState: LocalCategoryState[] = sortedCategories.map((cat) => ({
                id: cat.id,
                name: cat.name,
                position: cat.position,
                subcategories: (initialSubcategories || [])
                    .filter((sub) => sub.categoryId === cat.id)
                    .sort((a, b) => a.position - b.position)
                    .map((sub) => ({
                        id: sub.id,
                        name: sub.name,
                        position: sub.position,
                        categoryId: sub.categoryId,
                    })),
            }));

            setLocalState(mappedState);
            setError(null);
        }
    }, [isOpen, initialCategories, initialSubcategories]);

    if (!isOpen) return null;

    const toggleExpand = (index: number) => {
        setExpandedCategories((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    // --- Category Handlers ---
    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        setLocalState((prev) => [
            ...prev,
            {
                id: -1,
                name: newCategoryName.trim(),
                position: prev.length,
                subcategories: [],
            },
        ]);
        setNewCategoryName("");
        console.log("Added new category:", localState);
    };

    const handleEditCategory = (index: number, name: string) => {
        setLocalState((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], name };
            return updated;
        });
    };

    const handleDeleteCategory = (index: number) => {
        if (localState.length <= 1) {
            setError("You must have at least one category.");
            return;
        }
        setError(null);
        setLocalState((prev) => prev.filter((_, i) => i !== index));
    };

    // --- Subcategory Handlers ---
    const handleAddSubCategory = (catIndex: number) => {
        const subName = newSubCategoryNames[catIndex];
        if (!subName || !subName.trim()) return;

        setLocalState((prev) => {
            const updated = [...prev];
            const targetCat = { ...updated[catIndex] };
            targetCat.subcategories = [
                ...targetCat.subcategories,
                {
                    id: -1,
                    name: subName.trim(),
                    position: targetCat.subcategories.length,
                    categoryId: targetCat.id,
                },
            ];
            updated[catIndex] = targetCat;
            return updated;
        });

        setNewSubCategoryNames((prev) => ({ ...prev, [catIndex]: "" }));
    };

    const handleEditSubCategory = (catIndex: number, subIndex: number, name: string) => {
        setLocalState((prev) => {
            const updated = [...prev];
            const targetCat = { ...updated[catIndex] };
            const updatedSubs = [...targetCat.subcategories];
            updatedSubs[subIndex] = { ...updatedSubs[subIndex], name };
            targetCat.subcategories = updatedSubs;
            updated[catIndex] = targetCat;
            return updated;
        });
    };

    const handleDeleteSubCategory = (catIndex: number, subIndex: number) => {
        setLocalState((prev) => {
            const updated = [...prev];
            const targetCat = { ...updated[catIndex] };
            targetCat.subcategories = targetCat.subcategories.filter((_, i) => i !== subIndex);
            updated[catIndex] = targetCat;
            return updated;
        });
    };

    // --- Submit Handler ---
    const handleSave = async () => {
        if (localState.length === 0) {
            setError("You must have at least one category.");
            return;
        }

        try {
            setIsSaving(true);

            const categoriesToSave: WikiCategory[] = [];
            const subcategoriesToSave: WikiSubcategory[] = [];

            localState.forEach((cat, catIdx) => {
                const categoryId = cat.id ?? Date.now() + catIdx;

                categoriesToSave.push({
                    id: categoryId,
                    name: cat.name,
                    position: catIdx,
                });

                cat.subcategories.forEach((sub, subIdx) => {
                    subcategoriesToSave.push({
                        id: sub.id ?? Date.now() + subIdx + 1000,
                        name: sub.name,
                        position: subIdx,
                        categoryId: categoryId,
                    });
                });
            });

            await onSave({
                categories: categoriesToSave,
                subcategories: subcategoriesToSave,
            });

            onClose();
        } catch (err) {
            setError("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Manage Categories</h2>
                    <button type="button" className="close-btn" onClick={onClose}>✕</button>
                </div>

                {error && <div className="modal-error-banner">{error}</div>}

                <div className="modal-body">
                    <div className="add-row">
                        <input
                            type="text"
                            placeholder="New category name..."
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                        />
                        <button type="button" className="btn btn-primary" onClick={handleAddCategory}>
                            + Category
                        </button>
                    </div>

                    <div className="category-list">
                        {localState.map((cat, catIdx) => (
                            <div key={cat.id ?? `cat-${catIdx}`} className="category-card">
                                <div className="category-header-row">
                                    <button
                                        type="button"
                                        className={`dropdown-toggle ${expandedCategories[catIdx] ? "expanded" : ""}`}
                                        onClick={() => toggleExpand(catIdx)}
                                        title="Toggle Subcategories"
                                    >
                                        ▶
                                    </button>

                                    <input
                                        type="text"
                                        className="category-name-input"
                                        value={cat.name}
                                        onChange={(e) => handleEditCategory(catIdx, e.target.value)}
                                    />

                                    <button
                                        type="button"
                                        className="btn-icon delete-btn"
                                        onClick={() => handleDeleteCategory(catIdx)}
                                        disabled={localState.length <= 1}
                                        title={localState.length <= 1 ? "Minimum 1 category required" : "Delete category"}
                                    >
                                        🗑️
                                    </button>
                                </div>

                                {expandedCategories[catIdx] && (
                                    <div className="subcategory-panel">
                                        <div className="subcategory-list">
                                            {cat.subcategories.map((sub, subIdx) => (
                                                <div key={sub.id ?? `sub-${subIdx}`} className="subcategory-row">
                                                    <span className="bullet">↪</span>
                                                    <input
                                                        type="text"
                                                        className="subcategory-name-input"
                                                        value={sub.name}
                                                        onChange={(e) => handleEditSubCategory(catIdx, subIdx, e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn-icon delete-btn"
                                                        onClick={() => handleDeleteSubCategory(catIdx, subIdx)}
                                                        title="Delete subcategory"
                                                    >
                                                        ✕ Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="add-row subcategory-add">
                                            <input
                                                type="text"
                                                placeholder="New subcategory name..."
                                                value={newSubCategoryNames[catIdx] || ""}
                                                onChange={(e) =>
                                                    setNewSubCategoryNames({ ...newSubCategoryNames, [catIdx]: e.target.value })
                                                }
                                                onKeyDown={(e) => e.key === "Enter" && handleAddSubCategory(catIdx)}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleAddSubCategory(catIdx)}
                                            >
                                                + Subcategory
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}