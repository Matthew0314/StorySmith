import React, { useEffect, useRef } from "react";
import "../../../assets/CSS/wiki/WikiComponenets/wikiQuoteBlock.css";

interface QuoteBlock {
    block: {
        id: number | string;
        type: "quote";
        data: {
            quoteText: string;
            // title: string;
            author?: string; // Optional author field
        };
    };
    onChange: (updatedData: { quoteText: string; author?: string }) => void;
    onDelete?: () => void; // Optional delete handler
}

export default function WikiQuoteBlock({ block, onChange, onDelete }: QuoteBlock) {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
        // Auto-grow textarea as typing increases content height
        useEffect(() => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
        }, [block.data.quoteText]);
    return (
        <div className="quote-block-editor">
            {/* <input
                type="text"
                value={block.data.title}
                placeholder="Type the title here..."
                className="quote-block-title-input"
                onChange={(e) => onChange({ quoteText: block.data.quoteText, title: e.target.value })}
            /> */}
            <div className="quote-block-header">
                <textarea
                    value={block.data.quoteText}
                    placeholder="Type your quote here..."
                    className="quote-block-content-textarea"
                    ref={textareaRef}
                    rows={1}
                    onChange={(e) => onChange({ quoteText: e.target.value, author: block.data.author })}
                />
                <button
                        type="button"
                        onClick={onDelete}
                        className="delete-entry-btn"
                        title="Delete block"
                    >
                        🗑️
                    </button>
                </div>
            <input
                type="text"
                value={block.data.author || ""}
                placeholder="Author (optional)"
                className="quote-block-author-input"
                onChange={(e) => onChange({ quoteText: block.data.quoteText, author: e.target.value })}
            />
        </div>
    );
}