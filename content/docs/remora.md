---
title: "Remora"
draft: false
summary: "Remora is the powerful CLI agent and daemon for the Gopteran project"
tags: ["cli", "agent", "daemon", "orchestration", "automation"]
categories: ["Components"]
github_repo: "https://github.com/gopteran/remora"
---

## Overview

Remora is the CLI agent for the Gopteran project — the lightweight, server-side companion designed to handle core operations, orchestration, and communication with the control panel.

It acts as the operational "claw" deep inside the infrastructure, ensuring that commands issued from the frontend or API backend are reliably executed on the server where the services live.

## Why the name "Remora"?

The name "Remora" was chosen deliberately to capture the essence of this tool's role and architecture:

- **Biological inspiration:**
  The remora is a fish known for attaching itself to larger marine animals like sharks or turtles in a symbiotic relationship. It hitches a ride, benefits from the host's movement, and sometimes provides cleaning services — all without burdening the host.

- **Architectural analogy:**
  Similarly, the Remora CLI agent is designed to "attach" to the host server, running close to the core services without interfering with their stability. It's a helper process that stays out of the way but is indispensable for smooth operation.

- **Minimal footprint and dependency:**
  Just like the remora fish does not overly tax its host, the Remora agent is lightweight, efficient, and purpose-built to maintain system integrity and security without overcomplication.

## Key Features

### Command Line Interface
- **Interactive Commands**: Rich CLI with autocomplete and help system
- **Batch Operations**: Execute multiple commands in sequence
- **Configuration Management**: Manage settings via CLI or config files
- **Plugin System**: Extend functionality with custom plugins

### Daemon Mode
- **Background Service**: Run as a system service for continuous operation
- **Auto-restart**: Automatic recovery from failures
- **Health Monitoring**: Built-in health checks and status reporting
- **Log Management**: Structured logging with rotation and retention

### Security & Authentication
- **Token-based Auth**: Secure authentication with JWT tokens
- **Role-based Access**: Fine-grained permissions and access control
- **Encrypted Communication**: TLS encryption for all network traffic
- **Audit Logging**: Complete audit trail of all operations

### Integration Capabilities
- **API Integration**: Direct integration with Carina backend
- **WebSocket Support**: Real-time communication and updates
- **Docker Integration**: Native Docker container management
- **Cloud Provider APIs**: Support for AWS, GCP, Azure, and more

## Installation

### Package Managers

```bash
# npm (recommended)
npm install -g @gopteran/remora

# yarn
yarn global add @gopteran/remora

# pnpm
pnpm add -g @gopteran/remora
```

### Direct Download

```bash
# Linux/macOS
curl -fsSL https://get.gopteran.dev/remora | sh

# Windows (PowerShell)
iwr -useb https://get.gopteran.dev/remora.ps1 | iex
```

### Docker

```bash
# Run as container
docker run -it gopteran/remora:latest

# Docker Compose
version: '3.8'
services:
  remora:
    image: gopteran/remora:latest
    volumes:
      - ./config:/app/config
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - GOPTERAN_API_URL=https://api.gopteran.dev
```

## Configuration

### Initial Setup

```bash
# Initialize configuration
remora init

# Login to Gopteran
remora auth login

# Set default project
remora config set project my-project-id
```

### Configuration File

```yaml
# ~/.gopteran/config.yml
api:
  url: https://api.gopteran.dev
  timeout: 30s
  retries: 3

auth:
  token: your-jwt-token
  refresh_token: your-refresh-token

project:
  default: my-project-id

daemon:
  enabled: true
  port: 8080
  log_level: info

plugins:
  - name: docker
    enabled: true
  - name: kubernetes
    enabled: false
```

### Environment Variables

```bash
# API Configuration
export GOPTERAN_API_URL=https://api.gopteran.dev
export GOPTERAN_TOKEN=your-jwt-token

# Daemon Configuration
export REMORA_DAEMON_PORT=8080
export REMORA_LOG_LEVEL=info

# Feature Flags
export REMORA_ENABLE_DOCKER=true
export REMORA_ENABLE_K8S=false
```

## Command Reference

### Authentication

```bash
# Login with credentials
remora auth login

# Login with token
remora auth login --token your-jwt-token

# Check authentication status
remora auth status

# Logout
remora auth logout
```

### Project Management

```bash
# List projects
remora projects list

# Create project
remora projects create --name "My Project" --description "Project description"

# Get project details
remora projects get my-project-id

# Update project
remora projects update my-project-id --name "Updated Name"

# Delete project
remora projects delete my-project-id
```

### Resource Management

```bash
# List resources
remora resources list

# Create resource
remora resources create \
  --type server \
  --name web-server-01 \
  --size medium \
  --region us-east-1

# Get resource status
remora resources status resource-id

# Update resource
remora resources update resource-id --size large

# Delete resource
remora resources delete resource-id
```

### Deployment Operations

```bash
# List deployments
remora deployments list

# Create deployment
remora deployments create \
  --name v1.0.0 \
  --environment production \
  --config deployment.yml

# Get deployment status
remora deployments status deployment-id

# Rollback deployment
remora deployments rollback deployment-id

# Scale deployment
remora deployments scale deployment-id --replicas 5
```

### Monitoring & Logs

```bash
# View logs
remora logs --follow --tail 100

# View resource logs
remora logs resource-id --since 1h

# Get metrics
remora metrics --resource resource-id --duration 24h

# Health check
remora health-check --all

# Status overview
remora status
```

## Daemon Mode

### Starting the Daemon

```bash
# Start daemon in foreground
remora daemon start

# Start daemon in background
remora daemon start --detach

# Start with custom configuration
remora daemon start --config /path/to/config.yml
```

### Managing the Daemon

```bash
# Check daemon status
remora daemon status

# Stop daemon
remora daemon stop

# Restart daemon
remora daemon restart

# View daemon logs
remora daemon logs --follow
```

### System Service Installation

```bash
# Install as system service (Linux/macOS)
sudo remora daemon install

# Enable auto-start
sudo systemctl enable remora

# Start service
sudo systemctl start remora

# Check service status
sudo systemctl status remora
```

## Advanced Usage

### Batch Operations

```bash
# Execute commands from file
remora batch --file commands.txt

# Pipeline operations
remora projects list | remora resources create --from-stdin

# Parallel execution
remora resources list --format json | \
  jq -r '.[] | .id' | \
  xargs -P 5 -I {} remora resources update {} --tag batch-update
```

### Configuration Templates

```yaml
# templates/web-app.yml
apiVersion: gopteran.dev/v1
kind: Project
metadata:
  name: "{{ .name }}"
  description: "{{ .description }}"
spec:
  resources:
    - type: server
      name: web-server
      size: "{{ .server_size | default "medium" }}"
      replicas: "{{ .replicas | default 2 }}"
    - type: database
      name: postgres
      version: "15"
      storage: "{{ .db_storage | default "100GB" }}"
```

```bash
# Deploy from template
remora deploy --template templates/web-app.yml \
  --set name=my-web-app \
  --set description="My web application" \
  --set server_size=large \
  --set replicas=3
```

### Plugin Development

```javascript
// plugins/custom-plugin.js
export default {
  name: 'custom-plugin',
  version: '1.0.0',

  commands: {
    'custom:hello': {
      description: 'Say hello',
      handler: async (args, context) => {
        console.log(`Hello, ${args.name || 'World'}!`);
      }
    }
  },

  hooks: {
    'before:deploy': async (context) => {
      console.log('Running pre-deployment checks...');
    },

    'after:deploy': async (context) => {
      console.log('Deployment completed successfully!');
    }
  }
};
```

```bash
# Install plugin
remora plugins install ./plugins/custom-plugin.js

# List plugins
remora plugins list

# Use custom command
remora custom:hello --name "Gopteran"
```

## Integration Examples

### CI/CD Integration

```yaml
# .github/workflows/deploy.yml
name: Deploy with Remora

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Remora
        run: npm install -g @gopteran/remora

      - name: Authenticate
        run: remora auth login --token ${{ secrets.GOPTERAN_TOKEN }}

      - name: Deploy
        run: |
          remora deployments create \
            --name ${{ github.sha }} \
            --environment production \
            --wait-for-completion
```

### Docker Integration

```bash
# Build and deploy Docker image
remora docker build --tag my-app:latest .
remora docker push my-app:latest
remora deployments create --image my-app:latest

# Container management
remora docker ps
remora docker logs container-id
remora docker exec container-id -- /bin/bash
```

### Kubernetes Integration

```bash
# Deploy to Kubernetes
remora k8s apply --file k8s-manifests/

# Get cluster status
remora k8s get pods --namespace production

# Scale deployment
remora k8s scale deployment web-app --replicas 5

# Port forwarding
remora k8s port-forward service/web-app 8080:80
```

## Troubleshooting

### Common Issues

**Authentication Errors**
```bash
# Check token validity
remora auth status

# Refresh token
remora auth refresh

# Re-authenticate
remora auth logout && remora auth login
```

**Connection Issues**
```bash
# Test API connectivity
remora ping

# Check configuration
remora config show

# Debug mode
remora --debug deployments list
```

**Daemon Issues**
```bash
# Check daemon logs
remora daemon logs --tail 100

# Restart daemon
remora daemon restart

# Reset daemon configuration
remora daemon reset
```

### Debug Mode

```bash
# Enable debug logging
remora --debug command

# Verbose output
remora --verbose command

# Trace network requests
remora --trace command
```

## Performance & Optimization

### Caching

```bash
# Enable response caching
remora config set cache.enabled true
remora config set cache.ttl 300

# Clear cache
remora cache clear

# Cache statistics
remora cache stats
```

### Parallel Operations

```bash
# Parallel resource creation
remora resources create --parallel 5 --from-file resources.yml

# Concurrent deployments
remora deployments create --concurrent --environments staging,production
```

## Security Best Practices

### Token Management
- Use short-lived tokens with automatic refresh
- Store tokens securely using system keychain
- Rotate tokens regularly
- Use environment-specific tokens

### Network Security
- Always use HTTPS/TLS for API communication
- Validate SSL certificates
- Use VPN or private networks when possible
- Implement IP whitelisting

### Access Control
- Follow principle of least privilege
- Use role-based access control
- Audit access logs regularly
- Implement multi-factor authentication

## Design Philosophy

Remora embodies the principle of symbiosis — it enhances the system's functionality without compromising the stability or performance of the host. This approach is key in environments where uptime, security, and reliability are paramount.

Key principles:
- **Lightweight**: Minimal resource consumption
- **Reliable**: Robust error handling and recovery
- **Secure**: Security-first design and implementation
- **Extensible**: Plugin architecture for customization

---

This naming and design philosophy ensures that Remora is not just a tool, but a conceptual pillar in the Gopteran ecosystem — a trusted ally "in the trenches," working seamlessly beneath the surface.
