---
title: 'Examples'
draft: false
summary: 'Real-world examples and tutorials for using the Gopteran ecosystem'
tags: ['examples', 'tutorials', 'guides', 'use-cases']
categories: ['Documentation']
weight: 15
---

## Example Projects

Learn how to use Gopteran with these practical exa and tutorials.

## Quick Start Examples

### 1. Simple Web Application

Deploy a basic web application using Gopteran components.

**Project Structure:**

```
my-web-app/
├── docker-compose.yml
├── .env
├── app/
│   ├── package.json
│   ├── server.js
│   └── public/
└── gopteran.config.js
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  # Carina Backend
  carina:
    image: gopteran/carina:latest
    ports:
      - '3001:3001'
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres

  # Aerie Control Panel
  aerie:
    image: gopteran/aerie:latest
    ports:
      - '3000:3000'
    environment:
      - API_URL=http://carina:3001
    depends_on:
      - carina

  # Your Application
  app:
    build: ./app
    ports:
      - '8080:8080'
    environment:
      - NODE_ENV=production

  # Database
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=gopteran
      - POSTGRES_USER=gopteran
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Usage:**

```bash
# Clone and setup
git clone https://github.com/gopteran/examples.git
cd examples/web-app

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start services
 docker compos up -d

# Access control panel
open http://localhost:3000
```

### 2. Microservices Architecture

Deploy multiple services with service discovery and load balancing.

**Services:**

- API Gateway (Nginx)
- User Service (Go)
- Product Service (Go)
- Database (PostgreSQL)
- Cache (Redis)

**gopteran.config.js:**

```javascript
export default {
  project: {
    name: 'microservices-demo',
    environment: 'production',
  },

  services: [
    {
      name: 'api-gateway',
      type: 'nginx',
      config: {
        upstream: ['user-service', 'product-service'],
        ssl: true,
        domain: 'api.example.com',
      },
    },
    {
      name: 'user-service',
      type: 'go',
      replicas: 3,
      config: {
        port: 3000,
        healthCheck: '/health',
      },
    },
    {
      name: 'product-service',
      type: 'go',
      replicas: 2,
      config: {
        port: 8000,
        framework: 'gin',
      },
    },
  ],

  databases: [
    {
      name: 'main-db',
      type: 'postgresql',
      config: {
        version: '15',
        storage: '100GB',
        backup: true,
      },
    },
  ],

  cache: {
    type: 'redis',
    config: {
      memory: '2GB',
      persistence: true,
    },
  },
};
```

**Deployment:**

```bash
# Using Remora CLI
remora project create microservices-demo
remora deploy --config gopteran.config.js

# Monitor deployment
remora status --watch

# Scale services
remora scale user-service --replicas 5
```

### 3. CI/CD Pipeline Integration

Integrate Gopteran with your CI/CD pipeline for automated deployments.

**GitHub Actions Workflow (.github/workflows/deploy.yml):**

```yaml
name: Deploy to Gopteran

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Install Remora CLI
        run: npm install -g @gopteran/remora

      - name: Configure Gopteran
        run: |
          remora auth login --token ${{ secrets.GOPTERAN_TOKEN }}
          remora config set project ${{ secrets.PROJECT_ID }}

      - name: Deploy to staging
        run: remora deploy --environment staging

      - name: Run health checks
        run: remora health-check --timeout 300

      - name: Deploy to production
        if: success()
        run: remora deploy --environment production
```

## Advanced Examples

### 4. Multi-Region Deployment

Deploy applications across multiple regions for high availability.

**Configuration:**

```javascript
export default {
  project: {
    name: 'global-app',
    regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
  },

  services: [
    {
      name: 'web-app',
      type: 'nodejs',
      deployment: {
        strategy: 'multi-region',
        regions: {
          'us-east-1': { replicas: 3, primary: true },
          'eu-west-1': { replicas: 2 },
          'ap-southeast-1': { replicas: 2 },
        },
      },
    },
  ],

  loadBalancer: {
    type: 'global',
    routing: 'geo-proximity',
    healthCheck: {
      path: '/health',
      interval: 30,
    },
  },

  database: {
    type: 'postgresql',
    replication: {
      primary: 'us-east-1',
      replicas: ['eu-west-1', 'ap-southeast-1'],
      syncMode: 'async',
    },
  },
};
```

### 5. Auto-Scaling Configuration

Configure automatic scaling based on metrics.

**Scaling Rules:**

```javascript
export default {
  services: [
    {
      name: 'api-server',
      scaling: {
        min: 2,
        max: 20,
        target: {
          cpu: 70, // Scale when CPU > 70%
          memory: 80, // Scale when memory > 80%
          requests: 1000, // Scale when requests/min > 1000
        },
        cooldown: {
          scaleUp: 300, // Wait 5 min before scaling up again
          scaleDown: 600, // Wait 10 min before scaling down
        },
      },
    },
  ],

  monitoring: {
    metrics: ['cpu', 'memory', 'requests', 'response_time'],
    alerts: [
      {
        name: 'high-cpu',
        condition: 'cpu > 90',
        duration: '5m',
        action: 'scale-up',
      },
      {
        name: 'high-error-rate',
        condition: 'error_rate > 5',
        duration: '2m',
        action: 'alert',
      },
    ],
  },
};
```

### 6. Database Migration Example

Handle database migrations in your deployment pipeline.

**Migration Script:**

```javascript
// migrations/001_initial_schema.js
export async function up(db) {
  await db.schema.createTable('users', table => {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    table.string('name').notNullable();
    table.timestamp('created_at').defaultTo(db.fn.now());
  });

  await db.schema.createTable('projects', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.uuid('owner_id').references('users.id');
    table.timestamp('created_at').defaultTo(db.fn.now());
  });
}

export async function down(db) {
  await db.schema.dropTable('projects');
  await db.schema.dropTable('users');
}
```

**Deployment with Migrations:**

```bash
# Run migrations before deployment
remora migrate --up

# Deploy application
remora deploy --wait-for-health

# Rollback if needed
remora rollback --with-migrations
```

## Integration Examples

### 7. Monitoring and Alerting

Set up comprehensive monitoring with Prometheus and Grafana.

**Monitoring Configuration:**

```yaml
# monitoring/docker-compose.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - '3001:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

  alertmanager:
    image: prom/alertmanager
    ports:
      - '9093:9093'
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml

volumes:
  grafana_data:
```

**Prometheus Configuration:**

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'gopteran-api'
    static_configs:
      - targets: ['carina:3001']
    metrics_path: '/metrics'

  - job_name: 'application'
    static_configs:
      - targets: ['app:8080']
```

### 8. Backup and Disaster Recovery

Implement automated backups and disaster recovery.

**Backup Configuration:**

```javascript
export default {
  backup: {
    schedule: '0 2 * * *', // Daily at 2 AM
    retention: '30d',

    databases: [
      {
        name: 'main-db',
        type: 'postgresql',
        compression: true,
        encryption: true,
      },
    ],

    storage: {
      type: 's3',
      bucket: 'my-app-backups',
      region: 'us-east-1',
    },
  },

  disaster_recovery: {
    rto: '4h', // Recovery Time Objective
    rpo: '1h', // Recovery Point Objective

    strategy: 'multi-region',
    failover: {
      automatic: true,
      health_check_failures: 3,
    },
  },
};
```

## Community Examples

### 11. Discord Bot Integration

Extend Avis with custom commands.

**Custom Bot Command:**

```javascript
// bot-extensions/deploy-command.js
import { SlashCommandBuilder } from 'discord.js';
import { GopteranClient } from '@gopteran/sdk';

export const data = new SlashCommandBuilder()
  .setName('deploy')
  .setDescription('Deploy a project')
  .addStringOption(option =>
    option.setName('project').setDescription('Project name').setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('environment')
      .setDescription('Target environment')
      .setRequired(false)
      .addChoices(
        { name: 'staging', value: 'staging' },
        { name: 'production', value: 'production' }
      )
  );

export async function execute(interaction) {
  const project = interaction.options.getString('project');
  const environment = interaction.options.getString('environment') ?? 'staging';

  await interaction.deferReply();

  try {
    const client = new GopteranClient({
      token: process.env.GOPTERAN_TOKEN,
    });

    const deployment = await client.deployments.create(project, {
      environment,
      source: 'discord',
    });

    await interaction.editReply({
      embeds: [
        {
          title: '🚀 Deployment Started',
          description: `Deploying ${project} to ${environment}`,
          color: 0x00ff00,
          fields: [
            { name: 'Deployment ID', value: deployment.id },
            { name: 'Status', value: deployment.status },
          ],
        },
      ],
    });
  } catch (error) {
    await interaction.editReply({
      embeds: [
        {
          title: '❌ Deployment Failed',
          description: error.message,
          color: 0xff0000,
        },
      ],
    });
  }
}
```

## Getting Help

- **Documentation**: [Complete documentation](/docs)
- **GitHub**: [Example repositories](https://github.com/gopteran/examples)
- **Discord**: [Community support](https://discord.gg/gopteran)
- **Tutorials**: [Video tutorials](https://youtube.com/@gopteran)

## Contributing Examples

Have a great example to share? We'd love to include it!

1. Fork the [examples repository](https://github.com/gopteran/examples)
2. Add your example with documentation
3. Submit a pull request
4. Join our [Discord](https://discord.gg/gopteran) to discuss

## Next Steps

- [API Reference](/docs/api) - Complete API documentation
- [Component Guides](/docs) - Deep dive into each component
- [Best Practices](/docs/best-practices) - Production deployment tips
- [Troubleshooting](/docs/troubleshooting) - Common issues and solutions
