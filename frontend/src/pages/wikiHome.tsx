import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CreateWikiEntryPopup from "../components/CreateWikiEntryPopup";
import "../assets/CSS/wikiHome.css";
import WikiCards from "../components/WikiCards";

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
}

export default function WikiHome() {


    const { projectId } = useParams();
    const [categories, setCategories] = useState<WikiCategory[]>([]);
    const [subcategories, setSubcategories] = useState<WikiSubcategory[]>([]);
    const [entries, setEntries] = useState<WikiEntryDTO[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<WikiCategory | null>(null);

    let token = localStorage.getItem("token");

    useEffect(() => {
        if(projectId) {
            fetchCategories();
        } else {
            console.error("Project ID is missing in the URL");
        }
    }, [projectId]);

    // Fetches all categories and subcategories for the current project and sets them in state.
    const fetchCategories = async () => {
        if (!token) return;

        try {
            const res = await axios.get(`http://localhost:8080/api/projects/${projectId}/wiki/category`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.data) return;

            const subRes = await axios.get(
                `http://localhost:8080/api/projects/${projectId}/wiki/subcategory`,
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
                );

            // Extract the array directly from the ResponseEntity body
            const subcategoriesData = subRes.data?.body || subRes.data;

            // Pass the raw array to your state setter
            setSubcategories(subcategoriesData);

            console.log("Fetched categories:", res.data);
            console.log("Fetched subcategories:", subRes.data);


            setCategories(res.data);
            setSubcategories(subcategoriesData);
            setSelectedCategoryId(res.data.length > 0 ? res.data[0].id : null);
            if (res.data.length > 0) {
                loadEntries(res.data[0].id);
            }
        } catch (err) {
            console.error("Error fetching wiki categories:", err);
        } 
    };

    // Gets all the entries for a given category and sets them in state. Called when a category is selected.
    const loadEntries = async (categoryId: number) => {
        if (!token) return;   

        try {
            const ent = await axios.get(`http://localhost:8080/api/projects/${projectId}/wiki/category/${categoryId}/entries`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEntries(ent.data);
        } catch (err) {
            console.error("Error fetching wiki entries for category:", err);
        }
    };

    const handleDiscardEntry = async (entryId: number) => {
        if (!window.confirm("Are you sure you want to delete this entry?")) return;

        try {
        await axios.delete(
            `http://localhost:8080/api/projects/${projectId}/wiki/entries/${entryId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (selectedCategoryId) {
            loadEntries(selectedCategoryId);
        }
        } catch (err) {
        console.error("Failed to delete entry:", err);
        }
    };

    return (
        <div className="wiki-container">
            {/* Header Section */}
            <div className="wiki-header">
            <div>
                <h1 className="wiki-title">Wiki Home Page</h1>
                <p className="wiki-subtitle">
                Welcome to the Wiki Home Page. Manage and view all documentation for your project.
                </p>
            </div>
            </div>

            {/* Categories Selector */}
            <div className="categories-section">
            <h2 className="section-label">Categories</h2>
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

            {/* Entries List Component (Renders .entries-section directly) */}
            <WikiCards
                key={selectedCategoryId}
                entries={entries}
                selectedCategoryName={selectedCategory?.name}
                selectedCategoryId={selectedCategoryId}
                projectId={projectId || ""}
                onCreateClick={() => setIsCreateOpen(true)}
                onDiscardEntry={handleDiscardEntry}
            />

            {/* Popup Modal */}
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
    );
}