import React from "react";
import "../../../assets/CSS/wiki/WikiComponenets/wikiQuoteBlock.css";

interface QuoteBlock {
    block: {
        id: number | string;
        type: "quote";
        data: {
            quoteText: string;
        };
    };
    onChange: (updatedData: { quoteText: string }) => void;
}

export default function WikiQuoteBlock({ block, onChange }: QuoteBlock) {
    return (
        <div className="quote-block-editor">
            <textarea
                value={block.data.quoteText}
                placeholder="Type your quote here..."
                className="quote-block-content-textarea"
                onChange={(e) => onChange({ quoteText: e.target.value })}
            />
        </div>
    );
}