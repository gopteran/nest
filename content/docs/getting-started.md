---
title: "Getting Started"
date: 2024-01-15
draft: false
summary: "Quick start guide to get up and running with the Gopteran ecosystem"
tags: ["getting-started", "setup", "installation", "quickstart"]
categories: ["Documentation"]
weight: 1
---

## Welcome to Gopteran

Gopteran is a comprehensive infrastructure management ecosystem designed for flight and precision. This guide will help you get started with the core components and understand how they work together.

## Overview of Components

The Gopteran ecosystem consists of six main components:

### Core Infrastructure
- **[Carina](/docs/carina)** - Backend core providing authentication, API orchestration, and resource management
- **[Aerie](/docs/aerie)** - Fullstack control panel combining frontend and backend management

### User Interfaces
- **[Ventus](/docs/ventus)** - Frontend framework built with SvelteKit for infrastructure management
- **[Remora](/docs/remora)** - CLI agent/daemon for lightweight server-side operations

### Community & Documentation
- **[Avis](/docs/avis)** - Discord bot for community communication and automation
- **[Nest](/docs/nest)** - Documentation hub (this site) for centralized knowledge

## Quick Start

### Prerequisites

Before getting started, ensure you have:

- **Node.js** (v18 or higher)
- **Docker** (for containerized deployments)
- **Git** (for version control)
- **A supported operating system** (Linux, macOS, or Windows)

### Installation Options

#### Option 1: Docker Compose (Recommended)

The fastest way to get started is using our Docker Compose setup:

```bash
# Clone the main repository
git clone https://github.com/gopteran/aerie.git
cd aerie

# Start all services
 docker compos up -d

# Access the control panel
open http://localhost:3000
```

#### Option 2: Manual Installation

For development or custom setups:

```bash
# 1. Set up the backend (Carina)
git clone https://github.com/gopteran/carina.git
cd carina
npm install
npm run dev

# 2. Set up the frontend (Ventus)
git clone https://github.com/gopteran/ventus.git
cd ventus
npm install
npm run dev

# 3. Install CLI tools (Remora)
npm install -g @gopteran/remora
```

### First Steps

1. **Access the Control Panel**: Navigate to `http://localhost:3000` to access Aerie
2. **Create Your First Project**: Use the setup wizard to configure your infrastructure
3. **Explore the CLI**: Run `remora --help` to see available commands
4. **Join the Community**: Connect with us on [Discord](https://discord.gg/gopteran)

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/gopteran"

# Authentication
JWT_SECRET="your-secret-key"
SESSION_SECRET="your-session-secret"

# API Configuration
API_PORT=3001
WEB_PORT=3000

# External Services
DISCORD_BOT_TOKEN="your-discord-token"
```

### Basic Configuration

The main configuration file is `gopteran.config.js`:

```javascript
export default {
  // Server configuration
  server: {
    port: process.env.API_PORT || 3001,
    host: '0.0.0.0'
  },

  // Database settings
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
  },

  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    tokenExpiry: '7d'
  }
}
```

## Architecture Overview

```mermaid
graph TB
    A[User] --> B[Ventus Frontend]
    A --> C[Remora CLI]
    B --> D[Aerie Control Panel]
    C --> E[Carina Backend]
    D --> E
    E --> F[Database]
    E --> G[External APIs]
    H[Avis Discord Bot] --> E
    I[Nest Documentation] --> A
```

## Next Steps

Now that you have Gopteran running:

1. **Explore Components**: Learn about each component in detail
2. **Read the API Reference**: Understand the available endpoints
3. **Check Examples**: See real-world usage patterns
4. **Join the Community**: Get help and share your experience

## Need Help?

- **Documentation**: Browse our comprehensive [documentation](/docs)
- **Examples**: Check out [example projects](/docs/examples)
- **Community**: Join our [Discord server](https://discord.gg/gopteran)
- **Issues**: Report bugs on [GitHub](https://github.com/gopteran)

## What's Next?

- [Component Overview](/docs/components) - Deep dive into each component
- [API Reference](/docs/api) - Complete API documentation
- [Examples](/docs/examples) - Real-world usage examples
- [Contributing](/docs/contributing) - Help improve Gopteran
