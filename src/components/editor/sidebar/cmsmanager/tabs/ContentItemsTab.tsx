import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
  ContentItem,
  ContentType,
  ContentField,
  ContentFieldValue,
} from "@/interfaces/cms.interface";
import { ContentItemFormSchema } from "@/schema/zod/cms";
import {
  Plus,
  Edit,
  Trash2,
  Database,
  Eye,
  EyeOff,
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

interface ContentItemsTabProps {
  selectedTypeId: string;
  contentTypes: ContentType[];
  contentFields: ContentField[];
  contentItems: ContentItem[];
  isLoading: boolean;
  createItemMutation: any;
  updateItemMutation: any;
  deleteItemMutation: any;
  onCreateItem: (data: any) => void;
  onDeleteItem: (contentTypeId: string, itemId: string) => void;
}

interface EditableItem {
  id?: string;
  title?: string;
  slug?: string;
  published?: boolean;
  contentTypeId?: string;
  isNew?: boolean;
  isEditing?: boolean;
  fieldValues?: { [fieldId: string]: string };
}

export const ContentItemsTab: React.FC<ContentItemsTabProps> = ({
  selectedTypeId,
  contentTypes,
  contentFields,
  contentItems,
  isLoading,
  createItemMutation,
  updateItemMutation,
  deleteItemMutation,
  onCreateItem,
  onDeleteItem,
}) => {
  const [editingRows, setEditingRows] = useState<string[]>([]);
  const [newRow, setNewRow] = useState<EditableItem | null>(null);
  const [editedValues, setEditedValues] = useState<{
    [key: string]: {
      title?: string;
      slug?: string;
      published?: boolean;
      fieldValues?: { [fieldId: string]: string };
    };
  }>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const editingRowsSet = useMemo(() => new Set(editingRows), [editingRows]);

  const columnHelper = createColumnHelper<ContentItem>();

  // Create a map of field values for quick lookup
  const fieldValuesMap = useMemo(() => {
    const map: { [itemId: string]: { [fieldId: string]: string } } = {};
    contentItems.forEach((item) => {
      map[item.id] = {};
      item.fieldValues?.forEach((fv) => {
        map[item.id][fv.fieldId] = fv.value || "";
      });
    });
    return map;
  }, [contentItems]);

  const updateFieldValue = useCallback(
    (itemId: string, fieldId: string, value: string) => {
      if (newRow && newRow.isNew) {
        setNewRow((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            fieldValues: { ...prev.fieldValues, [fieldId]: value },
          };
        });
      } else {
        setEditedValues((prev) => ({
          ...prev,
          [itemId]: {
            ...prev[itemId],
            fieldValues: {
              ...prev[itemId]?.fieldValues,
              [fieldId]: value,
            },
          },
        }));
      }
    },
    [newRow],
  );

  const updateItemField = useCallback(
    (itemId: string, field: string, value: any) => {
      if (newRow && newRow.isNew) {
        setNewRow((prev) => {
          if (!prev) return prev;
          return { ...prev, [field]: value };
        });
      } else {
        setEditedValues((prev) => ({
          ...prev,
          [itemId]: { ...prev[itemId], [field]: value },
        }));
      }
    },
    [newRow],
  );

  const startEditing = useCallback(
    (itemId: string) => {
      const item = contentItems.find((i) => i.id === itemId);
      if (item) {
        setEditedValues((prev) => ({
          ...prev,
          [itemId]: {
            title: item.title,
            slug: item.slug,
            published: item.published,
            fieldValues: { ...fieldValuesMap[itemId] },
          },
        }));
      }
      setEditingRows((prev) => [...prev, itemId]);
    },
    [contentItems, fieldValuesMap],
  );

  const stopEditing = useCallback((itemId: string) => {
    setEditingRows((prev) => prev.filter((id) => id !== itemId));
    setEditedValues((prev) => {
      const newValues = { ...prev };
      delete newValues[itemId];
      return newValues;
    });
  }, []);

  const saveExistingItem = useCallback(
    async (itemId: string) => {
      const editedData = editedValues[itemId];
      if (!editedData) return;

      const itemData = {
        title: editedData.title || "",
        slug: editedData.slug || "",
        published: editedData.published || false,
        fieldValues: Object.entries(editedData.fieldValues || {}).map(
          ([fieldId, value]) => ({
            fieldId,
            value,
          }),
        ),
      };

      try {
        updateItemMutation.mutate({
          contentTypeId: selectedTypeId,
          itemId,
          data: itemData,
        });
        stopEditing(itemId);
      } catch (error) {
        console.error("Failed to update item:", error);
      }
    },
    [editedValues, updateItemMutation, selectedTypeId, stopEditing],
  );

  const columns = useMemo<ColumnDef<ContentItem, any>[]>(() => {
    const baseColumns: ColumnDef<ContentItem, any>[] = [
      columnHelper.accessor("title", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Title
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row, table }) => {
          const item = row.original;
          const meta = table.options.meta as any;
          const isEditing = meta?.editingRowsSet?.has(item.id);

          return isEditing ? (
            <Input
              value={
                meta?.editedValues?.[item.id]?.title ?? row.getValue("title")
              }
              onChange={(e) =>
                meta?.updateItemField(item.id, "title", e.target.value)
              }
              className="h-8"
            />
          ) : (
            <span className="font-medium">{row.getValue("title")}</span>
          );
        },
      }),
      columnHelper.accessor("slug", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Slug
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row, table }) => {
          const item = row.original;
          const meta = table.options.meta as any;
          const isEditing = meta?.editingRowsSet?.has(item.id);

          return isEditing ? (
            <Input
              value={
                meta?.editedValues?.[item.id]?.slug ?? row.getValue("slug")
              }
              onChange={(e) =>
                meta?.updateItemField(item.id, "slug", e.target.value)
              }
              className="h-8"
            />
          ) : (
            <span className="text-muted-foreground">
              {row.getValue("slug")}
            </span>
          );
        },
      }),
      columnHelper.accessor("published", {
        header: "Published",
        cell: ({ row, table }) => {
          const item = row.original;
          const meta = table.options.meta as any;
          const isEditing = meta?.editingRowsSet?.has(item.id);

          return isEditing ? (
            <Switch
              checked={
                meta?.editedValues?.[item.id]?.published ??
                row.getValue("published")
              }
              onCheckedChange={(checked) =>
                meta?.updateItemField(item.id, "published", checked)
              }
            />
          ) : (
            <Badge
              variant={row.getValue("published") ? "default" : "secondary"}
              className="gap-1"
            >
              {row.getValue("published") ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
              {row.getValue("published") ? "Published" : "Draft"}
            </Badge>
          );
        },
      }),
    ];

    const fieldColumns: ColumnDef<ContentItem, any>[] = contentFields.map(
      (field) => ({
        id: `field-${field.id}`,
        header: () => (
          <div>
            {field.name}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </div>
        ),
        cell: ({ row, table }) => {
          const item = row.original;
          const meta = table.options.meta as any;
          const isEditing = meta?.editingRowsSet?.has(item.id);
          const fieldValues = meta?.fieldValuesMap?.[item.id] || {};
          const editedData = meta?.editedValues?.[item.id];

          if (isEditing) {
            if (field.type === "richtext") {
              return (
                <div className="min-w-[300px]">
                  <RichTextEditor
                    value={
                      editedData?.fieldValues?.[field.id] ??
                      fieldValues[field.id] ??
                      ""
                    }
                    onChange={(value) =>
                      meta?.updateFieldValue(item.id, field.id, value)
                    }
                    placeholder={`Enter ${field.name.toLowerCase()}`}
                  />
                </div>
              );
            } else {
              return (
                <Input
                  value={
                    editedData?.fieldValues?.[field.id] ??
                    fieldValues[field.id] ??
                    ""
                  }
                  onChange={(e) =>
                    meta?.updateFieldValue(item.id, field.id, e.target.value)
                  }
                  className="h-8"
                />
              );
            }
          } else {
            if (field.type === "richtext") {
              return (
                <div
                  className="max-w-xs truncate"
                  dangerouslySetInnerHTML={{
                    __html: fieldValues[field.id] || "-",
                  }}
                />
              );
            } else {
              return (
                <span className="max-w-xs truncate block">
                  {fieldValues[field.id] || "-"}
                </span>
              );
            }
          }
        },
      }),
    );

    const actionsColumn: ColumnDef<ContentItem, any> = columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row, table }) => {
        const item = row.original;
        const meta = table.options.meta as any;
        const isEditing = meta?.editingRowsSet?.has(item.id);

        return (
          <div className="flex gap-1">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={() => meta?.saveExistingItem(item.id)}
                  disabled={meta?.updateItemMutation?.isPending}
                  className="h-8 w-8 p-0"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => meta?.stopEditing(item.id)}
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
                  onClick={() => meta?.startEditing(item.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Content Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{item.title}"? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          meta?.onDeleteItem(selectedTypeId, item.id)
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
    });

    return [...baseColumns, ...fieldColumns, actionsColumn];
  }, [contentFields]);

  const table = useReactTable({
    data: contentItems,
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
    meta: {
      editingRowsSet,
      editedValues,
      fieldValuesMap,
      updateItemField,
      updateFieldValue,
      startEditing,
      stopEditing,
      saveExistingItem,
      updateItemMutation,
      onDeleteItem,
    },
  });

  const selectedType = contentTypes.find((t) => t.id === selectedTypeId);

  const addNewRow = () => {
    const newItem: EditableItem = {
      isNew: true,
      isEditing: true,
      title: "",
      slug: "",
      published: false,
      fieldValues: {},
      contentTypeId: selectedTypeId,
    };
    contentFields.forEach((field) => {
      newItem.fieldValues![field.id] = "";
    });
    setNewRow(newItem);
  };

  const cancelNewRow = () => {
    setNewRow(null);
  };

  const saveNewRow = async () => {
    if (!newRow) return;

    // Validate required fields
    const validationResult = ContentItemFormSchema.safeParse({
      title: newRow.title || "",
      slug: newRow.slug || "",
      published: newRow.published || false,
    });

    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error);
      return;
    }

    const itemData = {
      title: newRow.title || "",
      slug: newRow.slug || "",
      published: newRow.published || false,
      fieldValues: Object.entries(newRow.fieldValues || {}).map(
        ([fieldId, value]) => ({
          fieldId,
          value,
        }),
      ),
    };

    try {
      await onCreateItem(itemData);
      setNewRow(null);
    } catch (error) {
      console.error("Failed to create item:", error);
    }
  };

  if (!selectedTypeId) {
    return (
      <div className="text-center py-8">
        <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Select a Content Type</h3>
        <p className="text-muted-foreground">
          Choose a content type from the Content Types tab to manage its content
          items.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Content Items Grid</h3>
          <p className="text-sm text-muted-foreground">
            For: {selectedType?.name}
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
          placeholder="Search content items..."
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
                      value={newRow.title || ""}
                      onChange={(e) =>
                        updateItemField("new", "title", e.target.value)
                      }
                      placeholder="Enter title"
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={newRow.slug || ""}
                      onChange={(e) =>
                        updateItemField("new", "slug", e.target.value)
                      }
                      placeholder="enter-slug"
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={newRow.published || false}
                      onCheckedChange={(checked) =>
                        updateItemField("new", "published", checked)
                      }
                    />
                  </TableCell>
                  {contentFields.map((field) => (
                    <TableCell key={field.id}>
                      {field.type === "richtext" ? (
                        <div className="min-w-[300px]">
                          <RichTextEditor
                            value={newRow.fieldValues?.[field.id] || ""}
                            onChange={(value) =>
                              updateFieldValue("new", field.id, value)
                            }
                            placeholder={`Enter ${field.name.toLowerCase()}`}
                          />
                        </div>
                      ) : (
                        <Input
                          value={newRow.fieldValues?.[field.id] || ""}
                          onChange={(e) =>
                            updateFieldValue("new", field.id, e.target.value)
                          }
                          placeholder={`Enter ${field.name.toLowerCase()}`}
                          className="h-8"
                        />
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={saveNewRow}
                        disabled={createItemMutation.isPending}
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
