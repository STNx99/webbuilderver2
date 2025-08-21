import useElementStore from "@/globalstore/elementstore";
import { EditorElement } from "@/types/global.type";

export function findParent(id : string) : EditorElement | undefined {
    
    const rootElements = useElementStore.getState().elements;
    if (!rootElements || rootElements.length === 0) {
        return undefined;
    }
    const find = (element: EditorElement): EditorElement | undefined => {
        if (element.id === id) {
            return element;
        }
        if ("elements" in element) {
            for (const child of element.elements) {
                const found = find(child);
                if (found) {
                    return found;
                }
            }
        }
        return undefined;
    };
    
    rootElements.forEach((element) => {
        const found = find(element);
        if (found) {
            return found;
        }
    });
    return undefined;
}