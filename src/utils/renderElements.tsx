import { EditorElement } from "@/types/global.type";

export const renderElements = (element: EditorElement, commonProps?: any) => {
    switch (element.type) { 
        case "Frame":
            return (
                <>
                </>
            )
        default:
            return (
                <>
                </>
            )
    }
}