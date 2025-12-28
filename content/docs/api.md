---
title: "API Reference"
draft: false
summary: "Complete API reference for the Gopteran ecosystem"
tags: ["api", "reference", "endpoints", "authentication"]
categories: ["Documentation"]
weight: 10
---

## API Overview

The Gopteran API provides a comprehensive REST interface for managing infrastructure, authentication, and resources. All APIs are served through the Carina backent.

## Base URL

```
Production: https://api.gopteran.dev
Development: http://localhost:3001
```

## Authentication

All API requests require authentication using JWT tokens.

### Getting a Token

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "expiresIn": "7d"
}
```

### Using the Token

Include the token in the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Core Endpoints

### Authentication

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

#### POST /auth/refresh
Refresh an existing JWT token.

#### POST /auth/logout
Invalidate the current session.

### Users

#### GET /users/me
Get current user profile.

**Response:**
```json
{
  "id": "user-123",
  "name": "John Doe",
  "email": "user@example.com",
  "role": "admin",
  "createdAt": "2025-01-01T00:00:00Z",
  "lastLogin": "2025-12-28T10:00:00Z"
}
```

#### PUT /users/me
Update current user profile.

#### DELETE /users/me
Delete current user account.

### Projects

#### GET /projects
List all projects for the authenticated user.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term
- `status` (string): Filter by status

**Response:**
```json
{
  "projects": [
    {
      "id": "proj-123",
      "name": "My Project",
      "description": "Project description",
      "status": "active",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-12-28T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

#### POST /projects
Create a new project.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "settings": {
    "environment": "production",
    "region": "us-east-1"
  }
}
```

#### GET /projects/:id
Get project details by ID.

#### PUT /projects/:id
Update project settings.

#### DELETE /projects/:id
Delete a project.

### Resources

#### GET /projects/:projectId/resources
List resources for a project.

#### POST /projects/:projectId/resources
Create a new resource.

**Request Body:**
```json
{
  "type": "server",
  "name": "web-server-01",
  "config": {
    "size": "medium",
    "region": "us-east-1",
    "image": "ubuntu-20.04"
  }
}
```

#### GET /resources/:id
Get resource details.

#### PUT /resources/:id
Update resource configuration.

#### DELETE /resources/:id
Delete a resource.

### Deployments

#### GET /projects/:projectId/deployments
List deployments for a project.

#### POST /projects/:projectId/deployments
Create a new deployment.

**Request Body:**
```json
{
  "name": "v1.2.0",
  "environment": "production",
  "config": {
    "replicas": 3,
    "resources": ["res-123", "res-456"]
  }
}
```

#### GET /deployments/:id
Get deployment details.

#### POST /deployments/:id/rollback
Rollback to a previous deployment.

## WebSocket Events

Real-time updates are available via WebSocket connection.

### Connection

```javascript
const ws = new WebSocket('wss://api.gopteran.dev/ws');
ws.onopen = () => {
  // Send authentication
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'your-jwt-token'
  }));
};
```

### Event Types

#### Resource Status Updates
```json
{
  "type": "resource.status",
  "data": {
    "resourceId": "res-123",
    "status": "running",
    "timestamp": "2025-12-28T10:00:00Z"
  }
}
```

#### Deployment Progress
```json
{
  "type": "deployment.progress",
  "data": {
    "deploymentId": "dep-123",
    "stage": "building",
    "progress": 45,
    "message": "Building container image..."
  }
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### Common Error Codes

- `AUTHENTICATION_REQUIRED` (401): Missing or invalid token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

API requests are rate limited:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated**: 100 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @gopteran/sdk
```

```javascript
import { GopteranClient } from '@gopteran/sdk';

const client = new GopteranClient({
  apiUrl: 'https://api.gopteran.dev',
  token: 'your-jwt-token'
});

// List projects
const projects = await client.projects.list();

// Create a resource
const resource = await client.resources.create(projectId, {
  type: 'server',
  name: 'web-server-01',
  config: { size: 'medium' }
});
```

### Python

```bash
pip install gopteran-sdk
```

```python
from gopteran import GopteranClient

client = GopteranClient(
    api_url='https://api.gopteran.dev',
    token='your-jwt-token'
)

# List projects
projects = client.projects.list()

# Create a resource
resource = client.resources.create(
    project_id=project_id,
    type='server',
    name='web-server-01',
    config={'size': 'medium'}
)
```

### CLI (Remora)

```bash
# Configure authentication
remora auth login

# List projects
remora projects list

# Create a resource
remora resources create --project proj-123 --type server --name web-01
```

## Examples

### Complete Workflow

```javascript
// 1. Authenticate
const auth = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});
const { token } = await auth.json();

// 2. Create a project
const project = await fetch('/projects', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My Web App',
    description: 'Production web application'
  })
});
const { id: projectId } = await project.json();

// 3. Create resources
const server = await fetch(`/projects/${projectId}/resources`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'server',
    name: 'web-server',
    config: {
      size: 'medium',
      region: 'us-east-1'
    }
  })
});

// 4. Deploy
const deployment = await fetch(`/projects/${projectId}/deployments`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'v1.0.0',
    environment: 'production'
  })
});
```

## Support

- **Documentation**: [https://gopteran.dev/docs](https://gopteran.dev/docs)
- **GitHub**: [https://github.com/gopteran](https://github.com/gopteran)
- **Discord**: [https://discord.gg/gopteran](https://discord.gg/gopteran)
- **Email**: [api-support@gopteran.com](mailto:api-support@gopteran.com)
