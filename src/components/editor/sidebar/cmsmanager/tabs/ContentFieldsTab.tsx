import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContentField, ContentType } from "@/interfaces/cms.interface";
import {
  Plus,
  Edit,
  Trash2,
  Database,
  Loader2,
  Save,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

interface EditableField {
  id?: string;
  name?: string;
  type?: string;
  required?: boolean;
  isNew?: boolean;
  isEditing?: boolean;
}

interface ContentFieldsTabProps {
  selectedTypeId: string;
  contentTypes: ContentType[];
  contentFields: ContentField[];
  isLoading: boolean;
  createFieldMutation: any;
  updateFieldMutation: any;
  deleteFieldMutation: any;
  onCreateField: (data: any) => void;
  onDeleteField: (contentTypeId: string, fieldId: string) => void;
}

export const ContentFieldsTab: React.FC<ContentFieldsTabProps> = ({
  selectedTypeId,
  contentTypes,
  contentFields,
  isLoading,
  createFieldMutation,
  updateFieldMutation,
  deleteFieldMutation,
  onCreateField,
  onDeleteField,
}) => {
  const [editingRows, setEditingRows] = useState<string[]>([]);
  const [newRow, setNewRow] = useState<EditableField | null>(null);
  const [editedValues, setEditedValues] = useState<{
    [key: string]: EditableField;
  }>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const editingRowsSet = useMemo(() => new Set(editingRows), [editingRows]);

  const columnHelper = createColumnHelper<ContentField>();

  const fieldTypes = [
    "text",
    "textarea",
    "richtext",
    "number",
    "boolean",
    "date",
    "email",
    "url",
    "select",
    "multiselect",
  ];

  const columns = useMemo<ColumnDef<ContentField, any>[]>(
    () => [
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Name
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row, getValue }) => {
          const field = row.original;
          const isEditing = editingRowsSet.has(field.id);

          return isEditing ? (
            <Input
              value={editedValues[field.id]?.name ?? getValue()}
              onChange={(e) =>
                updateFieldProperty(field.id, "name", e.target.value)
              }
              className="h-8"
            />
          ) : (
            <span className="font-medium">{getValue()}</span>
          );
        },
      }),
      columnHelper.accessor("type", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Type
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row, getValue }) => {
          const field = row.original;
          const isEditing = editingRowsSet.has(field.id);

          return isEditing ? (
            <Select
              value={editedValues[field.id]?.type ?? getValue()}
              onValueChange={(value) =>
                updateFieldProperty(field.id, "type", value)
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="capitalize">{getValue()}</span>
          );
        },
      }),
      columnHelper.accessor("required", {
        header: "Required",
        cell: ({ row, getValue }) => {
          const field = row.original;
          const isEditing = editingRowsSet.has(field.id);

          return isEditing ? (
            <Switch
              checked={editedValues[field.id]?.required ?? getValue()}
              onCheckedChange={(checked) =>
                updateFieldProperty(field.id, "required", checked)
              }
            />
          ) : getValue() ? (
            <Badge variant="secondary">Required</Badge>
          ) : (
            <span className="text-muted-foreground">Optional</span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const field = row.original;
          const isEditing = editingRowsSet.has(field.id);

          return (
            <div className="flex gap-1">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => saveExistingField(field.id)}
                    disabled={updateFieldMutation.isPending}
                    className="h-8 w-8 p-0"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => stopEditing(field.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditing(field.id)}
                    className="h-8 w-8 p-0"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete Content Field
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the field "
                          {field.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            onDeleteField(selectedTypeId, field.id)
                          }
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          );
        },
      }),
    ],
    [editingRowsSet, editedValues, updateFieldMutation.isPending, fieldTypes],
  );

  const table = useReactTable({
    data: contentFields,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  const startEditing = (fieldId: string) => {
    const field = contentFields.find((f) => f.id === fieldId);
    if (field) {
      setEditedValues((prev) => ({
        ...prev,
        [fieldId]: {
          name: field.name,
          type: field.type,
          required: field.required,
        },
      }));
    }
    setEditingRows((prev) => [...prev, fieldId]);
  };

  const stopEditing = (fieldId: string) => {
    setEditingRows((prev) => prev.filter((id) => id !== fieldId));
    setEditedValues((prev) => {
      const newValues = { ...prev };
      delete newValues[fieldId];
      return newValues;
    });
  };

  const addNewRow = () => {
    const newField: EditableField = {
      isNew: true,
      isEditing: true,
      name: "",
      type: "text",
      required: false,
    };
    setNewRow(newField);
  };

  const cancelNewRow = () => {
    setNewRow(null);
  };

  const saveNewRow = async () => {
    if (!newRow) return;

    const fieldData = {
      name: newRow.name || "",
      type: newRow.type || "text",
      required: newRow.required || false,
    };

    try {
      onCreateField(fieldData);
      setNewRow(null);
    } catch (error) {
      console.error("Failed to create field:", error);
    }
  };

  const updateFieldProperty = (
    fieldId: string,
    property: string,
    value: any,
  ) => {
    if (newRow && newRow.isNew) {
      setNewRow((prev) => ({ ...prev!, [property]: value }));
    } else {
      setEditedValues((prev) => ({
        ...prev,
        [fieldId]: { ...prev[fieldId], [property]: value },
      }));
    }
  };

  const saveExistingField = async (fieldId: string) => {
    const editedData = editedValues[fieldId];
    if (!editedData) return;

    const updateData = {
      name: editedData.name,
      type: editedData.type,
      required: editedData.required,
    };

    try {
      updateFieldMutation.mutate({
        contentTypeId: selectedTypeId,
        fieldId,
        data: updateData,
      });
      stopEditing(fieldId);
    } catch (error) {
      console.error("Failed to update field:", error);
    }
  };
  if (!selectedTypeId) {
    return (
      <div className="text-center py-8">
        <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Select a Content Type</h3>
        <p className="text-muted-foreground">
          Choose a content type from the Content Types tab to manage its fields.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Content Fields Grid</h3>
          <p className="text-sm text-muted-foreground">
            For: {contentTypes.find((t) => t.id === selectedTypeId)?.name}
          </p>
        </div>
        <Button size="sm" onClick={addNewRow} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Row
        </Button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search content fields..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="w-48">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {/* New Row */}
              {newRow && (
                <TableRow className="bg-blue-50">
                  <TableCell>
                    <Input
                      value={newRow.name || ""}
                      onChange={(e) =>
                        updateFieldProperty("new", "name", e.target.value)
                      }
                      placeholder="Enter field name"
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={newRow.type || "text"}
                      onValueChange={(value) =>
                        updateFieldProperty("new", "type", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={newRow.required || false}
                      onCheckedChange={(checked) =>
                        updateFieldProperty("new", "required", checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={saveNewRow}
                        disabled={createFieldMutation.isPending}
                        className="h-8 w-8 p-0"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelNewRow}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Existing Rows */}
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
