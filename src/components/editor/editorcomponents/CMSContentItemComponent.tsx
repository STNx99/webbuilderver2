import React from "react";
import { useElementHandler } from "@/hooks";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { CMSContentItemElement } from "@/interfaces/elements.interface";
import ElementLoader from "../ElementLoader";
import { Database } from "lucide-react";
import { useCMSContentItem, getFieldValue } from "@/hooks";
import { elementHelper } from "@/lib/utils/element/elementhelper";

const CMSContentItemComponent = ({ element, data }: EditorComponentProps) => {
  const cmsElement = element as CMSContentItemElement;
  const { getCommonProps } = useElementHandler();

  const safeStyles = elementHelper.getSafeStyles(cmsElement);

  const settings = cmsElement.settings || {};
  const { contentTypeId, itemSlug } = settings;

  const { contentItem } = useCMSContentItem(
    contentTypeId || "",
    itemSlug || "",
  );

  const itemToRender = data || contentItem;

  if (!contentTypeId) {
    return (
      <div
        {...getCommonProps(cmsElement)}
        style={{ ...safeStyles, width: "100%", height: "100%" }}
        className="flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50"
      >
        <div className="text-center text-gray-500">
          <Database className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">CMS Content Item</p>
          <p className="text-xs">Configure content type and slug in settings</p>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getCommonProps(cmsElement)}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
      }}
    >
      {cmsElement.elements && cmsElement.elements.length > 0 ? (
        // Use child elements as template
        <ElementLoader elements={cmsElement.elements} data={itemToRender} />
      ) : itemToRender ? (
        // Default rendering
        <article className="max-w-4xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{itemToRender.title}</h1>
            <div className="text-sm text-gray-600">
              By {getFieldValue(itemToRender, "author")} •{" "}
              {itemToRender.createdAt
                ? new Date(itemToRender.createdAt).toLocaleDateString()
                : ""}
            </div>
          </header>

          {getFieldValue(itemToRender, "excerpt") && (
            <p className="text-lg text-gray-700 mb-6 italic">
              {getFieldValue(itemToRender, "excerpt")}
            </p>
          )}

          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  getFieldValue(itemToRender, "content") ||
                  "Sample content would be rendered here.",
              }}
            />
          </div>

          <footer className="mt-8 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Published: {itemToRender.published ? "Yes" : "No"} • Slug:{" "}
              {itemToRender.slug}
            </div>
          </footer>
        </article>
      ) : (
        <div className="flex items-center justify-center text-gray-500">
          Loading content item...
        </div>
      )}
    </div>
  );
};

export default CMSContentItemComponent;
