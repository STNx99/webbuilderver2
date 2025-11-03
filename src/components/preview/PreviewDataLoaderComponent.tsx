import React, { useState, useEffect } from "react";
import { DataLoaderElement } from "@/interfaces/elements.interface";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import PreviewElementLoader from "./PreviewElementLoader";

interface PreviewDataLoaderComponentProps {
  element: DataLoaderElement;
  data?: any;
}

const PreviewDataLoaderComponent = ({
  element,
}: PreviewDataLoaderComponentProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const settings = element.settings;
    if (!settings?.apiUrl) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...settings.headers,
        };

        if (settings.authToken) {
          headers["Authorization"] = `Bearer ${settings.authToken}`;
        }

        const response = await fetch(settings.apiUrl, {
          method: settings.method || "GET",
          headers,
          body: settings.body ? JSON.stringify(settings.body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [element.settings]);

  const safeStyles = elementHelper.getSafeStyles(element);

  if (loading) {
    return (
      <div
        style={{
          ...safeStyles,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          ...safeStyles,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "red",
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div className={element.tailwindStyles} style={safeStyles}>
      <PreviewElementLoader elements={element.elements} data={data} />
    </div>
  );
};

export default PreviewDataLoaderComponent;
