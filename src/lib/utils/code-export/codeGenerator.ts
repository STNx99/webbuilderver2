import { EditorElement } from "@/types/global.type";
import {
  CodeGenerationOptions,
  GeneratedCode,
  BaseCodeGenerator,
} from "./codeGeneratorBase";
import { HTMLCodeGenerator, ReactCodeGenerator } from "./codeGenerators";

export type { CodeGenerationOptions, GeneratedCode };

class CodeGeneratorFactory {
  static createGenerator(
    options: CodeGenerationOptions = {},
  ): BaseCodeGenerator {
    const exportFormat = options.exportFormat || "html";

    switch (exportFormat) {
      case "react":
        return new ReactCodeGenerator(options);
      case "html":
      default:
        return new HTMLCodeGenerator(options);
    }
  }
}

export async function generateCodeFromElements(
  elements: EditorElement[],
  options?: CodeGenerationOptions,
): Promise<GeneratedCode> {
  const generator = CodeGeneratorFactory.createGenerator(options);
  return await generator.generateCode(elements);
}

export default CodeGeneratorFactory;
