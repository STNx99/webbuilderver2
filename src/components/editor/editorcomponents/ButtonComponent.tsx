import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { ButtonElement } from "@/interfaces/element";
import { useElementHandler } from "@/hooks/useElementHandler";
import DOMPurify from "dompurify";

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
