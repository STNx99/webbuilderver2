import { CustomComponent } from "../customComponents";
import { v4 as uuidv4 } from "uuid";

export const cardComponent: CustomComponent = {
  component: {
    type: "Frame",
    name: "Card",
    content: "",
    styles: {
      width: "360px",
      display: "flex",
      backgroundColor: "white",
      flexDirection: "column",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      transition: "all 0.3s ease",
      border: "1px solid #e5e7eb",
      gap: "16px",
      overflow: "hidden",
    },
    tailwindStyles:
      "w-[360px] bg-white flex flex-col rounded-xl p-6 shadow-lg border border-gray-200 gap-4 hover:shadow-xl transition-shadow",
    elements: [
      {
        type: "Text",
        name: "Card Title",
        content: "Card Title",
        styles: {
          fontSize: "20px",
          fontWeight: "700",
          color: "#111827",
          marginBottom: "4px",
        },
        tailwindStyles: "text-xl font-bold text-gray-900 mb-1",
      },
      {
        type: "Text",
        name: "Card Description",
        content:
          "This is a description for the card. You can add details about features, benefits, or any other relevant information here.",
        styles: {
          fontSize: "16px",
          color: "#6b7280",
          lineHeight: "1.5",
          marginBottom: "16px",
        },
        tailwindStyles: "text-base text-gray-500 leading-relaxed mb-4",
      },
      {
        type: "Button",
        name: "Card Button",
        content: "Learn More",
        styles: {
          padding: "12px 24px",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background 0.2s",
        },
        tailwindStyles:
          "bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-base",
      },
    ],
  },
};
