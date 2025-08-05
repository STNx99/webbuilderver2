import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import useElementStore from "@/globalstore/elementstore";
import { elementHelper } from "@/utils/element/elementhelper";
import React, { useEffect, useState } from "react";
import { EditorElement, resolveResponsiveStyles } from "@/types/global.type";
import { useBreakpointStore } from "@/globalstore/responsivebreakpointstore";

type AppearanceStyles = Partial<React.CSSProperties>;

export const AppearanceAccordion = () => {
    const { selectedElement } = useElementStore();
    const { breakpoint, setBreakpoint } = useBreakpointStore();
    const [styles, setStyles] = useState<AppearanceStyles>({
        height: "auto",
        width: "auto",
        backgroundColor: "#ffffff",
        color: "#000000",
        borderColor: "#000000",
        borderWidth: 0,
        borderRadius: 0,
        opacity: 1,
        padding: "0px",
        paddingTop: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        paddingRight: "0px",
        margin: "0px",
        marginTop: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        marginRight: "0px",
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
    });

    useEffect(() => {
        if (selectedElement?.styles) {
            const s = resolveResponsiveStyles(
                selectedElement.styles as React.CSSProperties | undefined,
                breakpoint,
            );
            setStyles({
                ...s,
                backgroundColor: s.backgroundColor || "#ffffff",
                color: s.color || "#000000",
                borderColor: s.borderColor || "#000000",
                borderWidth:
                    typeof s.borderWidth === "string"
                        ? parseInt(s.borderWidth, 10)
                        : typeof s.borderWidth === "number"
                          ? s.borderWidth
                          : 0,
                borderRadius:
                    typeof s.borderRadius === "string"
                        ? parseInt(s.borderRadius, 10)
                        : typeof s.borderRadius === "number"
                          ? s.borderRadius
                          : 0,
                opacity:
                    typeof s.opacity === "string"
                        ? parseFloat(s.opacity)
                        : typeof s.opacity === "number"
                          ? s.opacity
                          : 1,
                padding: s.padding || "0px",
                paddingTop: s.paddingTop || "0px",
                paddingBottom: s.paddingBottom || "0px",
                paddingLeft: s.paddingLeft || "0px",
                paddingRight: s.paddingRight || "0px",
                margin: s.margin || "0px",
                marginTop: s.marginTop || "0px",
                marginBottom: s.marginBottom || "0px",
                marginLeft: s.marginLeft || "0px",
                marginRight: s.marginRight || "0px",
                top: s.top || "0px",
                bottom: s.bottom || "0px",
                left: s.left || "0px",
                right: s.right || "0px",
            });
        }
    }, [selectedElement, selectedElement?.styles]);

    const updateStyle = (property: keyof AppearanceStyles, value: any) => {
        if (!selectedElement) return;
        const newStyles = { ...styles, [property]: value };
        setStyles(newStyles);
        elementHelper.updateElementStyle(selectedElement, newStyles);
    };

    const updateElementSize = (sizeType: "height" | "width") => {
        if (!selectedElement) return;

        const getElementSize = (
            sizeType: "height" | "width",
            element: EditorElement,
        ): string => {
            const domElement = document.getElementById(element.id);
            if (!domElement) {
                return "auto";
            }
            const computedStyles = window.getComputedStyle(domElement);
            const parentSize =
                sizeType === "height"
                    ? computedStyles.height
                    : computedStyles.width;
            return parentSize || "auto";
        };

        const newSize = getElementSize(sizeType, selectedElement);
        updateStyle(sizeType, newSize);
    };

    useEffect(() => {
        console.log(JSON.stringify(styles));
    }, [styles]);

    if (!selectedElement) {
        return <AccordionItem value="appearance"></AccordionItem>;
    }

    return (
        <AccordionItem value="appearance">
            <AccordionTrigger className="text-sm">Appearance</AccordionTrigger>
            <AccordionContent>
                <Accordion
                    type="multiple"
                    defaultValue={[
                        "size",
                        "colors",
                        "border",
                        "opacity",
                        "padding",
                        "margin",
                        "size",
                        "display",
                        "position",
                    ]}
                >
                    {/* Size Section */}
                    <AccordionItem value="size">
                        <AccordionTrigger>Size</AccordionTrigger>
                        <AccordionContent className="space-y-2 p-2">
                            <div className="flex items-center justify-between">
                                <Label>Width</Label>
                                <div className="flex flex-col gap-2 items-center">
                                    <Input
                                        value={styles.width || "auto"}
                                        onChange={(e) =>
                                            updateStyle("width", e.target.value)
                                        }
                                        className="w-24 h-8"
                                    />
                                    <Slider
                                        min={0}
                                        max={1000}
                                        step={1}
                                        value={[
                                            typeof styles.width === "string"
                                                ? parseInt(styles.width, 10) ||
                                                  0
                                                : typeof styles.width ===
                                                    "number"
                                                  ? styles.width
                                                  : 0,
                                        ]}
                                        onValueChange={(vals) =>
                                            updateStyle("width", `${vals[0]}px`)
                                        }
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Height</Label>

                                <div className="flex flex-col gap-2 items-center">
                                    <Input
                                        value={styles.height || "auto"}
                                        onChange={(e) =>
                                            updateStyle(
                                                "height",
                                                e.target.value,
                                            )
                                        }
                                        className="w-24 h-8"
                                    />
                                    <Slider
                                        min={0}
                                        max={1000}
                                        step={1}
                                        value={[
                                            typeof styles.height === "string"
                                                ? parseInt(styles.height, 10) ||
                                                  0
                                                : typeof styles.height ===
                                                    "number"
                                                  ? styles.height
                                                  : 0,
                                        ]}
                                        onValueChange={(vals) =>
                                            updateStyle(
                                                "height",
                                                `${vals[0]}px`,
                                            )
                                        }
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    {/* Colors Section */}
                    <AccordionItem value="colors">
                        <AccordionTrigger className="text-xs">
                            Colors
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2 py-1">
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="backgroundColor"
                                        className="text-xs w-16"
                                    >
                                        Background
                                    </Label>
                                    <Input
                                        id="backgroundColor"
                                        value={styles.backgroundColor}
                                        type="color"
                                        onChange={(e) =>
                                            updateStyle(
                                                "backgroundColor",
                                                e.target.value,
                                            )
                                        }
                                        className="w-6 h-6 p-0 border-none bg-transparent"
                                    />
                                    <Input
                                        id="backgroundColorHex"
                                        type="text"
                                        value={styles.backgroundColor}
                                        maxLength={7}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (
                                                /^#([0-9A-Fa-f]{0,6})$/.test(
                                                    val,
                                                )
                                            ) {
                                                updateStyle(
                                                    "backgroundColor",
                                                    val,
                                                );
                                            }
                                        }}
                                        className="w-16 h-6 px-1 py-0 text-xs border"
                                    />
                                </div>
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="textColor"
                                        className="text-xs w-16"
                                    >
                                        Text
                                    </Label>
                                    <Input
                                        id="textColor"
                                        type="color"
                                        value={styles.color}
                                        onChange={(e) =>
                                            updateStyle("color", e.target.value)
                                        }
                                        className="w-6 h-6 p-0 border-none bg-transparent"
                                    />
                                    <Input
                                        id="textColorHex"
                                        type="text"
                                        value={styles.color}
                                        maxLength={7}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (
                                                /^#([0-9A-Fa-f]{0,6})$/.test(
                                                    val,
                                                )
                                            ) {
                                                updateStyle("color", val);
                                            }
                                        }}
                                        className="w-16 h-6 px-1 py-0 text-xs border"
                                    />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Border Section */}
                    <AccordionItem value="border">
                        <AccordionTrigger className="text-xs">
                            Border
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2 py-1">
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="borderColor"
                                        className="text-xs w-16"
                                    >
                                        Color
                                    </Label>
                                    <Input
                                        id="borderColor"
                                        type="color"
                                        value={styles.borderColor}
                                        onChange={(e) =>
                                            updateStyle(
                                                "borderColor",
                                                e.target.value,
                                            )
                                        }
                                        className="w-6 h-6 p-0 border-none bg-transparent"
                                    />
                                </div>
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="borderWidth"
                                        className="text-xs w-16"
                                    >
                                        Width
                                    </Label>
                                    <Slider
                                        id="borderWidth"
                                        min={0}
                                        max={20}
                                        step={1}
                                        value={[
                                            typeof styles.borderWidth ===
                                            "number"
                                                ? styles.borderWidth
                                                : 0,
                                        ]}
                                        onValueChange={(vals) =>
                                            updateStyle("borderWidth", vals[0])
                                        }
                                        className="flex-1"
                                    />
                                    <span className="text-xs w-6 text-right">
                                        {styles.borderWidth}
                                    </span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="borderRadius"
                                        className="text-xs w-16"
                                    >
                                        Radius
                                    </Label>
                                    <Slider
                                        id="borderRadius"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[
                                            typeof styles.borderRadius ===
                                            "number"
                                                ? styles.borderRadius
                                                : 0,
                                        ]}
                                        onValueChange={(vals) =>
                                            updateStyle("borderRadius", vals[0])
                                        }
                                        className="flex-1"
                                    />
                                    <span className="text-xs w-6 text-right">
                                        {styles.borderRadius}
                                    </span>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Opacity Section */}
                    <AccordionItem value="opacity">
                        <AccordionTrigger className="text-xs">
                            Opacity
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex items-center gap-5 py-1">
                                <Label
                                    htmlFor="opacity"
                                    className="text-xs w-16"
                                >
                                    Opacity
                                </Label>
                                <Slider
                                    id="opacity"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[
                                        typeof styles.opacity === "number"
                                            ? Math.round(styles.opacity * 100)
                                            : 100,
                                    ]}
                                    onValueChange={(vals) =>
                                        updateStyle("opacity", vals[0] / 100)
                                    }
                                    className="flex-1"
                                />
                                <span className="text-xs w-6 text-right">
                                    {typeof styles.opacity === "number"
                                        ? Math.round(styles.opacity * 100)
                                        : 100}
                                </span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Padding Section */}
                    <AccordionItem value="padding">
                        <AccordionTrigger className="text-xs">
                            Padding
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2 py-1">
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="paddingTop"
                                        className="text-xs w-16"
                                    >
                                        Top
                                    </Label>
                                    <Slider
                                        id="paddingTop"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[
                                            typeof styles.paddingTop ===
                                            "string"
                                                ? parseInt(styles.paddingTop)
                                                : Number(styles.paddingTop),
                                        ]}
                                        onValueChange={([val]) =>
                                            updateStyle(
                                                "paddingTop",
                                                `${val}px`,
                                            )
                                        }
                                        className="w-32"
                                    />
                                    <Input
                                        id="paddingTop"
                                        type="text"
                                        value={styles.paddingTop || ""}
                                        placeholder="e.g. 10px"
                                        onChange={(e) =>
                                            updateStyle(
                                                "paddingTop",
                                                e.target.value,
                                            )
                                        }
                                        className="w-20 h-6 px-1 py-0 text-xs border"
                                    />
                                </div>
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="paddingBottom"
                                        className="text-xs w-16"
                                    >
                                        Bottom
                                    </Label>
                                    <Slider
                                        id="paddingBottom"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[
                                            typeof styles.paddingBottom ===
                                            "string"
                                                ? parseInt(styles.paddingBottom)
                                                : Number(styles.paddingBottom),
                                        ]}
                                        onValueChange={([val]) =>
                                            updateStyle(
                                                "paddingBottom",
                                                `${val}px`,
                                            )
                                        }
                                        className="w-32"
                                    />
                                    <Input
                                        id="paddingBottom"
                                        type="text"
                                        value={styles.paddingBottom || ""}
                                        placeholder="e.g. 10px"
                                        onChange={(e) =>
                                            updateStyle(
                                                "paddingBottom",
                                                e.target.value,
                                            )
                                        }
                                        className="w-20 h-6 px-1 py-0 text-xs border"
                                    />
                                </div>
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="paddingLeft"
                                        className="text-xs w-16"
                                    >
                                        Left
                                    </Label>
                                    <Slider
                                        id="paddingLeft"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[
                                            typeof styles.paddingLeft ===
                                            "string"
                                                ? parseInt(styles.paddingLeft)
                                                : Number(styles.paddingLeft),
                                        ]}
                                        onValueChange={([val]) =>
                                            updateStyle(
                                                "paddingLeft",
                                                `${val}px`,
                                            )
                                        }
                                        className="w-32"
                                    />
                                    <Input
                                        id="paddingLeft"
                                        type="text"
                                        value={styles.paddingLeft || ""}
                                        placeholder="e.g. 10px"
                                        onChange={(e) =>
                                            updateStyle(
                                                "paddingLeft",
                                                e.target.value,
                                            )
                                        }
                                        className="w-20 h-6 px-1 py-0 text-xs border"
                                    />
                                </div>
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="paddingRight"
                                        className="text-xs w-16"
                                    >
                                        Right
                                    </Label>
                                    <Slider
                                        id="paddingRight"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[
                                            typeof styles.paddingRight ===
                                            "string"
                                                ? parseInt(styles.paddingRight)
                                                : Number(styles.paddingRight),
                                        ]}
                                        onValueChange={([val]) =>
                                            updateStyle(
                                                "paddingRight",
                                                `${val}px`,
                                            )
                                        }
                                        className="w-32"
                                    />
                                    <Input
                                        id="paddingRight"
                                        type="text"
                                        value={styles.paddingRight || ""}
                                        placeholder="e.g. 10px"
                                        onChange={(e) =>
                                            updateStyle(
                                                "paddingRight",
                                                e.target.value,
                                            )
                                        }
                                        className="w-20 h-6 px-1 py-0 text-xs border"
                                    />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Margin Section */}
                    <AccordionItem value="margin">
                        <AccordionTrigger className="text-xs">
                            Margin
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2 py-1">
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="marginTop"
                                        className="text-xs w-16"
                                    >
                                        Top
                                    </Label>
                                    <Slider
                                        id="marginTop"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[
                                            typeof styles.marginTop === "string"
                                                ? parseInt(styles.marginTop)
                                                : Number(styles.marginTop),
                                        ]}
                                        onValueChange={([val]) =>
                                            updateStyle("marginTop", `${val}px`)
                                        }
                                        className="w-32"
                                    />
                                    <Input
                                        id="marginTop"
                                        type="text"
                                        value={styles.marginTop || ""}
                                        placeholder="e.g. 10px"
                                        onChange={(e) =>
                                            updateStyle(
                                                "marginTop",
                                                e.target.value,
                                            )
                                        }
                                        className="w-20 h-6 px-1 py-0 text-xs border"
                                    />
                                </div>
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="marginBottom"
                                        className="text-xs w-16"
                                    >
                                        Bottom
                                    </Label>
                                    <Slider
                                        id="marginBottom"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[
                                            typeof styles.marginBottom ===
                                            "string"
                                                ? parseInt(styles.marginBottom)
                                                : Number(styles.marginBottom),
                                        ]}
                                        onValueChange={([val]) =>
                                            updateStyle(
                                                "marginBottom",
                                                `${val}px`,
                                            )
                                        }
                                        className="w-32"
                                    />
                                    <Input
                                        id="marginBottom"
                                        type="text"
                                        value={styles.marginBottom || ""}
                                        placeholder="e.g. 10px"
                                        onChange={(e) =>
                                            updateStyle(
                                                "marginBottom",
                                                e.target.value,
                                            )
                                        }
                                        className="w-20 h-6 px-1 py-0 text-xs border"
                                    />
                                </div>
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="marginLeft"
                                        className="text-xs w-16"
                                    >
                                        Left
                                    </Label>
                                    <Slider
                                        id="marginLeft"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[
                                            typeof styles.marginLeft ===
                                            "string"
                                                ? parseInt(styles.marginLeft)
                                                : Number(styles.marginLeft),
                                        ]}
                                        onValueChange={([val]) =>
                                            updateStyle(
                                                "marginLeft",
                                                `${val}px`,
                                            )
                                        }
                                        className="w-32"
                                    />
                                    <Input
                                        id="marginLeft"
                                        type="text"
                                        value={styles.marginLeft || ""}
                                        placeholder="e.g. 10px"
                                        onChange={(e) =>
                                            updateStyle(
                                                "marginLeft",
                                                e.target.value,
                                            )
                                        }
                                        className="w-20 h-6 px-1 py-0 text-xs border"
                                    />
                                </div>
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="marginRight"
                                        className="text-xs w-16"
                                    >
                                        Right
                                    </Label>
                                    <Slider
                                        id="marginRight"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[
                                            typeof styles.marginRight ===
                                            "string"
                                                ? parseInt(styles.marginRight)
                                                : Number(styles.marginRight),
                                        ]}
                                        onValueChange={([val]) =>
                                            updateStyle(
                                                "marginRight",
                                                `${val}px`,
                                            )
                                        }
                                        className="w-32"
                                    />
                                    <Input
                                        id="marginRight"
                                        type="text"
                                        value={styles.marginRight || ""}
                                        placeholder="e.g. 10px"
                                        onChange={(e) =>
                                            updateStyle(
                                                "marginRight",
                                                e.target.value,
                                            )
                                        }
                                        className="w-20 h-6 px-1 py-0 text-xs border"
                                    />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Display Section */}
                    <AccordionItem value="display">
                        <AccordionTrigger className="text-xs">
                            Display
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex items-center gap-5 py-1">
                                <Label
                                    htmlFor="display"
                                    className="text-xs w-16"
                                >
                                    Display
                                </Label>
                                <Select
                                    value={styles.position || "default"}
                                    onValueChange={(value) =>
                                        updateStyle(
                                            "position",
                                            value === "default"
                                                ? undefined
                                                : value,
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-24 max-h-6 px-1 py-0 text-xs border">
                                        <SelectValue placeholder="Default" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">
                                            Default
                                        </SelectItem>
                                        <SelectItem value="static">
                                            Static
                                        </SelectItem>
                                        <SelectItem value="relative">
                                            Relative
                                        </SelectItem>
                                        <SelectItem value="absolute">
                                            Absolute
                                        </SelectItem>
                                        <SelectItem value="fixed">
                                            Fixed
                                        </SelectItem>
                                        <SelectItem value="sticky">
                                            Sticky
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Position & Z-Index Section */}
                    <AccordionItem value="position">
                        <AccordionTrigger className="text-xs">
                            Position & Z-Index
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2 py-1">
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="position"
                                        className="text-xs w-16"
                                    >
                                        Position
                                    </Label>
                                    <Select
                                        value={styles.position || "default"}
                                        onValueChange={(value) =>
                                            updateStyle(
                                                "position",
                                                value === "default"
                                                    ? undefined
                                                    : value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-24 max-h-6 px-1 py-0 text-xs border">
                                            <SelectValue placeholder="Default" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">
                                                Default
                                            </SelectItem>
                                            <SelectItem value="static">
                                                Static
                                            </SelectItem>
                                            <SelectItem value="relative">
                                                Relative
                                            </SelectItem>
                                            <SelectItem value="absolute">
                                                Absolute
                                            </SelectItem>
                                            <SelectItem value="fixed">
                                                Fixed
                                            </SelectItem>
                                            <SelectItem value="sticky">
                                                Sticky
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-5">
                                    <Label
                                        htmlFor="zIndex"
                                        className="text-xs w-16"
                                    >
                                        Z-Index
                                    </Label>
                                    <Input
                                        id="zIndex"
                                        type="number"
                                        value={styles.zIndex || ""}
                                        onChange={(e) =>
                                            updateStyle(
                                                "zIndex",
                                                e.target.value,
                                            )
                                        }
                                        className="w-20 h-6 px-1 py-0 text-xs border"
                                    />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Position Values Section */}
                    {selectedElement.styles?.position === "absolute" ||
                        (selectedElement.styles?.position === "relative" && (
                            <AccordionItem value="position-values">
                                <AccordionTrigger className="text-xs">
                                    Position Values
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-2 py-1">
                                        <div className="flex items-center gap-5">
                                            <Label
                                                htmlFor="top"
                                                className="text-xs w-16"
                                            >
                                                Top
                                            </Label>
                                            <Input
                                                id="top"
                                                type="text"
                                                value={styles.top || ""}
                                                placeholder="e.g. 10px"
                                                onChange={(e) =>
                                                    updateStyle(
                                                        "top",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-20 h-6 px-1 py-0 text-xs border"
                                            />
                                        </div>
                                        <div className="flex items-center gap-5">
                                            <Label
                                                htmlFor="bottom"
                                                className="text-xs w-16"
                                            >
                                                Bottom
                                            </Label>
                                            <Input
                                                id="bottom"
                                                type="text"
                                                value={styles.bottom || ""}
                                                placeholder="e.g. 10px"
                                                onChange={(e) =>
                                                    updateStyle(
                                                        "bottom",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-20 h-6 px-1 py-0 text-xs border"
                                            />
                                        </div>
                                        <div className="flex items-center gap-5">
                                            <Label
                                                htmlFor="left"
                                                className="text-xs w-16"
                                            >
                                                Left
                                            </Label>
                                            <Input
                                                id="left"
                                                type="text"
                                                value={styles.left || ""}
                                                placeholder="e.g. 10px"
                                                onChange={(e) =>
                                                    updateStyle(
                                                        "left",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-20 h-6 px-1 py-0 text-xs border"
                                            />
                                        </div>
                                        <div className="flex items-center gap-5">
                                            <Label
                                                htmlFor="right"
                                                className="text-xs w-16"
                                            >
                                                Right
                                            </Label>
                                            <Input
                                                id="right"
                                                type="text"
                                                value={styles.right || ""}
                                                placeholder="e.g. 10px"
                                                onChange={(e) =>
                                                    updateStyle(
                                                        "right",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-20 h-6 px-1 py-0 text-xs border"
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                </Accordion>
            </AccordionContent>
        </AccordionItem>
    );
};
