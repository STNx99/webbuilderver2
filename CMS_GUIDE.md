webbuilderv2/CMS_GUIDE.md
# CMS Integration Guide

This guide explains how to use the Content Management System (CMS) in your web builder project to create, manage, and display dynamic content on your canvas.

## Table of Contents

1. [CMS Overview](#cms-overview)
2. [Managing Content](#managing-content)
3. [Using CMS in Canvas Elements](#using-cms-in-canvas-elements)
4. [Code Examples](#code-examples)
5. [API Reference](#api-reference)
6. [Best Practices](#best-practices)

## CMS Overview

The CMS consists of three main components:

### Content Types
- Define the structure of your content (like database tables)
- Examples: "Blog Posts", "Team Members", "Products", "Events"

### Content Fields
- Define what data can be stored in each content type (like table columns)
- Field types: text, textarea, number, boolean, date, email, url, select, multiselect

### Content Items
- Actual content entries (like table rows)
- Each item has a title, slug, and values for all defined fields

## Managing Content

### Accessing the CMS Manager

1. Open your project in the editor
2. Click the **"Manage CMS"** button in the sidebar
3. The CMS Manager dialog will open with three tabs

### Creating Content Types

1. Go to the **"Content Types"** tab
2. Click **"Add Row"** to create a new content type
3. Fill in:
   - **Name**: Display name (e.g., "Blog Posts")
   - **Description**: Optional description
4. Click the **Save** button (✓)

### Adding Fields to Content Types

1. Select a content type from the dropdown or by clicking "View Details"
2. Go to the **"Fields"** tab
3. Click **"Add Row"** to create a new field
4. Fill in:
   - **Name**: Field name (e.g., "Content", "Author", "Publish Date")
   - **Type**: Data type (text, textarea, number, etc.)
   - **Required**: Whether the field must be filled
5. Click the **Save** button (✓)

### Creating Content Items

1. Select a content type
2. Go to the **"Content Items"** tab
3. Click **"Add Row"** to create a new item
4. Fill in:
   - **Title**: Display title
   - **Slug**: URL-friendly identifier
   - **Published**: Toggle to make content public
   - **Field Values**: Fill in values for each defined field
5. Click the **Save** button (✓)

### Editing Content

- Click the **Edit** button (pencil icon) on any row
- Modify values inline
- Click **Save** (✓) to confirm or **Cancel** (✗) to discard

## Using CMS in Canvas Elements

### Method 1: CMS Content Element

Add a pre-built CMS Content Element to your canvas:

1. In the editor, add a new element
2. Look for "CMS Content" in the element picker
3. Configure the element settings:
   - **Content Type**: Select which content type to display
   - **Display Mode**: List, Grid, or Single Item
   - **Fields to Show**: Select which fields to display
   - **Sorting**: Configure sort order
   - **Limit**: Maximum items to show

### Method 2: Custom Components

Use the `useCMSContent` hook in your custom components:

```tsx
import { useCMSContent, getFieldValue } from "@/hooks/useCMSContent";

function MyBlogComponent() {
  const { contentItems, isLoading } = useCMSContent({
    contentTypeId: "blog-posts",
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {contentItems.map(item => (
        <article key={item.id}>
          <h2>{item.title}</h2>
          <p>{getFieldValue(item, "excerpt")}</p>
          <div dangerouslySetInnerHTML={{ 
            __html: getFieldValue(item, "content") 
          }} />
        </article>
      ))}
    </div>
  );
}
```

## Code Examples

### Basic Content Fetching

```tsx
import { useCMSContent } from "@/hooks/useCMSContent";

function BlogList() {
  const { contentItems, contentTypes, isLoading, error } = useCMSContent({
    contentTypeId: "blog-posts",
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      {contentItems.map(item => (
        <BlogPost key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### Single Content Item

```tsx
import { useCMSContentItem } from "@/hooks/useCMSContent";

function BlogPost({ slug }: { slug: string }) {
  const { contentItem, isLoading } = useCMSContentItem("blog-posts", slug);

  if (isLoading) return <div>Loading...</div>;
  if (!contentItem) return <div>Post not found</div>;

  return (
    <article>
      <h1>{contentItem.title}</h1>
      <p>By {getFieldValue(contentItem, "author")}</p>
      <div dangerouslySetInnerHTML={{ 
        __html: getFieldValue(contentItem, "content") 
      }} />
    </article>
  );
}
```

### Advanced Field Handling

```tsx
import { getFieldValues } from "@/hooks/useCMSContent";

function ProductCard({ item }: { item: ContentItem }) {
  const fields = getFieldValues(item);
  
  return (
    <div className="product-card">
      <img src={fields.image} alt={fields.name} />
      <h3>{fields.name}</h3>
      <p className="price">${fields.price}</p>
      <p className="description">{fields.description}</p>
      {fields.inStock === "true" && <span>In Stock</span>}
    </div>
  );
}
```

### Dynamic Content Types

```tsx
function DynamicContent({ contentTypeId }: { contentTypeId: string }) {
  const { contentItems, contentTypes } = useCMSContent({
    contentTypeId,
    enabled: !!contentTypeId
  });

  const contentType = contentTypes.find(ct => ct.id === contentTypeId);
  const fields = contentType?.fields || [];

  return (
    <div>
      <h2>{contentType?.name}</h2>
      {contentItems.map(item => (
        <div key={item.id} className="content-item">
          <h3>{item.title}</h3>
          {fields.map(field => (
            <div key={field.id}>
              <strong>{field.name}:</strong> {getFieldValue(item, field.name)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## API Reference

### useCMSContent Hook

```tsx
interface UseCMSContentOptions {
  contentTypeId?: string;     // Filter by content type
  limit?: number;             // Maximum items to fetch
  sortBy?: "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  enabled?: boolean;          // Enable/disable query
}

const {
  contentItems,    // ContentItem[]
  contentTypes,    // ContentType[]
  isLoading,       // boolean
  error,           // any
  refetch          // () => void
} = useCMSContent(options);
```

### useCMSContentItem Hook

```tsx
const {
  contentItem,    // ContentItem | undefined
  isLoading,      // boolean
  error           // any
} = useCMSContentItem(contentTypeId, slug);
```

### Helper Functions

```tsx
// Get single field value
const value = getFieldValue(contentItem, "fieldName");

// Get all field values as object
const values = getFieldValues(contentItem);
// Returns: { fieldName: "value", anotherField: "anotherValue" }
```

## CMS Service Methods

```tsx
import { cmsService } from "@/services/cms";

// Get all content types
const types = await cmsService.getContentTypes();

// Get public content (published items only)
const items = await cmsService.getPublicContent({
  contentTypeId: "blog-posts",
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc"
});

// Get content type with fields
const type = await cmsService.getContentTypeById("type-id");

// Get content items for a type (includes drafts)
const items = await cmsService.getContentItemsByContentType("type-id");
```

## Best Practices

### Content Structure

1. **Plan Your Content Types**: Think about what content you need before creating types
2. **Use Descriptive Names**: Clear field names make content management easier
3. **Required Fields**: Mark essential fields as required
4. **Field Types**: Choose appropriate field types (textarea for long content, select for options)

### Performance

1. **Use Limits**: Always set reasonable limits for content fetching
2. **Enable Queries Conditionally**: Use the `enabled` option to prevent unnecessary requests
3. **Cache Strategically**: The CMS uses React Query for caching

### User Experience

1. **Meaningful Slugs**: Use descriptive, URL-friendly slugs
2. **Publish Workflow**: Use the published flag to control content visibility
3. **Field Validation**: Required fields help maintain data quality
4. **Sorting**: Configure appropriate default sorting for your content

### Canvas Integration

1. **Responsive Design**: Ensure CMS content displays well on all devices
2. **Loading States**: Always handle loading and error states
3. **Empty States**: Provide helpful messages when no content exists
4. **Rich Content**: Use `dangerouslySetInnerHTML` for HTML content fields

## Troubleshooting

### Content Not Showing

1. Check if items are **published**
2. Verify the **content type ID** is correct
3. Ensure the **slug** matches (for single items)
4. Check browser console for errors

### Fields Not Displaying

1. Confirm fields are defined in the content type
2. Check field names match exactly
3. Verify field values are saved

### Performance Issues

1. Use appropriate **limits** on content fetching
2. Enable queries only when needed
3. Consider pagination for large datasets

## Next Steps

1. Create your content types and fields
2. Add sample content items
3. Test the CMS Content Element on your canvas
4. Build custom components for specific content types
5. Implement user authentication for content management
6. Add content versioning and drafts

The CMS provides a powerful way to manage dynamic content in your web builder projects. Start with simple content types and gradually add complexity as needed.