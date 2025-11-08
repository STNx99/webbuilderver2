# Role-Based Access Control (RBAC) System

A comprehensive, clean, and maintainable role-based access control system for collaborative project management.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Roles and Permissions](#roles-and-permissions)
- [Usage Guide](#usage-guide)
- [API Routes](#api-routes)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

This RBAC system provides fine-grained access control for collaborative projects. It supports three role levels:

- **Owner**: Full control over the project
- **Editor**: Can modify content but not project settings
- **Viewer**: Read-only access with commenting capabilities

The system is designed to be:
- **Type-safe**: Full TypeScript support
- **Maintainable**: Clear separation of concerns
- **Flexible**: Easy to extend with new permissions
- **Performant**: Minimal database queries with caching support

## Architecture

```
src/lib/rbac/
├── permissions.ts       # Permission definitions and role mappings
├── authorization.ts     # Authorization logic and database queries
├── index.ts            # Public API exports
└── README.md           # This file

src/hooks/
└── useProjectPermissions.ts  # Client-side permission checking

src/app/api/v1/collaborators/
├── project/[projectId]/route.ts        # Get collaborators
├── project/[projectId]/leave/route.ts  # Leave project
├── [id]/route.ts                       # Remove collaborator
└── [id]/role/route.ts                  # Update role
```

## Roles and Permissions

### Owner (Full Access)

Owners have complete control over the project including:

**Project Management**
- ✅ View, edit, delete project
- ✅ Publish/unpublish project
- ✅ Modify project settings
- ✅ Transfer ownership

**Content**
- ✅ Full CRUD on elements, pages, and CMS content

**Team Management**
- ✅ Invite collaborators
- ✅ Change collaborator roles
- ✅ Remove collaborators

**Advanced Features**
- ✅ Create, restore, and delete snapshots
- ✅ Export code and templates
- ✅ Manage all comments (including others')

### Editor (Content Management)

Editors can modify project content but cannot change settings or manage the team:

**Content**
- ✅ View and edit project
- ✅ Full CRUD on elements and pages
- ✅ Edit CMS content

**Collaboration**
- ✅ View team members
- ✅ Create and manage own comments
- ✅ Resolve comments

**Features**
- ✅ Create snapshots (cannot restore/delete)
- ✅ Export code
- ❌ Cannot publish project
- ❌ Cannot modify project settings
- ❌ Cannot manage team

### Viewer (Read-Only + Comments)

Viewers have read-only access with the ability to provide feedback:

**Viewing**
- ✅ View project, elements, and pages
- ✅ View CMS content
- ✅ View team members
- ✅ View snapshots

**Comments**
- ✅ Create comments
- ✅ Edit/delete own comments

**Restrictions**
- ❌ Cannot edit any content
- ❌ Cannot create/modify elements or pages
- ❌ Cannot export or publish
- ❌ Cannot manage team

## Usage Guide

### Server-Side (API Routes & Server Actions)

#### 1. Check Permission

```typescript
import { requirePermission, Permission } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  const projectId = "project-id";

  // Throws 403 error if user lacks permission
  await requirePermission(userId, projectId, Permission.PROJECT_EDIT);

  // User has permission, continue...
}
```

#### 2. Get User Access Information

```typescript
import { getUserProjectAccess } from '@/lib/rbac';

const access = await getUserProjectAccess(userId, projectId);

if (!access) {
  // User has no access
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

console.log(access.role); // "owner" | "editor" | "viewer"
console.log(access.isOwner); // boolean
console.log(access.isCollaborator); // boolean
```

#### 3. Check Multiple Permissions

```typescript
import { authorizeUserAnyPermission, Permission } from '@/lib/rbac';

const result = await authorizeUserAnyPermission(userId, projectId, [
  Permission.PROJECT_EDIT,
  Permission.PROJECT_SETTINGS,
]);

if (!result.authorized) {
  return NextResponse.json({ error: result.reason }, { status: 403 });
}
```

#### 4. Collaborator Management

```typescript
import { canModifyCollaborator, canRemoveCollaborator } from '@/lib/rbac';

// Check if user can modify a specific collaborator
const canModify = await canModifyCollaborator(userId, projectId, targetCollaboratorId);

// Check if user can remove a collaborator
const canRemove = await canRemoveCollaborator(userId, projectId, targetUserId);
```

### Client-Side (React Components)

#### 1. Basic Permission Checking

```tsx
import { useProjectPermissions, Permission } from '@/hooks/useProjectPermissions';

function ProjectEditor({ projectId }) {
  const { 
    canEdit, 
    canDelete, 
    isOwner,
    hasPermission,
    isLoading 
  } = useProjectPermissions(projectId);

  if (isLoading) return <Spinner />;

  return (
    <div>
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
      {hasPermission(Permission.COLLABORATOR_INVITE) && <InviteButton />}
      {isOwner && <SettingsButton />}
    </div>
  );
}
```

#### 2. Role-Based UI

```tsx
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { CollaboratorRole } from '@/interfaces/collaboration.interface';

function ProjectToolbar({ projectId }) {
  const { role, isLoading } = useProjectPermissions(projectId);

  if (isLoading) return null;

  return (
    <div>
      {role === CollaboratorRole.OWNER && <OwnerTools />}
      {role === CollaboratorRole.EDITOR && <EditorTools />}
      {role === CollaboratorRole.VIEWER && <ViewerTools />}
    </div>
  );
}
```

#### 3. Resource Ownership Checking

```tsx
import { useCanEditOwnResource } from '@/hooks/useProjectPermissions';

function CommentCard({ comment, projectId }) {
  const canEdit = useCanEditOwnResource(projectId, comment.authorId);
  const canDelete = useCanDeleteOwnResource(projectId, comment.authorId);

  return (
    <div>
      <p>{comment.content}</p>
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
    </div>
  );
}
```

### Data Access Layer

The project DAL includes RBAC-aware methods:

```typescript
import { projectDAL } from '@/data/project';

// Get project with access control
const project = await projectDAL.getProjectWithAccess(projectId, userId);

// Update project with role-based field restrictions
const updated = await projectDAL.updateProjectWithAccess(projectId, userId, {
  styles: newStyles,      // ✅ Editors can update
  name: "New Name",       // ❌ Only owners can update
});

// Get all projects user has access to (owned + collaborated)
const projects = await projectDAL.getAllUserProjects(userId);
```

## API Routes

### Get Project Collaborators

```
GET /api/v1/collaborators/project/[projectId]
```

**Authorization**: Requires `COLLABORATOR_VIEW` permission

**Response**:
```json
{
  "collaborators": [
    {
      "id": "collab-1",
      "projectId": "project-1",
      "userId": "user-1",
      "role": "owner",
      "isOwner": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "user": {
        "id": "user-1",
        "email": "owner@example.com",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ]
}
```

### Update Collaborator Role

```
PATCH /api/v1/collaborators/[id]/role
```

**Authorization**: Only project owners

**Body**:
```json
{
  "role": "editor"
}
```

**Response**: Updated collaborator object

### Remove Collaborator

```
DELETE /api/v1/collaborators/[id]
```

**Authorization**: Only project owners

**Response**:
```json
{
  "success": true,
  "message": "Collaborator removed successfully"
}
```

### Leave Project

```
DELETE /api/v1/collaborators/project/[projectId]/leave
```

**Authorization**: Any collaborator (except owner)

**Response**:
```json
{
  "success": true,
  "message": "Successfully left the project"
}
```

## Best Practices

### 1. Always Check Permissions Server-Side

Never rely solely on client-side permission checks for security:

```typescript
// ✅ GOOD: Server-side enforcement
export async function updateProject(projectId: string, data: any) {
  const { userId } = await auth();
  await requirePermission(userId, projectId, Permission.PROJECT_EDIT);
  // Safe to proceed
}

// ❌ BAD: Client-side only
function EditButton() {
  const { canEdit } = useProjectPermissions(projectId);
  // This only hides the UI, doesn't prevent API access
  if (!canEdit) return null;
  return <button onClick={updateProject}>Edit</button>;
}
```

### 2. Use Specific Permissions

Instead of checking roles, check for specific permissions:

```typescript
// ✅ GOOD: Permission-based
if (hasPermission(role, Permission.PROJECT_PUBLISH)) {
  await publishProject();
}

// ❌ BAD: Role-based
if (role === CollaboratorRole.OWNER) {
  await publishProject();
}
```

### 3. Handle Permission Errors Gracefully

```typescript
try {
  await requirePermission(userId, projectId, Permission.PROJECT_DELETE);
  await deleteProject(projectId);
} catch (error: any) {
  if (error.status === 403) {
    return NextResponse.json(
      { error: "You don't have permission to delete this project" },
      { status: 403 }
    );
  }
  throw error;
}
```

### 4. Cache Access Information

```typescript
// In a request handler, get access once and reuse
const access = await getUserProjectAccess(userId, projectId);

if (!access) {
  return unauthorized();
}

// Use access.role multiple times without additional queries
const canEdit = hasPermission(access.role, Permission.PROJECT_EDIT);
const canDelete = hasPermission(access.role, Permission.PROJECT_DELETE);
```

### 5. Validate Role Changes

```typescript
import { canChangeRole, getAssignableRoles } from '@/lib/rbac';

// Check if role change is valid
const assignableRoles = getAssignableRoles(currentUserRole);
if (!assignableRoles.includes(newRole)) {
  throw new Error("Cannot assign this role");
}

// Verify the change is allowed
if (!canChangeRole(currentUserRole, targetCurrentRole, newRole)) {
  throw new Error("Role change not allowed");
}
```

## Examples

### Example 1: Protected API Route

```typescript
// src/app/api/v1/projects/[id]/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { requirePermission, Permission } from '@/lib/rbac';
import { projectDAL } from '@/data/project';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = params;

    // Check permission
    await requirePermission(userId, projectId, Permission.PROJECT_PUBLISH);

    // User has permission, publish the project
    const project = await projectDAL.updateProjectWithAccess(
      projectId,
      userId,
      { published: true }
    );

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    if (error.status === 403) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Example 2: Conditional UI Rendering

```tsx
// src/components/project/ProjectHeader.tsx
import { useProjectPermissions, Permission } from '@/hooks/useProjectPermissions';
import { Button } from '@/components/ui/button';

interface ProjectHeaderProps {
  projectId: string;
  projectName: string;
}

export function ProjectHeader({ projectId, projectName }: ProjectHeaderProps) {
  const {
    canEdit,
    canDelete,
    canPublish,
    canManageCollaborators,
    hasPermission,
    isLoading,
    role,
  } = useProjectPermissions(projectId);

  if (isLoading) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="flex items-center justify-between">
      <h1>{projectName}</h1>
      
      <div className="flex gap-2">
        {/* All users with view access see this */}
        <Button variant="outline">Preview</Button>

        {/* Only users who can edit */}
        {canEdit && (
          <Button>Edit Content</Button>
        )}

        {/* Only users who can publish */}
        {canPublish && (
          <Button variant="default">Publish</Button>
        )}

        {/* Only users who can manage collaborators */}
        {canManageCollaborators && (
          <Button variant="secondary">Manage Team</Button>
        )}

        {/* Only users who can delete */}
        {canDelete && (
          <Button variant="destructive">Delete Project</Button>
        )}

        {/* Check specific permission */}
        {hasPermission(Permission.PROJECT_SETTINGS) && (
          <Button variant="ghost">Settings</Button>
        )}
      </div>

      {/* Display user's role */}
      <Badge>{role}</Badge>
    </header>
  );
}
```

### Example 3: Realtime Collaboration with Permissions

```tsx
// src/app/(routes)/(protected)/editor/[id]/editor.tsx
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { useEditor } from '@/hooks';

export default function Editor({ id, pageId }: EditorProps) {
  const { canEdit, canView, isLoading } = useProjectPermissions(id);
  
  const editor = useEditor({
    projectId: id,
    pageId,
    enableCollab: true,
    readOnly: !canEdit, // Viewers get read-only mode
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!canView) {
    return <AccessDenied />;
  }

  return (
    <div>
      {!canEdit && (
        <Banner variant="info">
          You have view-only access to this project
        </Banner>
      )}
      
      <EditorCanvas 
        readOnly={!canEdit}
        {...editor} 
      />
    </div>
  );
}
```

### Example 4: Server Action with RBAC

```typescript
// src/app/actions/projectAction.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { projectDAL } from "@/data/project";
import { requirePermission, Permission } from "@/lib/rbac";

export async function updateProjectSettings(
  projectId: string,
  settings: { name: string; description: string }
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Only owners can update project settings
  await requirePermission(userId, projectId, Permission.PROJECT_SETTINGS);

  const updated = await projectDAL.updateProjectWithAccess(
    projectId,
    userId,
    settings
  );

  if (!updated) {
    throw new Error("Failed to update project");
  }

  revalidatePath(`/projects/${projectId}`);
  return updated;
}
```

## Extending the System

### Adding New Permissions

1. Add the permission to `Permission` enum in `permissions.ts`:

```typescript
export enum Permission {
  // ... existing permissions
  ANALYTICS_VIEW = "analytics:view",
}
```

2. Assign to appropriate roles in `ROLE_PERMISSIONS`:

```typescript
export const ROLE_PERMISSIONS: Record<CollaboratorRole, Permission[]> = {
  [CollaboratorRole.OWNER]: [
    // ... existing permissions
    Permission.ANALYTICS_VIEW,
  ],
  [CollaboratorRole.EDITOR]: [
    // ... existing permissions
    Permission.ANALYTICS_VIEW,
  ],
  // Viewers don't get this permission
};
```

3. Update client-side hook if needed:

```typescript
// src/hooks/useProjectPermissions.ts
export enum Permission {
  // ... existing permissions
  ANALYTICS_VIEW = "analytics:view",
}

const ROLE_PERMISSIONS: Record<CollaboratorRole, Permission[]> = {
  // ... mirror server-side changes
};
```

### Adding New Roles

To add a new role (e.g., "Moderator"):

1. Update the enum in `src/interfaces/collaboration.interface.ts`
2. Update Prisma schema and run migration
3. Add role to `ROLE_PERMISSIONS` in both server and client
4. Update role descriptions
5. Test all permission checks

## Troubleshooting

### User Can't Access Project

1. Verify user is authenticated: `const { userId } = await auth();`
2. Check if user is owner or collaborator in database
3. Verify project is not soft-deleted (`DeletedAt IS NULL`)
4. Check for correct permission in your code

### Permission Denied Errors

1. Check the user's actual role: `await getUserProjectAccess(userId, projectId)`
2. Verify the permission is assigned to that role in `ROLE_PERMISSIONS`
3. Ensure you're checking the correct permission
4. Check server logs for detailed error messages

### Role Updates Not Reflecting

1. Ensure you're invalidating React Query cache after updates
2. Check that the API route is actually updating the database
3. Verify the collaborator ID is correct
4. Check for transaction/rollback issues

## Security Considerations

1. **Always validate on the server**: Client-side checks are for UX only
2. **Use prepared statements**: Prisma handles this automatically
3. **Validate input data**: Never trust client input
4. **Log permission denials**: Monitor for potential security issues
5. **Rate limit sensitive endpoints**: Especially role changes and invitations
6. **Audit trail**: Consider logging all permission changes

## Performance Tips

1. **Batch permission checks**: Get access once, check multiple permissions
2. **Cache collaborator lists**: Use React Query for client-side caching
3. **Optimize database queries**: Use select to fetch only needed fields
4. **Index properly**: Ensure Prisma indices on UserId, ProjectId
5. **Consider Redis**: For high-traffic apps, cache user roles

## License

This RBAC system is part of the Web Builder v2 project.