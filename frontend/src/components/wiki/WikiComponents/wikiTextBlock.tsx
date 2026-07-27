import { useRef, useEffect } from 'react';
import '../../../assets/CSS/wiki/WikiComponenets/wikiTextBlock.css';

interface TextBlockProps {
    block: {
        id: number | string;
        type: "text";
        data: {
            title: string;
            textContent?: string;
        };
    };
    onChange: (updatedData: { title: string; textContent?: string }) => void;
    onDelete?: () => void;
}

export default function TextBlockComponent({ block, onChange, onDelete }: TextBlockProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-grow textarea as typing increases content height
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [block.data.textContent]);

    return (
        <div className="text-block-editor">
            <div className="text-block-header">
                <input 
                    type="text" 
                    value={block.data.title} 
                    placeholder="Section Title..."
                    className="text-block-title-input"
                    onChange={(e) => onChange({ ...block.data, title: e.target.value })} 
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
            <textarea 
                ref={textareaRef}
                value={block.data.textContent || ''} 
                placeholder="Type your content here..."
                rows={1}
                className="text-block-content-textarea"
                onChange={(e) => onChange({ ...block.data, textContent: e.target.value })} 
            />
        </div>
    );
}