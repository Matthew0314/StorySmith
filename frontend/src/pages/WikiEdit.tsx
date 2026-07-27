import { useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import WikiBlockRenderer from "../components/WikiBlockRenderer";
import type { EntryData, QuoteBlock, StatBlock, TextBlock } from "../types/WikiBlocks";
import "../assets/CSS/wiki/wikiEntryEdit.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Link } from "react-router-dom"
import type { WikiCategory, WikiSubcategory } from "../components/wiki/CategoryManagerModal";
// import type { WikiEntryDTO } from "../components/WikiCards";
// import axios from "axios";
// import ProjectNavBar from "../components/ProjectNavBar";
// import { title } from "process";
import api from "../api/axiosConfig"; // Import the configured axios instance

type SaveStatus = "saved" | "saving" | "unsaved" | "error";
export default function WikiEdit() {
    const { projectId, entryId } = useParams<{ projectId: string; entryId: string }>()
    const [entryData, setEntryData] = useState<EntryData | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

    // Track initial load so autosave doesn't fire when fetching data
    const isInitialRender = useRef(true);

        const token = localStorage.getItem("token");
    const [categories, setCategories] = useState<WikiCategory[]>([]);
    const [subcategories, setSubcategories] = useState<WikiSubcategory[]>([]);
    // const [entries, setEntries] = useState<WikiEntryDTO[]>([]);
    // const [isCreateOpen, setIsCreateOpen] = useState(false);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | string>("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

useEffect(() => {
    const loadAllData = async () => {
        if (!projectId || !entryId || !token) return;

        try {
            // 1. Fetch categories, subcategories, and entry data concurrently
            const [catRes, subRes, entryRes] = await Promise.all([
                api.get(`/projects/${projectId}/wiki/category`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                api.get(`/projects/${projectId}/wiki/subcategory`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                api.get(`/${projectId}/wiki-entries/${entryId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]);

            const loadedCategories: WikiCategory[] = catRes.data || [];
            const loadedSubcategories: WikiSubcategory[] = subRes.data?.body || subRes.data || [];
            const entryDataJson = entryRes.data;

            let resolvedCatId = entryDataJson.categoryId ? Number(entryDataJson.categoryId) : 0;

            if (!resolvedCatId && entryDataJson.categoryName) {
                const matchedCat = loadedCategories.find(
                    (c) => c.name.toLowerCase() === entryDataJson.categoryName.toLowerCase()
                );
                if (matchedCat) {
                    resolvedCatId = Number(matchedCat.id);
                }
            }

            // 3. Safely resolve Subcategory ID (checking for ID first, then fallback to matching by Name)
            let resolvedSubId = entryDataJson.subcategoryId ? Number(entryDataJson.subcategoryId) : 0;

            if (!resolvedSubId && entryDataJson.subCategoryName) {
                const matchedSub = loadedSubcategories.find(
                    (s) => s.name.toLowerCase() === entryDataJson.subCategoryName.toLowerCase()
                );
                if (matchedSub) {
                    resolvedSubId = Number(matchedSub.id ?? (matchedSub as any).subcategoryId);
                }
            }

            // 4. Update state in a clean, unified batch
            setCategories(loadedCategories);
            setSubcategories(loadedSubcategories);
            setEntryData({
                ...entryDataJson,
                categoryId: resolvedCatId,
                subcategoryId: resolvedSubId
            });
            setCoverImage(entryDataJson.imageUrl || null);
            getImageUrl();

            setSelectedCategory(resolvedCatId);
            setSelectedSubcategory(resolvedSubId);
        } catch (error) {
            console.error("Error loading wiki edit page data:", error);
        }
    };

    loadAllData();
}, [projectId, entryId, token]);

    // 2. Debounced Autosave (Triggers 1.5s after user stops editing)
    useEffect(() => {
        if (isInitialRender.current) {
            if (entryData) isInitialRender.current = false;
            return;
        }

        if (!entryData) return;

        setSaveStatus("unsaved");



        const timer = setTimeout(async () => {
            setSaveStatus("saving");
            console.log("Auto-saving entry data:", entryData);
            // return;
            try {
                await api.put(`/${projectId}/wiki-entries/${entryId}`, entryData, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                });

                // if (!response) throw new Error("Failed to auto-save");

                setSaveStatus("saved");
            } catch (error) {
                console.error("Error auto-saving:", error);
                setSaveStatus("error");
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [entryData, entryId]);

    // Helper: Safely mutate entryData state
    const updateEntryState = (updater: (prev: EntryData) => EntryData) => {
        setEntryData((prev) => (prev ? updater(prev) : null));
    };

    // 1. Add Text Block
    const addTextBlock = () => {
        const newBlock: TextBlock = {
            id: Date.now(), // Temporary unique ID for frontend key rendering
            type: "text",
            data: {
                title: "",
                textContent: ""
            },
            position: entryData ? entryData.blocks.length : 0,
        };
        setEntryData(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                blocks: [...prev.blocks, newBlock]
            };
        });
    };

    const addStatBlock = () => {
        const newBlock: StatBlock = {
            id: Date.now(),
            type: "stats",
            data: {
                title: "Stats",
                maxValue: 100,
                stats: [
                    { id: "stat1", label: "Health", value: 50 },
                    { id: "stat2", label: "Strength", value: 50 },
                    { id: "stat3", label: "Agility", value: 50 },
                    { id: "stat4", label: "Intelligence", value: 50 },
                    { id: "stat5", label: "Endurance", value: 50 }
                ]
            },
            position: entryData ? entryData.blocks.length : 0,
        };
        setEntryData(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                blocks: [...prev.blocks, newBlock]
            };
        });
    };

    // 2. Add Quote Block
    const addQuoteBlock = () => {
        const newBlock: QuoteBlock = {
            id: Date.now(),
            type: "quote",
            data: {
                quoteText: "",
                title: ""
            },
            position: entryData ? entryData.blocks.length : 0,
        };
        setEntryData(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                blocks: [...prev.blocks, newBlock]
            };
        });
    };

    const handleBlockChange = (index: number, updatedBlock: TextBlock | QuoteBlock | StatBlock) => {
        updateEntryState((prev) => {
            const updatedBlocks = [...prev.blocks];
            updatedBlocks[index] = updatedBlock;
            return { ...prev, blocks: updatedBlocks };
        });
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination || !entryData) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        // 1. Reorder the array
        const reorderedBlocks = Array.from(entryData.blocks);
        const [movedBlock] = reorderedBlocks.splice(sourceIndex, 1);
        reorderedBlocks.splice(destinationIndex, 0, movedBlock);

        // 2. Re-assign 0-based position indices so backend gets clean sequential ordering
        const updatedBlocks = reorderedBlocks.map((block, index) => ({
            ...block,
            position: index
        }));

        // 3. Update state (this automatically triggers your debounced autosave!)
        updateEntryState((prev) => ({
            ...prev,
            blocks: updatedBlocks
        }));
    };

    const handleDeleteBlock = (blockId: number) => {
        updateEntryState((prev) => ({
            ...prev,
            blocks: prev.blocks.filter((block) => block.id !== blockId)
        }));
    };



    // const safeSubcategories = Array.isArray(subcategories) ? subcategories : [];
    // const fetchCategoryData = async () => {
    //     if (!token || !projectId) return;

    //     try {
    //         const res = await axios.get(`http://localhost:8080/api/projects/${projectId}/wiki/category`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });

    //         const subRes = await axios.get(
    //             `http://localhost:8080/api/projects/${projectId}/wiki/subcategory`,
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         const subcategoriesData = subRes.data?.body || subRes.data;

    //         setCategories(res.data);
    //         setSubcategories(subcategoriesData);

    //         // REMOVED the block that forced selectedCategory to res.data[0]!
    //     } catch (err) {
    //         console.error("Error fetching wiki categories:", err);
    //     } 
    // };

    // useEffect(() => {
    //     if (projectId) {
    //         fetchCategoryData();

    //     } else {
    //         console.error("Project ID is missing in the URL");
    //     }
    // }, [projectId]);


const filteredSubcategories = useMemo(() => {
    if (!selectedCategory || !subcategories || subcategories.length === 0) {
        return [];
    }

    return subcategories.filter((sub: any) => {
        // Safely pull the category ID regardless of backend structure
        const parentId = sub.categoryId ?? sub.category?.id ?? sub.parentCategoryId;
        
        // Convert BOTH to Number to prevent "5" === 5 type mismatch failures
        return Number(parentId) === Number(selectedCategory);
    });
}, [selectedCategory, subcategories]);

      const [isUploading, setIsUploading] = useState(false);
      const [coverImage, setCoverImage] = useState<string | null>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const localPreviewUrl = URL.createObjectURL(file);
        setImagePreview(localPreviewUrl);
        setIsUploading(true);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await api.post("/upload", formData);
            const data = res.data;

            if (data.imageUrl) {
                updateEntryState((prev) => ({
                    ...prev,
                    imageUrl: data.imageUrl
                }));

                setCoverImage(data.imageUrl);
            } else {
                console.warn("Upload response missing 'imageUrl' key:", data);
            }

            
        } finally {
            setIsUploading(false);
        }
    }

    const getImageUrl = () => {
        if (imagePreview) return imagePreview;
        if (!coverImage) return null;
        if (coverImage.startsWith("http://") || coverImage.startsWith("https://")) {
        return coverImage;
        }
        const cleanPath = coverImage.startsWith("/") ? coverImage : `/${coverImage}`;

        console.log("Resolved cover image URL:", `http://localhost:8080${cleanPath}`);
        return `http://localhost:8080${cleanPath}`;
    };

     // 1. Handle Category Change
// 1. Handle Category Change
const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(0);

    // Look up the name from your categories array
    const matchedCategory = categories.find((cat) => Number(cat.id) === categoryId);
    const categoryName = matchedCategory ? matchedCategory.name : "";

    // Update entryData state with both ID and Name for the DTO
    updateEntryState((prev) => ({
        ...prev,
        categoryId: categoryId,
        categoryName: categoryName,
        subcategoryId: null,
        subCategoryName: null // Reset subcategory name as well
    }));
};


// Updated Subcategory Handler
const handleSubcategoryChange = (subcategoryId: number) => {
    // 1. Sync dropdown state
    setSelectedSubcategory(subcategoryId);

    // 2. Handle "None" / default zero option
    if (subcategoryId === 0) {
        updateEntryState((prev) => ({
            ...prev,
            subcategoryId: null,
            subCategoryName: null
        }));
        return;
    }

    // 3. Robust lookup (handles both 'id' and 'subcategoryId' backend schema variations)
    const matchedSubcategory = subcategories.find(
        (sub: any) => Number(sub.id ?? sub.subcategoryId) === Number(subcategoryId)
    );

    const subcategoryName = matchedSubcategory ? matchedSubcategory.name : null;

    // 4. Update entry state cleanly
    updateEntryState((prev) => ({
        ...prev,
        subcategoryId: subcategoryId,
        subCategoryName: subcategoryName
    }));
};

    const currentImageUrl = getImageUrl();
    return (
        <div className="wiki-edit-page">
        <div className="wiki-edit-topbar">
            <div>{saveStatus}</div>
            <Link to={`/projects/${projectId}/wiki`}>Back</Link>
        </div>
        <div className="wiki-edit-wrapper">
            {/* Status bar... */}
            


            

            <div className="wiki-edit-container">
                <div className="component-column">
                    <input 
                        className="wiki-edit-title" 
                        value={entryData?.title ?? "Loading..."} 
                        onChange={(e) => updateEntryState((prev) => ({ ...prev, title: e.target.value }))} 
                    />

                    <div className="category-container">
                        <div className="form-row">
                            
                            {/* Category Select */}
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={selectedCategory ?? ""}
                                    onChange={(e) => handleCategoryChange(Number(e.target.value))}
                                >
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value={0}>Default Category</option>
                                    )}
                                </select>
                            </div>

                            {/* Subcategory Select */}
                            <div className="form-group">
                                <label className="form-label">Subcategory</label>
                                <select
                                    className="form-select"
                                    value={selectedSubcategory}
                                    onChange={(e) => handleSubcategoryChange(Number(e.target.value))}
                                >
                                    {/* Always present default option */}
                                    <option value={0}>None</option>

                                    {/* Map subcategories under the current selected category */}
                                    {filteredSubcategories.map((sub: any) => (
                                        <option key={sub.id ?? sub.subcategoryId} value={sub.id ?? sub.subcategoryId}>
                                            {sub.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>

                    

                    {/* Drag and Drop Zone */}
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="wiki-blocks">
                            {(provided) => (
                                <div 
                                    className="blocks-droppable-zone"
                                    ref={provided.innerRef} 
                                    {...provided.droppableProps}
                                >
                                    {entryData?.blocks.map((block, index) => (
                                        <Draggable 
                                            key={String(block.id)} 
                                            draggableId={String(block.id)} 
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`draggable-block-wrapper ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                                >
                                                    {/* Drag Handle Icon */}
                                                    <div 
                                                        className="drag-handle" 
                                                        {...provided.dragHandleProps} 
                                                        title="Drag to reorder"
                                                    >
                                                        ⋮⋮
                                                    </div>

                                                    <div className="block-content-area">
                                                        <WikiBlockRenderer 
                                                            block={block} 
                                                            onBlockChange={(updated) => handleBlockChange(index, updated)}
                                                            onDelete={() => handleDeleteBlock(block.id)} // Pass delete handler
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                {/* Preview Column... */}
                <div className="preview-column">




                    <div className="WE-picture-section">
                        <div className="WE-form-group">
                            <div className="WE-image-upload-wrapper">
                            <label htmlFor="cover-image-input" className="WE-image-preview-frame">
                                {currentImageUrl ? (
                                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                    <img
                                    src={currentImageUrl}
                                    alt="Cover Preview"
                                    className="WE-image-preview-img"
                                    />
                                    {isUploading && (
                                    <div className="uploading-overlay">
                                        <span>Uploading...</span>
                                    </div>
                                    )}
                                </div>
                                ) : (
                                <div className="WE-image-upload-placeholder">
                                    <svg
                                    className="WE-upload-icon"
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
                    <h2 className="preview-title">Table of Contents</h2>
                    <div className="preview-content">
                        {entryData?.blocks.map((block) => (
                            <div key={block.id}>
                                {block.data.title && `- ${block.data.title}`}
                            </div>
                        ))}
                    </div>
                </div>

            {/* Block Creation Toolbar */}
            <div className="add-block-toolbar">
               {/* <span className="toolbar-label">+ Add Component:</span> */}
                <button type="button" onClick={addTextBlock} className="add-block-btn">
               Text
               </button>
               <button type="button" onClick={addQuoteBlock} className="add-block-btn">
                   Quote
               </button>
               <button type="button" onClick={addStatBlock} className="add-block-btn">
                   Stats
               </button>
             </div>
        </div>
        </div>
        </div>
    );

}
