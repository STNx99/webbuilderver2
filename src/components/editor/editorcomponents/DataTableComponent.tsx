import React from "react";
import { EditorComponentProps } from "@/interfaces/editor";
import { DataTableElement } from "@/interfaces/element";

const DataTableComponent = ({
  element,
}: EditorComponentProps) => {
  const dataTableElement = element as DataTableElement;

  return (
    <div
      style={dataTableElement.styles}
      className={dataTableElement.tailwindStyles}
    >
      <table className="w-full">
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{dataTableElement.content || "Data"}</td>
            <td>Table</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataTableComponent;
