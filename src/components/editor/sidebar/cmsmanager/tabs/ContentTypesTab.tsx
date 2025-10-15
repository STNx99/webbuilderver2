import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { ContentType } from "@/interfaces/cms.interface";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Save,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Database,
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

interface ContentTypesTabProps {
  contentTypes: ContentType[];
  isLoading: boolean;
  createTypeMutation: any;
  updateTypeMutation: any;
  deleteTypeMutation: any;
  onSelectType: (typeId: string) => void;
  onCreateType: (data: any) => void;
  onDeleteType: (typeId: string) => void;
}

interface EditableType {
  id?: string;
  name?: string;
  description?: string;
  isNew?: boolean;
  isEditing?: boolean;
}

export const ContentTypesTab: React.FC<ContentTypesTabProps> = ({
  contentTypes,
  isLoading,
  createTypeMutation,
  updateTypeMutation,
  deleteTypeMutation,
  onSelectType,
  onCreateType,
  onDeleteType,
}) => {
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
  const [newRow, setNewRow] = useState<EditableType | null>(null);
  const [editedValues, setEditedValues] = useState<{
    [key: string]: EditableType;
  }>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columnHelper = createColumnHelper<ContentType>();

  const columns = useMemo<ColumnDef<ContentType, any>[]>(
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
          const type = row.original;
          const isEditing = editingRows.has(type.id);

          return isEditing ? (
            <Input
              value={editedValues[type.id]?.name ?? getValue()}
              onChange={(e) => updateTypeField(type.id, "name", e.target.value)}
              className="h-8"
            />
          ) : (
            <span className="font-medium">{getValue()}</span>
          );
        },
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: ({ row, getValue }) => {
          const type = row.original;
          const isEditing = editingRows.has(type.id);

          return isEditing ? (
            <Textarea
              value={editedValues[type.id]?.description ?? (getValue() || "")}
              onChange={(e) =>
                updateTypeField(type.id, "description", e.target.value)
              }
              className="h-8 resize-none"
              rows={1}
            />
          ) : (
            <span className="text-muted-foreground">{getValue() || "-"}</span>
          );
        },
      }),
      columnHelper.accessor((row) => row.fields?.length || 0, {
        id: "fields",
        header: "Fields",
        cell: ({ getValue }) => <span>{getValue()}</span>,
      }),
      columnHelper.accessor((row) => row.items?.length || 0, {
        id: "items",
        header: "Items",
        cell: ({ getValue }) => <span>{getValue()}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const type = row.original;
          const isEditing = editingRows.has(type.id);

          return (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectType(type.id)}
                className="h-8 w-8 p-0"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </Button>
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => saveExistingType(type.id)}
                    disabled={updateTypeMutation.isPending}
                    className="h-8 w-8 p-0"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => stopEditing(type.id)}
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
                    onClick={() => startEditing(type.id)}
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
                        <AlertDialogTitle>Delete Content Type</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{type.name}"? This
                          action cannot be undone and will also delete all
                          associated fields and content items.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteType(type.id)}
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
    [editingRows, editedValues, updateTypeMutation.isPending],
  );

  const table = useReactTable({
    data: contentTypes,
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

  const startEditing = (typeId: string) => {
    const type = contentTypes.find((t) => t.id === typeId);
    if (type) {
      setEditedValues((prev) => ({
        ...prev,
        [typeId]: { name: type.name, description: type.description },
      }));
    }
    setEditingRows((prev) => new Set([...prev, typeId]));
  };

  const stopEditing = (typeId: string) => {
    setEditingRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(typeId);
      return newSet;
    });
    setEditedValues((prev) => {
      const newValues = { ...prev };
      delete newValues[typeId];
      return newValues;
    });
  };

  const addNewRow = () => {
    const newType: EditableType = {
      isNew: true,
      isEditing: true,
      name: "",
      description: "",
    };
    setNewRow(newType);
  };

  const cancelNewRow = () => {
    setNewRow(null);
  };

  const saveNewRow = async () => {
    if (!newRow) return;

    const typeData = {
      name: newRow.name || "",
      description: newRow.description || "",
    };

    try {
      await onCreateType(typeData);
      setNewRow(null);
    } catch (error) {
      console.error("Failed to create type:", error);
    }
  };

  const updateTypeField = (typeId: string, field: string, value: string) => {
    if (newRow && newRow.isNew) {
      setNewRow((prev) => ({ ...prev!, [field]: value }));
    } else {
      setEditedValues((prev) => ({
        ...prev,
        [typeId]: { ...prev[typeId], [field]: value },
      }));
    }
  };

  const saveExistingType = async (typeId: string) => {
    const editedData = editedValues[typeId];
    if (!editedData) return;

    const updateData = {
      name: editedData.name,
      description: editedData.description,
    };

    try {
      updateTypeMutation.mutate({ id: typeId, data: updateData });
      stopEditing(typeId);
    } catch (error) {
      console.error("Failed to update type:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Content Types Grid</h3>
        <Button size="sm" onClick={addNewRow} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Row
        </Button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search content types..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : contentTypes.length === 0 && !newRow ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Database />
            </EmptyMedia>
            <EmptyTitle>No content types yet</EmptyTitle>
            <EmptyDescription>
              Get started by creating your first content type to structure your
              content.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
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
                <TableRow>
                  <TableCell>
                    <Input
                      value={newRow.name || ""}
                      onChange={(e) =>
                        updateTypeField("new", "name", e.target.value)
                      }
                      placeholder="Enter type name"
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={newRow.description || ""}
                      onChange={(e) =>
                        updateTypeField("new", "description", e.target.value)
                      }
                      placeholder="Enter description"
                      className="h-8 resize-none"
                      rows={1}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">0</TableCell>
                  <TableCell className="text-muted-foreground">0</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={saveNewRow}
                        disabled={createTypeMutation.isPending}
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
