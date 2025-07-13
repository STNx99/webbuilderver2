import { EditorElement } from "@/types/global.type";
import { v4 as uuidv4 } from "uuid";

const createElements = (
  type: string,
  x: number,
  y: number,
  projectId: string,
  src?: string,
  parentId?: string
): EditorElement => {
  const baseProperties = {
    id: uuidv4(),
    content: type,
    isSelected: false,
    isHovered: false,
    isDraggedOver: false,
    x,
    y,
    projectId,
    parentId: parentId || undefined,
    src,
  };

  switch (type.toLowerCase()) {
    case "text":
        return {
          type: "Text",
          ...baseProperties,
          styles: {
          },
        };

    case "frame":
      return {
        type: "Frame",
        ...baseProperties,
        elements: [],
        styles: {
          ...baseProperties,
          width: "400px",
          height: "300px",
          backgroundColor: "#ffffff",
          border: "2px dashed #cbd5e1",
          padding: "20px",
        },
        tailwindStyles:
          "border-2 border-dashed border-slate-300 bg-white p-5 rounded-lg",
      };
    case "button":
      return {
        type: "Button",
        ...baseProperties,
        content: "Click me",
        buttonType: "primary",
        styles: {
          ...baseProperties,
          width: "120px",
          height: "40px",
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          padding: "8px 16px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
        },
        tailwindStyles:
          "bg-blue-500 text-white border-none rounded-md px-4 py-2 cursor-pointer text-sm font-medium hover:bg-blue-600 transition-colors",
      };

    case "input":
      return {
        type: "Input",
        ...baseProperties,
        content: "",
        inputSettings: {
          type: "text",
          placeholder: "Enter text...",
        },
        styles: {
          width: "200px",
          height: "40px",
          padding: "8px 12px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          fontSize: "14px",
          backgroundColor: "#ffffff",
        },
        tailwindStyles:
          "border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      };
    case "list":
      return {
        type: "List",
        ...baseProperties,
        elements: [],
        styles: {
          width: "250px",
          height: "200px",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          padding: "12px",
        },
        tailwindStyles:
          "border border-gray-200 rounded-md bg-white p-3 shadow-sm",
      };

    case "select":
      return {
        type: "Select",
        ...baseProperties,
        options: [
          { value: "option1", text: "Option 1" },
          { value: "option2", text: "Option 2" },
        ],
        selectSettings: {},
        styles: {
          width: "180px",
          height: "40px",
          padding: "8px 12px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          cursor: "pointer",
        },
        tailwindStyles:
          "border border-gray-300 rounded-md px-3 py-2 text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500",
      };
    case "chart":
      return {
        type: "Chart",
        ...baseProperties,
        chartType: "bar",
        chartData: {
          labels: ["January", "February", "March", "April", "May"],
          datasets: [
            {
              label: "Sample Data",
              data: [12, 19, 3, 5, 2],
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
              borderColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
              borderWidth: 1,
            },
          ],
        },
        chartOptions: {},
        styles: {
          width: "400px",
          height: "300px",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "16px",
        },
        tailwindStyles:
          "border border-gray-200 rounded-lg bg-white p-4 shadow-sm",
      };
    case "datatable":
      return {
        type: "DataTable",
        ...baseProperties,
        headers: ["Name", "Age", "City"],
        rows: [
          ["John Doe", 25, "New York"],
          ["Jane Smith", 30, "London"],
          ["Bob Johnson", 35, "Paris"],
        ],
        tableSettings: {
          sortable: true,
          searchable: true,
          pagination: true,
          rowsPerPage: 10,
          striped: true,
          bordered: false,
          hoverEffect: true,
        },
        styles: {
          width: "500px",
          height: "350px",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "16px",
          overflow: "auto",
        },
        tailwindStyles:
          "border border-gray-200 rounded-lg bg-white p-4 shadow-sm overflow-auto",
      };

    case "form":
      return {
        type: "Form",
        ...baseProperties,
        elements: [],
        formSettings: {
          method: "POST",
          action: "",
        },
        styles: {
          width: "350px",
          height: "400px",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
        },
        tailwindStyles:
          "border border-gray-200 rounded-lg bg-white p-5 shadow-sm",
      };
    case "section":
      return {
        type: "Section",
        ...baseProperties,
        elements: [],
        styles: {
          width: "100%",
          minHeight: "200px",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "24px",
        },
        tailwindStyles:
          "w-full min-h-[200px] border border-gray-200 rounded-lg bg-white p-6 shadow-sm",
      };
    case "carousel":
      return {
        type: "Carousel",
        ...baseProperties,
        elements: [],
        carouselSettings: {
          autoplay: true,
          dots: true,
          arrows: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
        styles: {
          width: "500px",
          height: "300px",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "16px",
          overflow: "hidden",
        },
        tailwindStyles:
          "w-[500px] h-[300px] border border-gray-200 rounded-lg bg-white p-4 shadow-sm overflow-hidden",
      };
    default:
      return {
        type: "Base",
        ...baseProperties,
        styles: {
          width: "200px",
          height: "100px",
          backgroundColor: "#f8f9fa",
          padding: "16px",
        },
        tailwindStyles: "border border-gray-300 rounded-md bg-gray-50 p-4",
      };
  }
};

export { createElements };
