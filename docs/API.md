# SessionVault API Documentation

## Base URL

```
http://localhost:5000/api/v1
```

## Authentication

All authenticated routes require either:
- `Authorization: Bearer <accessToken>` header, OR
- `accessToken` cookie

Refresh tokens are sent via `refreshToken` HttpOnly cookie automatically.

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|:------|:---------|:------------|:----:|
| POST | `/auth/register` | Register a new account | No |
| POST | `/auth/login` | Login with email & password | No |
| POST | `/auth/refresh-token` | Get new access token via refresh token | No |
| POST | `/auth/logout` | Invalidate refresh token | No |
| GET | `/auth/me` | Get current user profile | Yes |

### Register

```json
POST /auth/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Login

```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

## Workspace Endpoints

| Method | Endpoint | Description | Auth |
|:------|:---------|:------------|:----:|
| POST | `/workspaces` | Create a new workspace | Yes |
| GET | `/workspaces` | List all workspaces (paginated) | Yes |
| GET | `/workspaces/:id` | Get workspace details with tabs | Yes |
| PATCH | `/workspaces/:id` | Update workspace | Yes |
| POST | `/workspaces/:id/favorite` | Toggle favorite | Yes |
| POST | `/workspaces/:id/trash` | Move to trash | Yes |
| POST | `/workspaces/:id/restore` | Restore from trash | Yes |
| DELETE | `/workspaces/:id` | Delete permanently | Yes |
| GET | `/workspaces/:id/export` | Export session as JSON | Yes |
| GET | `/workspaces/analytics` | Get user analytics stats | Yes |

### Create Workspace

```json
POST /workspaces
{
  "title": "React Study Session",
  "description": "Research notes for React 19",
  "color": "#3b82f6",
  "icon": "Folder",
  "tags": ["react", "study"],
  "folderId": null,
  "tabs": [
    { "title": "React Docs", "url": "https://react.dev", "pinned": false }
  ]
}
```

### Query Parameters for GET /workspaces

| Param | Type | Description |
|:------|:-----|:------------|
| `page` | int | Page number (default: 1) |
| `limit` | int | Items per page (default: 12) |
| `search` | string | Search workspaces by title/description |
| `favorite` | bool | Filter by favorite status |
| `pinned` | bool | Filter by pinned status |
| `trash` | bool | Filter by trash status |
| `folderId` | string | Filter by folder |
| `sortBy` | string | Sort field (default: 'createdAt') |
| `sortOrder` | string | asc/desc (default: 'desc') |

## Tab Endpoints

| Method | Endpoint | Description | Auth |
|:------|:---------|:------------|:----:|
| DELETE | `/tabs/:tabId` | Delete a tab | Yes |

## Folder Endpoints

| Method | Endpoint | Description | Auth |
|:------|:---------|:------------|:----:|
| GET | `/folders` | List all folders | Yes |
| POST | `/folders` | Create a folder | Yes |
| PATCH | `/folders/:id` | Update a folder | Yes |
| DELETE | `/folders/:id` | Delete a folder | Yes |

## Search Endpoints

| Method | Endpoint | Description | Auth |
|:------|:---------|:------------|:----:|
| GET | `/search?q=<query>&scope=<all\|workspaces\|tabs\|folders>` | Unified search | Yes |
| GET | `/search/suggestions?q=<query>` | Autocomplete suggestions | Yes |

## Share Endpoints

| Method | Endpoint | Description | Auth |
|:------|:---------|:------------|:----:|
| POST | `/shared/workspace/:workspaceId` | Generate share link | Yes |
| GET | `/shared/:code` | View shared workspace (public) | No |

## Import Endpoints

| Method | Endpoint | Description | Auth |
|:------|:---------|:------------|:----:|
| POST | `/import` | Bulk import sessions from JSON | Yes |

### Import Payload

```json
POST /import
{
  "sessions": [
    {
      "title": "My Session",
      "description": "A session import",
      "color": "#3b82f6",
      "tags": ["imported"],
      "tabs": [
        { "title": "Google", "url": "https://google.com" }
      ]
    }
  ]
}
```

## Health Check

```
GET /api/v1/health
```

## Response Format

All API responses follow this structure:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success message",
  "data": { },
  "meta": { "page": 1, "total": 10, "totalPages": 1 }
}
```

## WebSocket Events

### Client → Server

| Event | Data | Description |
|:------|:-----|:------------|
| `join:user` | `{ userId }` | Join user-specific room |
| `join:workspace` | `{ workspaceId }` | Join workspace-specific room |
| `workspace:sync` | `{ workspaceId, userId, ... }` | Broadcast workspace tab changes |

### Server → Client

| Event | Data | Description |
|:------|:-----|:------------|
| `workspace:updated` | `{ workspaceId, userId, ... }` | Workspace has been updated |