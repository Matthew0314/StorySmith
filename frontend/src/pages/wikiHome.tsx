import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateWikiEntryPopup from "../components/CreateWikiEntryPopup";
import "../assets/CSS/wikiHome.css";
import WikiCards from "../components/WikiCards";
import CategoryManagerModal, { type SavePayload } from "../components/wiki/CategoryManagerModal";
import ProjectNavBar from "../components/ProjectNavBar";
import api from "../api/axiosConfig"; // Import the configured axios instance

interface WikiCategory {
    id: number;
    name: string;
    position: number;
}

interface WikiSubcategory {
    id: number;
    name: string;
    position: number;
    categoryId: number;
}

interface WikiEntryDTO {
    id: number;
    title: string;
    content: string;
    position: number;
    subCategoryName: string;
    categoryName: string;
    imageUrl?: string; // Optional image URL field
    summary?: string; // Optional summary field
}

export default function WikiHome() {
    const { projectId } = useParams();
    const [categories, setCategories] = useState<WikiCategory[]>([]);
    const [subcategories, setSubcategories] = useState<WikiSubcategory[]>([]);
    const [entries, setEntries] = useState<WikiEntryDTO[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<WikiCategory | null>(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (projectId) {
            fetchCategories();
        } else {
            console.error("Project ID is missing in the URL");
        }
    }, [projectId]);

    const fetchCategories = async () => {
        if (!token || !projectId) return;

        try {
            const res = await api.get(`/projects/${projectId}/wiki/category`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const subRes = await api.get(
                `/projects/${projectId}/wiki/subcategory`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const subcategoriesData = subRes.data?.body || subRes.data;

            setCategories(res.data);
            setSubcategories(subcategoriesData);

            if (res.data.length > 0) {
                const initialCategory = res.data[0];
                setSelectedCategoryId((prevId) => prevId ?? initialCategory.id);
                setSelectedCategory((prevCat) => prevCat ?? initialCategory);
                loadEntries(selectedCategoryId ?? initialCategory.id);
            }
        } catch (err) {
            console.error("Error fetching wiki categories:", err);
        } 
    };

    const loadEntries = async (categoryId: number) => {
        if (!token || !projectId) return;   

        try {
            const ent = await api.get(`/projects/${projectId}/wiki/category/${categoryId}/entries`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEntries(ent.data);
            console.log("Fetched entries for category:", ent.data);
        } catch (err) {
            console.error("Error fetching wiki entries for category:", err);
        }
    };

    const handleDiscardEntry = async (entryId: number) => {
        if (!window.confirm("Are you sure you want to delete this entry?")) return;

        try {
            await api.delete(
                `/projects/${projectId}/wiki/entries/${entryId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (selectedCategoryId) {
                loadEntries(selectedCategoryId);
            }
        } catch (err) {
            console.error("Failed to delete entry:", err);
        }
    };

    const handleSaveCategories = async (payload: SavePayload) => {
        try {
            await api.put(
                `/projects/${projectId}/wiki/categories/batch`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchCategories();
        } catch (err) {
            console.error("Failed to save categories batch:", err);
            throw err;
        }
    };

    return (
        <>
            
            <ProjectNavBar />
        
            <div className="wiki-container">
                <div className="wiki-header">
                    <div className="header-container">
                        <h1 className="wiki-title">Wiki</h1>
                        {/* <p className="wiki-subtitle">
                            Welcome to the Wiki Home Page. Manage and view all documentation for your project.
                        </p> */}
                        <div className="categories-page">
                            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                                ⚙️ Manage Categories
                            </button>

                            <CategoryManagerModal
                                isOpen={isModalOpen}
                                categories={categories}
                                subcategories={subcategories}
                                onClose={() => setIsModalOpen(false)}
                                onSave={handleSaveCategories}
                            />
                        </div>
                    </div>
                </div>

                <div className="categories-section">
                    {categories.length > 0 ? (
                        <div className="categories-list">
                            {categories.map((category) => {
                                const isSelected = selectedCategoryId === category.id;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setSelectedCategoryId(category.id);
                                            setSelectedCategory(category);
                                            loadEntries(category.id);
                                        }}
                                        className={`category-pill ${isSelected ? "selected" : ""}`}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="empty-text">No categories available.</p>
                    )}
                </div>

                <WikiCards
                    key={selectedCategoryId}
                    entries={entries}
                    selectedCategoryName={selectedCategory?.name}
                    selectedCategoryId={selectedCategoryId}
                    projectId={projectId || ""}
                    onCreateClick={() => setIsCreateOpen(true)}
                    onDiscardEntry={handleDiscardEntry}
                />

                <CreateWikiEntryPopup
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    projectId={Number(projectId)}
                    categoryId={selectedCategoryId ?? 0}
                    categories={categories}
                    subcategories={subcategories}
                    onEntryCreated={() => {
                        setIsCreateOpen(false);
                        if (selectedCategoryId) {
                            loadEntries(selectedCategoryId);
                        } else {
                            fetchCategories();
                        }
                    }}
                />
            </div>
        </>
    );
}