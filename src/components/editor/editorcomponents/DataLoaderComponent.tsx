import React, { useState, useEffect } from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { DataLoaderElement } from "@/interfaces/elements.interface";
import ElementLoader from "../ElementLoader";

const DataLoaderComponent = ({ element }: EditorComponentProps) => {
  const dataLoaderElement = element as DataLoaderElement;
  const { getCommonProps } = useElementHandler();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const settings = dataLoaderElement.settings;
    if (!settings?.apiUrl) return;

    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const options: RequestInit = {
          method: settings.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...settings.headers,
            ...(settings.authToken && { 'Authorization': `Bearer ${settings.authToken}` }),
          },
          ...(settings.body && { body: settings.body }),
        };

        const response = await fetch(settings.apiUrl, options);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataLoaderElement.settings?.apiUrl, dataLoaderElement.settings?.method, dataLoaderElement.settings?.headers, dataLoaderElement.settings?.body, dataLoaderElement.settings?.authToken]);

  const safeStyles =
    dataLoaderElement.styles &&
    typeof dataLoaderElement.styles === "object" &&
    !Array.isArray(dataLoaderElement.styles)
      ? dataLoaderElement.styles
      : {};

  return (
    <div
      {...getCommonProps(dataLoaderElement)}
      style={{
        ...safeStyles,
        width: "100%",
        height: "100%",
      }}
    >
      {loading && <div>Loading data...</div>}
      {error && <div>Error: {error}</div>}
      {data && <ElementLoader elements={dataLoaderElement.elements} />}
    </div>
  );
};

export default DataLoaderComponent;
