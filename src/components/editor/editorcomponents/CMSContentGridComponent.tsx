import React, { useEffect } from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { CMSContentGridElement } from "@/interfaces/elements.interface";
import { LayoutGroup } from "framer-motion";
import ElementLoader from "../ElementLoader";
import { Database } from "lucide-react";
import { useCMSContent, getFieldValue } from "@/hooks/useCMSContent";
import { elementHelper } from "@/lib/utils/element/elementhelper";


const CMSContentGridComponent = ({ element, data }: EditorComponentProps) => {
  const cmsElement = element as CMSContentGridElement;
  const { getCommonProps } = useElementHandler();

  const safeStyles = elementHelper.getSafeStyles(cmsElement);

  // Get CMS settings
  const settings = cmsElement.settings || {};
  const {
    contentTypeId,
    limit = 6,
    sortBy = "createdAt",
    sortOrder = "desc",
    fieldsToShow = ["title", "content"],
  } = settings;

  const { contentItems } = useCMSContent({
    contentTypeId,
    limit,
    sortBy,
    sortOrder,
    enabled: !!contentTypeId,
  });

  const itemsToRender = Array.isArray(data)
    ? data
    : contentItems && contentItems.length > 0
      ? contentItems
      : [];

  // Apply limit
  const limitedItems = itemsToRender.slice(0, limit);

  if (!contentTypeId) {
    return (
      <div
        {...getCommonProps(cmsElement)}
        style={{ ...safeStyles, width: "100%", height: "100%" }}
        className="flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50"
      >
        <div className="text-center text-gray-500">
          <Database className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">CMS Content Grid</p>
          <p className="text-xs">Configure content type in settings</p>
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <LayoutGroup>
        {limitedItems.map((item, index) => (
          <div key={item.id || index} className="group">
            {cmsElement.elements && cmsElement.elements.length > 0 ? (
              <ElementLoader elements={cmsElement.elements} data={item} />
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                {fieldsToShow.includes("image") &&
                  getFieldValue(item, "image") && (
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <img
                        src={getFieldValue(item, "image")}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextElementSibling) {
                            (
                              e.currentTarget.nextElementSibling as HTMLElement
                            ).style.display = "flex";
                          }
                        }}
                      />
                      <div className="hidden items-center justify-center text-gray-400">
                        <Database className="w-8 h-8" />
                      </div>
                    </div>
                  )}

                <div className="p-4">
                  {fieldsToShow.includes("title") && (
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title || `Item ${index + 1}`}
                    </h3>
                  )}

                  {fieldsToShow.includes("excerpt") &&
                    getFieldValue(item, "excerpt") && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {getFieldValue(item, "excerpt")}
                      </p>
                    )}

                  {/* Content field (fallback if no excerpt) */}
                  {fieldsToShow.includes("content") &&
                    getFieldValue(item, "content") &&
                    !getFieldValue(item, "excerpt") && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {getFieldValue(item, "content")?.substring(0, 120)}...
                      </p>
                    )}

                  {fieldsToShow.includes("author") &&
                    getFieldValue(item, "author") && (
                      <p className="text-gray-600 text-sm mb-2">
                        By {getFieldValue(item, "author")}
                      </p>
                    )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {fieldsToShow.includes("date") && (
                      <span>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    )}
                    {fieldsToShow.includes("status") && item.published && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Published
                      </span>
                    )}
                  </div>

                  {fieldsToShow
                    .filter(
                      (field) =>
                        ![
                          "title",
                          "excerpt",
                          "content",
                          "image",
                          "author",
                          "date",
                          "status",
                        ].includes(field),
                    )
                    .map((fieldName) => {
                      const fieldValue = getFieldValue(item, fieldName);
                      if (fieldValue) {
                        return (
                          <div key={fieldName} className="mt-2">
                            <span className="text-xs font-medium text-gray-500 capitalize">
                              {fieldName}:
                            </span>
                            <span className="text-sm text-gray-700 ml-1">
                              {typeof fieldValue === "boolean"
                                ? fieldValue
                                  ? "Yes"
                                  : "No"
                                : String(fieldValue)}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>
              </div>
            )}
          </div>
        ))}
      </LayoutGroup>
    </div>
  );
};

export default CMSContentGridComponent;
