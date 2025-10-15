export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  preview?: string;
  templateType: "full-site" | "page" | "section" | "block";
  featured?: boolean;
  pageCount?: number;
  tags: string[];
  downloads?: number;
  likes?: number;
  author: {
    name: string;
    verified?: boolean;
  };
}
