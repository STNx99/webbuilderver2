# Collaboration API Documentation

## Overview

The Collaboration API enables project owners to invite team members to collaborate on their projects. The system supports role-based access control with three permission levels: Owner, Editor, and Viewer.

### Key Features

- **Invitation System**: Send email invitations with secure tokens
- **Role Management**: Assign different permission levels (Owner, Editor, Viewer)
- **Collaborator Management**: Add, update, and remove team members
- **Email Notifications**: Automated email sending via SendGrid or SMTP
- **Token-based Acceptance**: Secure invitation acceptance flow

### Architecture

The collaboration system consists of:

- **Backend (Go)**: REST API endpoints for invitations and collaborators
- **Frontend (Next.js/React)**: TypeScript hooks and components
- **Database**: Prisma models for invitations and collaborators
- **Email Service**: SendGrid primary + SMTP fallback

## API Endpoints

### Invitations

#### Create Invitation
```http
POST /api/v1/invitations
```

**Request Body:**
```json
{
  "projectId": "string",
  "email": "string",
  "role": "owner" | "editor" | "viewer"
}
```

**Response:**
```json
{
  "id": "string",
  "projectId": "string",
  "email": "string",
  "role": "owner" | "editor" | "viewer",
  "token": "string",
  "expiresAt": "2024-01-01T00:00:00Z",
  "acceptedAt": null,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Get Project Invitations
```http
GET /api/v1/invitations/project/{projectId}
```

**Response:**
```json
{
  "invitations": [
    {
      "id": "string",
      "projectId": "string",
      "email": "string",
      "role": "owner" | "editor" | "viewer",
      "token": "string",
      "expiresAt": "2024-01-01T00:00:00Z",
      "acceptedAt": null,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Accept Invitation
```http
POST /api/v1/invitations/accept
```

**Request Body:**
```json
{
  "token": "string"
}
```

**Response:** `204 No Content`

#### Delete Invitation
```http
DELETE /api/v1/invitations/{invitationId}
```

**Response:** `204 No Content`

### Collaborators

#### Get Project Collaborators
```http
GET /api/v1/collaborators/project/{projectId}
```

**Response:**
```json
{
  "collaborators": [
    {
      "id": "string",
      "projectId": "string",
      "userId": "string",
      "role": "owner" | "editor" | "viewer",
      "invitedBy": "string",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "user": {
        "id": "string",
        "email": "string",
        "name": "string"
      }
    }
  ]
}
```

#### Update Collaborator Role
```http
PUT /api/v1/collaborators/{collaboratorId}/role
```

**Request Body:**
```json
{
  "role": "owner" | "editor" | "viewer"
}
```

**Response:**
```json
{
  "id": "string",
  "projectId": "string",
  "userId": "string",
  "role": "owner" | "editor" | "viewer",
  "invitedBy": "string",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### Remove Collaborator
```http
DELETE /api/v1/collaborators/{collaboratorId}
```

**Response:** `204 No Content`

#### Leave Project
```http
DELETE /api/v1/collaborators/project/{projectId}/leave
```

**Response:** `204 No Content`

## TypeScript Interfaces

### Core Types

```typescript
export enum CollaboratorRole {
  OWNER = "owner",
  EDITOR = "editor",
  VIEWER = "viewer",
}

export interface Invitation {
  id: string;
  projectId: string;
  email: string;
  role: CollaboratorRole;
  token: string;
  expiresAt: string;
  acceptedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Collaborator {
  id: string;
  projectId: string;
  userId: string;
  role: CollaboratorRole;
  invitedBy: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name?: string | null;
  };
}
```

### Request/Response Types

```typescript
export interface CreateInvitationRequest {
  projectId: string;
  email: string;
  role: CollaboratorRole;
}

export interface AcceptInvitationRequest {
  token: string;
}

export interface UpdateCollaboratorRoleRequest {
  role: CollaboratorRole;
}

export interface InvitationListResponse {
  invitations: Invitation[];
}

export interface CollaboratorListResponse {
  collaborators: Collaborator[];
}
```

## React Hooks

### Invitation Hooks

```typescript
import { useInvitationManager, useCreateInvitation } from "@/hooks";

// Complete invitation management
const invitations = useInvitationManager(projectId);

// Individual operations
const createInvitation = useCreateInvitation();
const acceptInvitation = useAcceptInvitation();
const deleteInvitation = useDeleteInvitation(projectId);
```

### Collaborator Hooks

```typescript
import { useCollaboratorManager, useUpdateCollaboratorRole } from "@/hooks";

// Complete collaborator management
const collaborators = useCollaboratorManager(projectId);

// Individual operations
const updateRole = useUpdateCollaboratorRole(projectId);
const removeCollaborator = useRemoveCollaborator(projectId);
const leaveProject = useLeaveProject();
```

### Usage Examples

#### Creating an Invitation

```typescript
import { useCreateInvitation } from "@/hooks";

function InviteUser({ projectId }: { projectId: string }) {
  const createInvitation = useCreateInvitation();

  const handleInvite = async (email: string, role: CollaboratorRole) => {
    try {
      await createInvitation.mutateAsync({
        projectId,
        email,
        role,
      });
      // Success: invitation sent
    } catch (error) {
      // Handle error
    }
  };

  return (
    <button
      onClick={() => handleInvite("user@example.com", CollaboratorRole.EDITOR)}
      disabled={createInvitation.isPending}
    >
      {createInvitation.isPending ? "Sending..." : "Send Invitation"}
    </button>
  );
}
```

#### Managing Collaborators

```typescript
import { useCollaboratorManager } from "@/hooks";

function CollaboratorList({ projectId }: { projectId: string }) {
  const collaborators = useCollaboratorManager(projectId);

  const handleUpdateRole = async (collaboratorId: string, role: CollaboratorRole) => {
    await collaborators.updateCollaboratorRoleAsync(collaboratorId, { role });
  };

  const handleRemove = async (collaboratorId: string) => {
    await collaborators.removeCollaboratorAsync(collaboratorId);
  };

  if (collaborators.isLoading) return <div>Loading...</div>;

  return (
    <div>
      {collaborators.collaborators.map((collaborator) => (
        <div key={collaborator.id}>
          <span>{collaborator.user?.email}</span>
          <select
            value={collaborator.role}
            onChange={(e) => handleUpdateRole(collaborator.id, e.target.value as CollaboratorRole)}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="owner">Owner</option>
          </select>
          <button onClick={() => handleRemove(collaborator.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Components

### CollaborationManager

A comprehensive component for managing project collaboration:

```typescript
import { CollaborationManager } from "@/components/collaboration";

function ProjectSettings({ projectId, currentUserId, isOwner }: {
  projectId: string;
  currentUserId: string;
  isOwner: boolean;
}) {
  return (
    <CollaborationManager
      projectId={projectId}
      currentUserId={currentUserId}
      isOwner={isOwner}
    />
  );
}
```

### InvitationCard

A simple component for sending invitations:

```typescript
import { InvitationCard } from "@/components/collaboration";

function Dashboard({ projectId, projectName }: {
  projectId: string;
  projectName?: string;
}) {
  return (
    <InvitationCard
      projectId={projectId}
      projectName={projectName}
    />
  );
}
```

## Email Configuration

The system supports two email providers:

### SendGrid (Recommended)

Set these environment variables:
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
SMTP_FROM=noreply@yourdomain.com
BASE_URL=https://your-app.com
```

### SMTP Fallback

Set these environment variables:
```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@yourdomain.com
BASE_URL=https://your-app.com
```

### Email Templates

The system sends invitation emails with:
- Project name and inviter information
- Role being granted
- Acceptance link: `{BASE_URL}/accept-invitation?token={token}`
- Expiration notice (7 days default)

## Security Considerations

### Token Security
- Tokens are generated using `cuid` for uniqueness
- Tokens expire after 7 days
- Tokens are single-use (consumed upon acceptance)

### Permission Checks
- Only project owners can send invitations
- Only project owners can modify collaborator roles
- Users can remove themselves from projects
- All endpoints validate user authentication

### Rate Limiting
Consider implementing rate limiting for:
- Invitation creation endpoints
- Invitation acceptance endpoints

## Error Handling

### Common Error Responses

#### Invalid Token
```json
{
  "error": "Invalid or expired invitation token"
}
```

#### Already Accepted
```json
{
  "error": "Invitation has already been accepted"
}
```

#### Permission Denied
```json
{
  "error": "Insufficient permissions"
}
```

#### User Already Collaborator
```json
{
  "error": "User is already a collaborator on this project"
}
```

## Database Schema

### Invitations Table
```sql
CREATE TABLE invitations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### Collaborators Table
```sql
CREATE TABLE collaborators (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  invited_by TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(project_id, user_id)
);
```

## Testing

### Unit Tests

```typescript
// Example test for invitation service
describe("InvitationService", () => {
  it("should create invitation successfully", async () => {
    const invitation = await invitationService.createInvitation({
      projectId: "project-1",
      email: "test@example.com",
      role: CollaboratorRole.EDITOR,
    });

    expect(invitation.email).toBe("test@example.com");
    expect(invitation.role).toBe(CollaboratorRole.EDITOR);
  });
});
```

### Integration Tests

```typescript
// Example integration test
describe("Invitation Flow", () => {
  it("should complete full invitation acceptance flow", async () => {
    // Create invitation
    const invitation = await createInvitation({
      projectId: "project-1",
      email: "test@example.com",
      role: CollaboratorRole.EDITOR,
    });

    // Accept invitation
    await acceptInvitation({ token: invitation.token });

    // Verify collaborator was created
    const collaborators = await getProjectCollaborators("project-1");
    expect(collaborators).toHaveLength(1);
  });
});
```

## Deployment Checklist

- [ ] Set email environment variables (SendGrid or SMTP)
- [ ] Configure SPF/DKIM for sending domain
- [ ] Set BASE_URL environment variable
- [ ] Test invitation email delivery
- [ ] Test invitation acceptance flow
- [ ] Verify permission checks
- [ ] Set up monitoring for email failures
- [ ] Configure rate limiting if needed

## Future Enhancements

### Planned Features
- Bulk invitation sending
- Invitation resend functionality
- Custom email templates
- Invitation expiration configuration
- Advanced permission management
- Audit logging for collaborator changes

### API Improvements
- WebSocket notifications for real-time updates
- Pagination for large collaborator lists
- Search and filtering capabilities
- Invitation statistics and analytics