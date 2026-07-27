import type { WikiBlock } from "../types/WikiBlocks";
// import "../../assets/CSS/wikiBlockRenderer.css";
import WikiTextBlock from "../components/wiki/WikiComponents/wikiTextBlock";
import QuoteBlockComponent from "../components/wiki/WikiComponents/wikiQuoteBlock";
import StatBlockComponent from "../components/wiki/WikiComponents/wikiStatsBlock";

interface WikiBlockRendererProps {
    block: WikiBlock;
    onBlockChange: (updatedBlock: WikiBlock) => void; // Make sure this prop is defined
    onDelete: () => void;
}

export default function WikiBlockRenderer({ block, onBlockChange, onDelete }: WikiBlockRendererProps) {
    const renderContent = () => {
    switch (block.type) {
        case "text":
            return (
                <WikiTextBlock 
                    block={block} 
                    // Pass the function here!
                    onChange={(updatedData) => onBlockChange({ ...block, data: updatedData })} 
                    onDelete={onDelete}
                />
            );
        case "quote":
            return (
                <QuoteBlockComponent
                    block={block}
                    onChange={(updatedData) => onBlockChange({ ...block, data: updatedData })}
                    onDelete={onDelete}
                />
            );
        case "stats":
            return (
                <StatBlockComponent
                    id={block.id}
                    data={block.data}
                    onChange={(newData) => onBlockChange({ ...block, id: block.id, data: newData })}
                    onDelete={onDelete}
                />
            );
        default:
            return null;
    }
}

    return (
        <div className="">
            
            {/* Delete button positioned in top-right */}
            {/* <button
                type="button"
                onClick={() => onDelete(block.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-semibold text-sm px-2 py-1 rounded border border-transparent hover:border-red-300 transition-all"
                title="Delete block"
            >
                ✕ Delete
            </button> */}

            {renderContent()}
        </div>
    );
}


