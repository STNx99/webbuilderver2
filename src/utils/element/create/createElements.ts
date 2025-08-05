import { EditorElement, ElementType } from "@/types/global.type";
import { v4 as uuidv4 } from "uuid";
import { getElementStrategy } from "./elementStrategyMap";
import { BuilderState } from "./elementCreateStrategy";



export class ElementBuilder {
    private id: string = uuidv4();
    private type: ElementType = "Text";
    private projectId: string = "";
    private src?: string = "";
    private parentId?: string = "";


    constructor(projectId: string) {
        this.projectId = projectId;
    }

    public setType(type: ElementType): this {
        this.type = type;
        return this;
    }
    public setSrc(src: string): this {
        this.src = src;
        return this;
    }

    public setParentId(parentId: string): this {
        this.parentId = parentId;
        return this;
    }
    
    build(): EditorElement {
        const strategy = getElementStrategy(this.type);
        if (!strategy) {
            throw new Error(`No strategy found for element type: ${this.type}`);
        }
        const builderState: BuilderState = {
                    id: this.id,
                    type: this.type,
                    projectId: this.projectId,
                    src: this.src,
                    parentId: this.parentId,
                    baseProperties: {
                        isDraggedOver: false,
                        isSelected: true,
                        isHovered: false,
                    },
                };
        const newElement  = strategy.buildElement(builderState);
        if (!newElement) {
            throw new Error(`Failed to create element of type: ${this.type}`);
        }
        return newElement;
    }
}

export function createElement(
    type: ElementType,
    projectId: string,
    parentId?: string
): EditorElement | undefined {
    try{
        return new ElementBuilder(projectId)
            .setType(type)
            .setParentId(parentId || "")
            .build();
    }catch (error) {
        console.error('Error creating element:', error);
        return undefined;
    }
}