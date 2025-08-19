import { Accordion } from "@/components/ui/accordion";
import { AppearanceAccordion } from "./AppearanceAccordion";
import { ElementType } from "@/types/global.type";
import React from "react";
import { TypographyAccordion } from "./TypographyAccordion";
import { LinkConfigurationAccordion } from "./LinkConfiguration";
import { FormConfigurationAccordion } from "./FormConfiguration";
import InputConfiguration from "./InputConfiguration";
import { useElementStore } from "@/globalstore/elementstore";

export default function Configurations() {
    const { selectedElement } = useElementStore();

    const renderChildElement = (type: ElementType): React.ReactNode => {
        if (!type) {
            return null;
        }

        switch (type) {
            case "Text":
                return <TypographyAccordion />;
            case "Link":
                return <LinkConfigurationAccordion />;
            case "Form":
                return <FormConfigurationAccordion />;
            case "Input":
                return <InputConfiguration/>
            default:
                return null;
        }
    };

    if (!selectedElement) {
        return null;
    }
    return (
        <Accordion type="single" collapsible className="w-full">
            <AppearanceAccordion />
            {renderChildElement(selectedElement.type)}
        </Accordion>
    );
}
