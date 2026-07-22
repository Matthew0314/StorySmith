import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import WikiBlockRenderer from "../components/WikiBlockRenderer";
import type { EntryData, QuoteBlock, TextBlock } from "../types/WikiBlocks";
import "../assets/CSS/wiki/wikiEntryEdit.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";
export default function WikiEdit() {
    const { projectId, entryId } = useParams<{ projectId: string; entryId: string }>()
    const [entryData, setEntryData] = useState<EntryData | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

    // Track initial load so autosave doesn't fire when fetching data
    const isInitialRender = useRef(true);


    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching data for entryId:", entryId, "in projectId:", projectId);

            try {
                const response = await fetch(`http://localhost:8080/api/wiki-entries/${entryId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await response.json();
                setEntryData(data);
                console.log("Fetched entry data:", data);
            } catch (error) {
                console.error("Error fetching entry data:", error);
            }
        };
        console.log("useEffect triggered for entryId:", entryId, "in projectId:", projectId);
        fetchData();
    }, [projectId, entryId]);

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
                const response = await fetch(`http://localhost:8080/api/wiki-entries/${entryId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(entryData)
                });

                if (!response.ok) throw new Error("Failed to auto-save");

                setSaveStatus("saved");
            } catch (error) {
                console.error("Error auto-saving:", error);
                setSaveStatus("error");
            }
        }, 1500);

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
            }
        };
        setEntryData({ ...entryData, blocks: [...entryData.blocks, newBlock] });
    };

    // 2. Add Quote Block
    const addQuoteBlock = () => {
        const newBlock: QuoteBlock = {
            id: Date.now(),
            type: "quote",
            data: {
                quoteText: "",
                author: ""
            }
        };
        setEntryData({ ...entryData, blocks: [...entryData.blocks, newBlock] });
    };

    const handleBlockChange = (index: number, updatedBlock: TextBlock | QuoteBlock) => {
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


    // return (
    //     <>
    //     <div className="wiki-edit-container">
    //         <div className="component-column">
    //             <input className="wiki-edit-title" value={entryData?.title || "Loading..."} name="title" onChange={(e) => setEntryData({ ...entryData, title: e.target.value })} />
    //             {entryData?.blocks.map((block, index) => (
    //                 <WikiBlockRenderer 
    //                     key={block.id} 
    //                     block={block} 
    //                     // DO NOT FORGET THIS LINE:
    //                     onBlockChange={(updatedBlock) => {
    //                         const updatedBlocks = [...(entryData?.blocks || [])];
    //                         updatedBlocks[index] = updatedBlock;
    //                         setEntryData({ ...entryData, blocks: updatedBlocks });
    //                     }}
    //                 />
    //             ))}
    //         </div>
    //         <div className="preview-column">
    //             <h2 className="preview-title">Preview</h2>
    //             <div className="preview-content">
    //             </div>
    //         </div>
    //     </div>

    //     {/* Block Creation Toolbar */}
    //         <div className="add-block-toolbar">
    //             <span className="toolbar-label">+ Add Component:</span>
    //             <button type="button" onClick={addTextBlock} className="add-block-btn">
    //                 📄 Text
    //             </button>
    //             <button type="button" onClick={addQuoteBlock} className="add-block-btn">
    //                 💬 Quote
    //             </button>
    //         </div>
    //     </>


    // );
    return (
        <div className="wiki-edit-wrapper">
            {/* Status bar... */}

            <div className="wiki-edit-container">
                <div className="component-column">
                    <input 
                        className="wiki-edit-title" 
                        value={entryData?.title ?? "Loading..."} 
                        onChange={(e) => updateEntryState((prev) => ({ ...prev, title: e.target.value }))} 
                    />

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
                    <h2 className="preview-title">Preview</h2>
                    <div className="preview-content">
                    </div>
                </div>

            {/* Block Creation Toolbar */}
            <div className="add-block-toolbar">
               <span className="toolbar-label">+ Add Component:</span>
                <button type="button" onClick={addTextBlock} className="add-block-btn">
               📄 Text
               </button>
               <button type="button" onClick={addQuoteBlock} className="add-block-btn">
                   💬 Quote
               </button>
             </div>
        </div>
        </div>
    );

}
