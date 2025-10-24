import { EditorElement, ContainerElement } from "@/types/global.type";
import { BaseCodeGenerator, GeneratedCode } from "./codeGeneratorBase";
import { isContainerElement } from "@/lib/utils/element/elementhelper";

export class HTMLCodeGenerator extends BaseCodeGenerator {
  async generateCode(elements: EditorElement[]): Promise<GeneratedCode> {
    this.cssClasses.clear();
    this.classCounter = 0;

    // Validate elements
    if (!elements || elements.length === 0) {
      console.warn("No elements provided for code generation");
      const emptyResult: GeneratedCode = {
        html: "<!-- No elements to generate -->",
        css: "/* No styles */",
        js: "// No scripts",
        fullPage: this.generateFullPage(
          "<!-- No elements to generate -->",
          "/* No styles */",
          "// No scripts",
        ),
      };
      emptyResult.zipBlob = await this.generateZipFile(emptyResult);
      return emptyResult;
    }

    const html = this.generateHTML(elements);
    const css = this.generateCSS();
    const js = this.generateJS(elements);
    const fullPage = this.generateFullPage(html, css, js);

    console.log("Generated HTML length:", html.length);
    console.log("Generated CSS length:", css.length);
    console.log("Generated JS length:", js.length);
    console.log("Generated Full Page length:", fullPage.length);

    const result: GeneratedCode = {
      html,
      css,
      js,
      fullPage,
    };
    result.zipBlob = await this.generateZipFile(result);

    return result;
  }
}

export class ReactCodeGenerator extends BaseCodeGenerator {
  async generateCode(elements: EditorElement[]): Promise<GeneratedCode> {
    const reactApp = this.generateReactApp(elements);
    const reactComponents = this.generateReactComponents(elements);
    const reactIndex = this.generateReactIndexFile(elements);
    const packageJson = this.generatePackageJson();

    const result: GeneratedCode = {
      html: "",
      css: "",
      js: "",
      fullPage: "",
      reactApp,
      reactComponents,
      reactIndex,
      packageJson,
    };

    result.zipBlob = await this.generateZipFile(result);

    return result;
  }

  private generateReactApp(elements: EditorElement[]): string {
    const componentImports = this.generateReactComponentImports(elements);
    const componentUsage = this.generateReactComponentUsage(elements);
    const pageTitle = this.options.page?.Name || "Exported Page";
    const pageType = this.options.page?.Type || "sp";

    return `import React from 'react';
import './App.css';
${componentImports}

/**
 * ${pageTitle}
 * Page Type: ${pageType}
 * Generated from WebBuilder
 */
function App() {
  // Set document title
  React.useEffect(() => {
    document.title = '${pageTitle}';
  }, []);

  return (
    <div className="App" data-page-type="${pageType}">
${componentUsage}
    </div>
  );
}

export default App;
`;
  }

  private generateReactIndexFile(elements: EditorElement[]): string {
    const elementTypes = [...new Set(elements.map((el) => el.type))];
    const exports = elementTypes
      .map((type) => {
        const componentName = this.getReactComponentName(type);
        return `export { default as ${componentName} } from './${componentName}';`;
      })
      .join("\n");

    return exports;
  }

  private generateReactComponents(
    elements: EditorElement[],
  ): Record<string, string> {
    const components: Record<string, string> = {};

    // Generate component for each unique element type
    const elementTypes = [...new Set(elements.map((el) => el.type))];

    elementTypes.forEach((type) => {
      const componentCode = this.generateReactComponentForType(type);
      if (componentCode) {
        const filename = `${this.getReactComponentName(type)}.jsx`;
        components[filename] = componentCode;
      }
    });

    return components;
  }

  private generateReactComponentForType(type: string): string {
    switch (type) {
      case "Text":
        return `const TextComponent = ({ content, styles, className, children }) => (
<div className={className} style={styles}>
  {content}
  {children}
</div>
);`;

      case "Button":
        return `const ButtonComponent = ({ content, styles, className, onClick, children }) => (
<button className={className} style={styles} onClick={onClick}>
  {content}
  {children}
</button>
);`;

      case "Input":
        return `const InputComponent = ({ type = 'text', placeholder, name, value, onChange, styles, className }) => (
<input
  type={type}
  placeholder={placeholder}
  name={name}
  value={value}
  onChange={onChange}
  className={className}
  style={styles}
/>
);`;

      case "Image":
        return `const ImageComponent = ({ src, alt, styles, className }) => (
<img src={src} alt={alt} className={className} style={styles} />
);`;

      case "Form":
        return `const FormComponent = ({ action, method, onSubmit, styles, className, children }) => (
<form action={action} method={method} onSubmit={onSubmit} className={className} style={styles}>
  {children}
</form>
);`;

      case "CMSContentList":
        return `import { useState, useEffect } from 'react';

const CMSContentList = ({ contentType, limit = 10, styles, className }) => {
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/cms/' + contentType + '?limit=' + limit);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch CMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [contentType, limit]);

if (loading) return <div className={className} style={styles}>Loading...</div>;

return (
  <ul className={className} style={styles}>
    {items.map((item, index) => (
      <li key={index}>
        <h3>{item.title}</h3>
        <p>{item.description || item.content}</p>
      </li>
    ))}
  </ul>
);
};`;

      case "CMSContentItem":
        return `import { useState, useEffect } from 'react';

const CMSContentItem = ({ contentType, itemSlug, styles, className }) => {
const [item, setItem] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/cms/' + contentType + '/' + itemSlug);
      const data = await response.json();
      setItem(data);
    } catch (error) {
      console.error('Failed to fetch CMS item:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [contentType, itemSlug]);

if (loading) return <div className={className} style={styles}>Loading...</div>;
if (!item) return <div className={className} style={styles}>Item not found</div>;

return (
  <article className={className} style={styles}>
    <h2>{item.title}</h2>
    <div dangerouslySetInnerHTML={{ __html: item.content }} />
    {item.image && <img src={item.image} alt={item.title} />}
  </article>
);
};`;

      case "CMSContentGrid":
        return `import { useState, useEffect } from 'react';

const CMSContentGrid = ({ contentType, limit = 12, styles, className }) => {
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/cms/' + contentType + '?limit=' + limit);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch CMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [contentType, limit]);

if (loading) return <div className={className} style={styles}>Loading...</div>;

return (
  <div className={className} style={styles}>
    {items.map((item, index) => (
      <div key={index} className="grid-item">
        {item.image && <img src={item.image} alt={item.title} />}
        <h4>{item.title}</h4>
        <p>{item.description || (item.content?.substring(0, 100) + '...')}</p>
      </div>
    ))}
  </div>
);
};`;

      case "Container":
        return `const ContainerComponent = ({ styles, className, children }) => (
<div className={className} style={styles}>
  {children}
</div>
);`;

      case "Section":
        return `const SectionComponent = ({ styles, className, children }) => (
<section className={className} style={styles}>
  {children}
</section>
);`;

      case "TwoColumns":
        return `const TwoColumnsComponent = ({ styles, className, children }) => (
<div className={className} style={styles}>
  {children}
</div>
);`;

      default:
        return `const DivComponent = ({ styles, className, children }) => (
<div className={className} style={styles}>
  {children}
</div>
);`;
    }
  }

  private generateReactComponentImports(elements: EditorElement[]): string {
    const imports: string[] = [];
    const elementTypes = [...new Set(elements.map((el) => el.type))];

    elementTypes.forEach((type) => {
      const componentName = this.getReactComponentName(type);
      imports.push(`import { ${componentName} } from './components';`);
    });

    return imports.join("\n");
  }

  private generateReactComponentUsage(
    elements: EditorElement[],
    indent = 6,
  ): string {
    return elements
      .map((element) => {
        const props = this.generateReactProps(element);
        const componentName = this.getReactComponentName(element.type);
        const indentStr = " ".repeat(indent);

        // Check if element has children
        if (isContainerElement(element)) {
          const container = element as ContainerElement;
          const children = container.elements || [];

          if (children.length > 0) {
            const childrenCode = this.generateReactComponentUsage(
              children,
              indent + 2,
            );
            return `${indentStr}<${componentName}${props}>\n${childrenCode}\n${indentStr}</${componentName}>`;
          }
        }

        return `${indentStr}<${componentName}${props} />`;
      })
      .join("\n");
  }

  private getReactComponentName(type: string): string {
    const nameMap: Record<string, string> = {
      Text: "TextComponent",
      Button: "ButtonComponent",
      Input: "InputComponent",
      Image: "ImageComponent",
      Form: "FormComponent",
      CMSContentList: "CMSContentList",
      CMSContentItem: "CMSContentItem",
      CMSContentGrid: "CMSContentGrid",
      Container: "ContainerComponent",
      Section: "SectionComponent",
      TwoColumns: "TwoColumnsComponent",
    };
    return nameMap[type] || "DivComponent";
  }

  private generateReactProps(element: EditorElement): string {
    const props: string[] = [];

    if (element.content) {
      props.push(`content="${element.content}"`);
    }

    if (element.src) {
      props.push(`src="${element.src}"`);
    }

    if (element.styles) {
      const styleString = this.reactStylesToString(element.styles);
      props.push(`styles={${styleString}}`);
    }

    if (element.tailwindStyles) {
      props.push(`className="${element.tailwindStyles}"`);
    }

    // Element-specific props
    switch (element.type) {
      case "Input":
        const inputSettings = element.settings as any;
        if (inputSettings?.type) props.push(`type="${inputSettings.type}"`);
        if (inputSettings?.placeholder)
          props.push(`placeholder="${inputSettings.placeholder}"`);
        if (inputSettings?.name) props.push(`name="${inputSettings.name}"`);
        break;
      case "Form":
        const formSettings = element.settings as any;
        if (formSettings?.action) props.push(`action="${formSettings.action}"`);
        if (formSettings?.method) props.push(`method="${formSettings.method}"`);
        break;
      case "CMSContentList":
      case "CMSContentGrid":
        const listSettings = element.settings as any;
        if (listSettings?.contentTypeId)
          props.push(`contentType="${listSettings.contentTypeId}"`);
        if (listSettings?.limit) props.push(`limit={${listSettings.limit}}`);
        break;
      case "CMSContentItem":
        const itemSettings = element.settings as any;
        if (itemSettings?.contentTypeId)
          props.push(`contentType="${itemSettings.contentTypeId}"`);
        if (itemSettings?.itemSlug)
          props.push(`itemSlug="${itemSettings.itemSlug}"`);
        break;
    }

    return props.length > 0 ? " " + props.join(" ") : "";
  }

  private reactStylesToString(styles: any): string {
    if (!styles || typeof styles !== "object") return "{}";

    const styleEntries = Object.entries(styles).map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${cssKey}: '${value}'`;
    });

    return `{${styleEntries.join(", ")}}`;
  }

  private generatePackageJson(): string {
    const pageName = this.options.page?.Name || "exported-react-app";
    const sanitizedName = pageName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const packageJson = {
      name: sanitizedName,
      version: "0.1.0",
      private: true,
      description: `Generated from WebBuilder - ${pageName}`,
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "react-scripts": "5.0.1",
      },
      scripts: {
        start: "react-scripts start",
        build: "react-scripts build",
        test: "react-scripts test",
        eject: "react-scripts eject",
      },
      eslintConfig: {
        extends: ["react-app"],
      },
      browserslist: {
        production: [">0.2%", "not dead", "not op_mini all"],
        development: [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version",
        ],
      },
    };
    return JSON.stringify(packageJson, null, 2);
  }
}
