import { useElementStore } from "@/globalstore/elementstore";
import { InputElement } from "@/interfaces/elements.interface";
import { RuleType, ValidationRule } from "@/interfaces/validate.interface";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectItem,
    SelectValue,
    SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type ValidationConfigurationProps = {
    validateRules: ValidationRule[];
};

const ALL_RULES: RuleType[] = [
    "required",
    "minLength",
    "maxLength",
    "pattern",
    "custom",
];

export default function ValidationConfiguration({
    validateRules,
}: ValidationConfigurationProps) {
    const { selectedElement, updateElement } = useElementStore<InputElement>();
    const [newRule, setNewRule] = useState<RuleType>("required");

    const updateValidationRule = <T extends ValidationRule>(
        updateRule: T,
    ): void => {
        if (!selectedElement) return;
        const currentRules = selectedElement.settings?.validateRules ?? [];
        const ruleIndex = currentRules.findIndex(
            (rule) => rule.rule === updateRule.rule,
        );

        let newRules: ValidationRule[];
        if (ruleIndex !== -1) {
            newRules = [
                ...currentRules.slice(0, ruleIndex),
                updateRule,
                ...currentRules.slice(ruleIndex + 1),
            ];
        } else {
            newRules = [...currentRules, updateRule];
        }

        updateElement(selectedElement.id, {
            settings: {
                ...selectedElement.settings,
                validateRules: newRules,
            },
        });
    };

    const removeValidationRule = (ruleType: RuleType) => {
        if (!selectedElement) return;
        const currentRules = selectedElement.settings?.validateRules ?? [];
        const newRules = currentRules.filter((rule) => rule.rule !== ruleType);
        updateElement(selectedElement.id, {
            settings: {
                ...selectedElement.settings,
                validateRules: newRules,
            },
        });
    };

    const handleAddRule = () => {
        if (validateRules.some((rule) => rule.rule === newRule)) return;
        let defaultRule: ValidationRule;
        switch (newRule) {
            case "required":
                defaultRule = { rule: "required", message: "" };
                break;
            case "minLength":
                defaultRule = { rule: "minLength", value: 1, message: "" };
                break;
            case "maxLength":
                defaultRule = { rule: "maxLength", value: 10, message: "" };
                break;
            case "min":
                defaultRule = { rule: "min", value: 0, message: "" };
                break;
            case "max":
                defaultRule = { rule: "max", value: 100, message: "" };
                break;
            case "pattern":
                defaultRule = { rule: "pattern", value: "", message: "" };
                break;
            case "custom":
                defaultRule = {
                    rule: "custom",
                    message: "",
                    validateFn: (v: unknown) => true,
                };
                break;
            default:
                return;
        }
        updateValidationRule(defaultRule);
    };

    const renderRuleConfig = (rule: ValidationRule) => {
        switch (rule.rule) {
            case "required":
                // No value property for required, just show label
                return (
                    <div className="flex items-center gap-2">
                        <Label
                            htmlFor={`required-${rule.rule}`}
                            className="text-xs"
                        >
                            Required
                        </Label>
                    </div>
                );
            case "minLength":
            case "maxLength":
            case "min":
            case "max":
                return (
                    <Input
                        type="number"
                        value={typeof rule.value === "number" ? rule.value : ""}
                        min={0}
                        onChange={(e) =>
                            updateValidationRule({
                                ...rule,
                                value: Number(e.target.value),
                            })
                        }
                        className="w-20 h-7 px-2 py-1 text-xs"
                        placeholder={rule.rule}
                    />
                );
            case "pattern":
                return (
                    <Input
                        type="text"
                        value={
                            typeof rule.value === "string"
                                ? rule.value
                                : rule.value instanceof RegExp
                                  ? rule.value.source
                                  : ""
                        }
                        onChange={(e) =>
                            updateValidationRule({
                                ...rule,
                                value: e.target.value,
                            })
                        }
                        className="w-32 h-7 px-2 py-1 text-xs"
                        placeholder="Regex pattern"
                        autoComplete="off"
                    />
                );
            case "custom":
                // Only allow editing the message for custom rules
                return (
                    <div className="text-xs text-gray-500 italic">
                        Custom validation function (edit in code)
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center">
                <Select
                    value={newRule}
                    onValueChange={(value) => setNewRule(value as RuleType)}
                >
                    <SelectTrigger className="w-36 h-7 px-2 py-1 text-xs">
                        <SelectValue placeholder="Select rule" />
                    </SelectTrigger>
                    <SelectContent>
                        {ALL_RULES.filter(
                            (rt) =>
                                !validateRules.some((rule) => rule.rule === rt),
                        ).map((rt) => (
                            <SelectItem
                                key={rt}
                                value={rt}
                                className="capitalize"
                            >
                                {rt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    type="button"
                    className="h-7 px-3 py-1 text-xs"
                    onClick={handleAddRule}
                    disabled={validateRules.some(
                        (rule) => rule.rule === newRule,
                    )}
                >
                    Add Rule
                </Button>
            </div>
            {validateRules.length === 0 && (
                <div className="text-xs text-gray-400">
                    No validation rules set.
                </div>
            )}
            <div className="flex flex-col gap-2">
                {validateRules.map((rule) => (
                    <div
                        key={rule.rule}
                        className="flex flex-row items-center gap-2"
                    >
                        <Label className="capitalize text-xs w-20">
                            {rule.rule}
                        </Label>
                        {renderRuleConfig(rule)}
                        <Input
                            type="text"
                            className="w-32 h-7 px-2 py-1 text-xs"
                            placeholder="Message"
                            value={rule.message ?? ""}
                            onChange={(e) =>
                                updateValidationRule({
                                    ...rule,
                                    message: e.target.value,
                                })
                            }
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            className="h-7 px-2 py-1 text-xs"
                            onClick={() => removeValidationRule(rule.rule)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
