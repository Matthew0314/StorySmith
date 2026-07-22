export type WikiBlock = QuoteBlock | TextBlock; // | ImageBlock;

export interface QuoteBlock {
    id: number;
    type: "quote";
    position: number;
    data: {
        quoteText: string;
        author?: string;
    };
}

export interface TextBlock {
    id: number;
    type: "text";
    position: number;
    data: {
        title: string;
        textContent?: string;
    };
}

export interface EntryData {
    id: number;
    title: string;
    categoryName: string;
    subCategoryName?: string;
    blocks: WikiBlock[];
}



// export interface ImageBlock {
//   id: string;
//   type: "image";
//   imageUrl: string;
//   caption?: string;
// }