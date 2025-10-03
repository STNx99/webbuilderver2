import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
} from "lucide-react";

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
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
  const [newRow, setNewRow] = useState<EditableItem | null>(null);
  const [editedValues, setEditedValues] = useState<{
    [key: string]: {
      title?: string;
      slug?: string;
      published?: boolean;
      fieldValues?: { [fieldId: string]: string };
    };
  }>({});

  const selectedType = contentTypes.find((t) => t.id === selectedTypeId);

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

  const startEditing = (itemId: string) => {
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
    setEditingRows((prev) => new Set([...prev, itemId]));
  };

  const stopEditing = (itemId: string) => {
    setEditingRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    setEditedValues((prev) => {
      const newValues = { ...prev };
      delete newValues[itemId];
      return newValues;
    });
  };

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

  const updateFieldValue = (itemId: string, fieldId: string, value: string) => {
    if (newRow && newRow.isNew) {
      setNewRow((prev) => ({
        ...prev!,
        fieldValues: { ...prev!.fieldValues, [fieldId]: value },
      }));
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
  };

  const updateItemField = (itemId: string, field: string, value: any) => {
    if (newRow && newRow.isNew) {
      setNewRow((prev) => ({ ...prev!, [field]: value }));
    } else {
      setEditedValues((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], [field]: value },
      }));
    }
  };

  const saveExistingItem = async (itemId: string) => {
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

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Title</TableHead>
                <TableHead className="w-48">Slug</TableHead>
                <TableHead className="w-24">Published</TableHead>
                {contentFields.map((field) => (
                  <TableHead key={field.id} className="min-w-32">
                    {field.name}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </TableHead>
                ))}
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
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
                      <Input
                        value={newRow.fieldValues?.[field.id] || ""}
                        onChange={(e) =>
                          updateFieldValue("new", field.id, e.target.value)
                        }
                        placeholder={`Enter ${field.name.toLowerCase()}`}
                        className="h-8"
                      />
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
              {contentItems.map((item) => {
                const isEditing = editingRows.has(item.id);
                const fieldValues = fieldValuesMap[item.id] || {};
                const editedData = editedValues[item.id];

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {isEditing ? (
                        <Input
                          value={editedData?.title ?? item.title}
                          onChange={(e) =>
                            updateItemField(item.id, "title", e.target.value)
                          }
                          className="h-8"
                        />
                      ) : (
                        item.title
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {isEditing ? (
                        <Input
                          value={editedData?.slug ?? item.slug}
                          onChange={(e) =>
                            updateItemField(item.id, "slug", e.target.value)
                          }
                          className="h-8"
                        />
                      ) : (
                        item.slug
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Switch
                          checked={editedData?.published ?? item.published}
                          onCheckedChange={(checked) =>
                            updateItemField(item.id, "published", checked)
                          }
                        />
                      ) : (
                        <Badge
                          variant={item.published ? "default" : "secondary"}
                          className="gap-1"
                        >
                          {item.published ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                          {item.published ? "Published" : "Draft"}
                        </Badge>
                      )}
                    </TableCell>
                    {contentFields.map((field) => (
                      <TableCell key={field.id}>
                        {isEditing ? (
                          <Input
                            value={
                              editedData?.fieldValues?.[field.id] ??
                              fieldValues[field.id] ??
                              ""
                            }
                            onChange={(e) =>
                              updateFieldValue(
                                item.id,
                                field.id,
                                e.target.value,
                              )
                            }
                            className="h-8"
                          />
                        ) : (
                          fieldValues[field.id] || "-"
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex gap-1">
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveExistingItem(item.id)}
                              disabled={updateItemMutation.isPending}
                              className="h-8 w-8 p-0"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => stopEditing(item.id)}
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
                              onClick={() => startEditing(item.id)}
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
                                  <AlertDialogTitle>
                                    Delete Content Item
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "
                                    {item.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      onDeleteItem(selectedTypeId, item.id)
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
