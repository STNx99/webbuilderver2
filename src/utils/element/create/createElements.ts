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
    private pageId?: string = ""

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
    
    public setPageId(pageId: string) : this {
      this.pageId = pageId;
      return this
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
            pageId: this.pageId,
            baseProperties: {
                isDraggedOver: false,
                isSelected: true,
                isHovered: false,
            },
        };
        const newElement = strategy.buildElement(builderState);
        if (!newElement) {
            throw new Error(`Failed to create element of type: ${this.type}`);
        }
        return newElement;
    }
}

export function createElement<T extends EditorElement>(
    type: ElementType,
    projectId: string,
    parentId?: string,
    pageId?: string
): T | undefined {
    try {
        const newElement = new ElementBuilder(projectId)
            .setType(type)
            .setParentId(parentId ?? "")
            .setPageId(pageId ?? "")
            .build();
        return newElement as T
    } catch (error) {
        console.error("Error creating element:", error);
        return undefined;
    }
}
