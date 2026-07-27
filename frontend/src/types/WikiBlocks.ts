export type WikiBlock = QuoteBlock | TextBlock | StatBlock; // | ImageBlock;

export interface QuoteBlock {
    id: number;
    type: "quote";
    position: number;
    // title: string;
    data: {
        quoteText: string;
        title: string;
    };
}

export interface TextBlock {
    id: number;
    type: "text";
    position: number;
    // title: string;
    data: {
        title: string;
        textContent?: string;
    };
}


export interface StatBlock {
    id: number;
    type: "stats";
    position: number;
    // title: string;
    data: {
        title: string;
        maxValue: number;
        stats: StatItem[];
    };
}

export interface StatItem {
    id: string;
    label: string;
    value: number;
}

export interface EntryData {
    id: number;
    title: string;
    categoryName: string;
    subCategoryName?: string | null;
    blocks: WikiBlock[];
    imageUrl?: string;
}





// export interface ImageBlock {
//   id: string;
//   type: "image";
//   imageUrl: string;
//   caption?: string;
// }