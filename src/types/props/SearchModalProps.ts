import type { DocItem } from "../entities/DocItem";

export interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    searchTerm: string;
    onSearchChange: (val: string) => void;
    results: DocItem[];
    onSelect: (item: DocItem) => void;
}