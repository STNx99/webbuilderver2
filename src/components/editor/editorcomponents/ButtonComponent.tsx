import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import DOMPurify from "dompurify";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { ButtonElement } from "@/interfaces/elements.interface";

const ButtonComponent = ({ element }: EditorComponentProps) => {
    const buttonElement = element as ButtonElement;
    const { getCommonProps } = useElementHandler();
    return (
        <button
            {...getCommonProps(buttonElement)}
            type={"button"}
           
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(element.content || ""),
            }}
        >
            
        </button>
    );
};

export default ButtonComponent;
