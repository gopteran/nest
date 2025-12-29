---
title: 'Troubleshooting'
draft: false
summary: 'Common issues and solutions for the Gopteran ecosystem'
tags: ['troubleshooting', 'debugging', 'issues', 'solutions']
categories: ['Documentation']
weight: 20
---

# Troubleshooting Guide

This guide covers common issues you might encounter when using the Gopteran
ecosystem and their solutions.

## General Issues

### Authentication Problems

#### Issue: "Invalid token" or "Authentication failed"

**Symptoms:**

- API requests return 401 Unauthorized
- CLI commands fail with authentication errors
- Control panel shows login errors

**Solutions:**

1. **Check token expiry:**

```bash
# Check current authentication status
remora auth status

# Refresh token if expired
remora auth refresh

# Re-authenticate if needed
remora auth logout
remora auth login
```

2. **Verify API URL:**

```bash
# Check current configuration
remora config show

# Update API URL if incorrect
remora config set api.url https://api.gopteran.dev
```

3. **Clear cached credentials:**

```bash
# Clear all cached auth data
remora auth clear-cache

# Re-authenticate
remora auth login
```

#### Issue: "Permission denied" or "Insufficient privileges"

**Symptoms:**

- Operations fail with 403 Forbidden
- Some features are not accessible
- Role-based restrictions

**Solutions:**

1. **Check user permissions:**

```bash
# View current user info
remora users me

# Check project permissions
remora projects permissions
```

2. **Contact administrator:**

- Request appropriate role assignment
- Verify project membership
- Check organization access

### Connection Issues

#### Issue: "Connection refused" or "Network timeout"

**Symptoms:**

- Cannot connect to API
- Timeouts during operations
- Intermittent connectivity

**Solutions:**

1. **Check network connectivity:**

```bash
# Test basic connectivity
ping api.gopteran.dev

# Test HTTPS connectivity
curl -I https://api.gopteran.dev/health
```

2. **Verify firewall settings:**

- Ensure ports 443 (HTTPS) and 80 (HTTP) are open
- Check corporate firewall rules
- Verify proxy settings

3. **Check service status:**

- Visit [status.gopteran.dev](https://status.gopteran.dev)
- Check our [Discord](https://discord.gg/gopteran) for announcements
- Monitor [GitHub issues](https://github.com/gopteran)

## Component-Specific Issues

### Aerie Control Panel

#### Issue: Control panel won't load or shows blank page

**Symptoms:**

- White screen or loading spinner
- JavaScript errors in browser console
- 404 errors for assets

**Solutions:**

1. **Clear browser cache:**

```bash
# Hard refresh (Ctrl+F5 or Cmd+Shift+R)
# Or clear browser cache manually
```

2. **Check browser compatibility:**

- Use modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Enable JavaScript
- Disable ad blockers temporarily

3. **Verify deployment:**

```bash
# Check if services are running
docker ps
# or
systemctl status aerie
```

#### Issue: Real-time updates not working

**Symptoms:**

- Status doesn't update automatically
- Need to refresh page to see changes
- WebSocket connection errors

**Solutions:**

1. **Check WebSocket connection:**

```javascript
// Open browser console and check for WebSocket errors
// Look for "WebSocket connection failed" messages
```

2. **Verify network configuration:**

- Ensure WebSocket traffic is allowed
- Check proxy settings for WebSocket support
- Verify SSL/TLS configuration

### Carina Backend

#### Issue: API server won't start

**Symptoms:**

- Server crashes on startup
- Port binding errors
- Database connection failures

**Solutions:**

1. **Check port availability:**

```bash
# Check if port is in use
netstat -tulpn | grep :3001
# or
lsof -i :3001

# Kill process using port if needed
kill -9 <PID>
```

2. **Verify database connection:**

```bash
# Test database connectivity
psql $DATABASE_URL -c "SELECT 1;"

# Check database status
systemctl status postgresql
```

3. **Review environment variables:**

```bash
# Check required environment variables
echo $DATABASE_URL
echo $JWT_SECRET
echo $NODE_ENV

# Verify .env file exists and is readable
cat .env
```

#### Issue: High memory usage or performance issues

**Symptoms:**

- Slow API responses
- High CPU or memory usage
- Timeout errors

**Solutions:**

1. **Monitor resource usage:**

```bash
# Check system resources
htop
# or
docker stats

# Check application logs
docker logs carina
```

2. **Optimize database queries:**

```bash
# Check slow queries
tail -f /var/log/postgresql/postgresql.log | grep "slow query"

# Analyze query performance
EXPLAIN ANALYZE SELECT ...
```

3. **Scale resources:**

```bash
# Increase container resources
docker update --memory 2g --cpus 2 carina

# Or scale horizontally
 docker compos up --scale carina=3
```

### Ventus Frontend

#### Issue: Build failures or compilation errors

**Symptoms:**

- TypeScript compilation errors
- Vite build failures
- Missing dependencies

**Solutions:**

1. **Clear node modules and reinstall:**

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

2. **Check Node.js version:**

```bash
# Ensure Node.js 18+ is installed
node --version

# Use correct version if needed
nvm use 18
```

3. **Fix TypeScript errors:**

```bash
# Run type checking
pnpm run check

# Fix common issues
pnpm run lint --fix
```

#### Issue: Styling or CSS issues

**Symptoms:**

- Broken layouts
- Missing styles
- Tailwind classes not working

**Solutions:**

1. **Rebuild CSS:**

```bash
# Rebuild Tailwind CSS
pnpm run build:css

# Or in watch mode
pnpm run dev:css
```

2. **Check Tailwind configuration:**

```bash
# Verify tailwind.config.js exists and is correct
cat tailwind.config.js

# Check for purged classes
grep -r "your-class" src/
```

### Remora CLI

#### Issue: Command not found or installation issues

**Symptoms:**

- `remora: command not found`
- Permission errors during installation
- Version conflicts

**Solutions:**

1. **Verify installation:**

```bash
# Check if installed globally
npm list -g @gopteran/remora

# Reinstall if needed
npm uninstall -g @gopteran/remora
npm install -g @gopteran/remora
```

2. **Check PATH:**

```bash
# Verify npm global bin is in PATH
echo $PATH
npm config get prefix

# Add to PATH if needed (add to ~/.bashrc or ~/.zshrc)
export PATH="$(npm config get prefix)/bin:$PATH"
```

3. **Use npx as alternative:**

```bash
# Run without global installation
npx @gopteran/remora --version
```

#### Issue: Daemon won't start or crashes

**Symptoms:**

- Daemon fails to start
- Process exits unexpectedly
- Port binding errors

**Solutions:**

1. **Check daemon logs:**

```bash
# View daemon logs
remora daemon logs --tail 100

# Check system logs
journalctl -u remora -f
```

2. **Verify configuration:**

```bash
# Check daemon configuration
remora config show daemon

# Test configuration
remora daemon validate
```

3. **Check permissions:**

```bash
# Ensure proper permissions for daemon user
sudo chown -R remora:remora /var/lib/remora
sudo chmod 755 /var/lib/remora
```

### Avis Discord Bot

#### Issue: Bot not responding to commands

**Symptoms:**

- Slash commands don't work
- Bot appears offline
- No response to mentions

**Solutions:**

1. **Check bot status:**

```bash
# Verify bot is running
docker ps | grep avis
# or
systemctl status avis
```

2. **Verify Discord permissions:**

- Check bot has necessary permissions in Discord server
- Ensure bot role is above other roles it needs to manage
- Verify slash commands are registered

3. **Check bot token:**

```bash
# Verify token is correct and not expired
echo $DISCORD_BOT_TOKEN

# Test token validity
curl -H "Authorization: Bot $DISCORD_BOT_TOKEN" \
  https://discord.com/api/users/@me
```

## Performance Optimization

### Database Performance

1. **Index optimization:**

```sql
-- Check for missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;

-- Add indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_projects_user_id ON projects(user_id);
```

2. **Query optimization:**

```sql
-- Use EXPLAIN ANALYZE to identify slow queries
EXPLAIN ANALYZE SELECT * FROM projects WHERE user_id = $1;

-- Optimize with proper indexes and query structure
```

### Application Performance

1. **Enable caching:**

```bash
# Configure Redis caching
export REDIS_URL=redis://localhost:6379
export CACHE_TTL=300
```

2. **Optimize bundle size:**

```bash
# Analyze bundle size
pnpm run build:analyze

# Use code splitting and lazy loading
```

## Monitoring and Debugging

### Enable Debug Mode

```bash
# Enable debug logging for CLI
export DEBUG=remora:*
remora --verbose command

# Enable debug mode for API
export LOG_LEVEL=debug
export NODE_ENV=development
```

### Health Checks

```bash
# Check all service health
remora health-check --all

# Individual service checks
curl https://api.gopteran.dev/health
curl https://app.gopteran.dev/health
```

### Log Analysis

```bash
# Centralized logging with Docker
docker logs --follow --tail 100 carina

# System logs
journalctl -u gopteran-* -f

# Application logs
tail -f /var/log/gopteran/*.log
```

## Getting Help

### Before Asking for Help

1. **Check this troubleshooting guide**
2. **Search existing issues** on GitHub
3. **Review recent changes** in your setup
4. **Collect relevant logs** and error messages

### Where to Get Help

1. **GitHub Issues:**
   - [Aerie Issues](https://github.com/gopteran/aerie/issues)
   - [Carina Issues](https://github.com/gopteran/carina/issues)
   - [Ventus Issues](https://github.com/gopteran/ventus/issues)
   - [Remora Issues](https://github.com/gopteran/remora/issues)

2. **Discord Community:**
   - [Join our Discord](https://discord.gg/gopteran)
   - Use `#support` channel for help
   - Use `#general` for discussions

3. **Email Support:**
   - [support@gopteran.com](mailto:support@gopteran.com)
   - Include logs and system information

### Information to Include

When reporting issues, please include:

```bash
# System information
uname -a
node --version
docker --version

# Gopteran versions
remora --version
docker images | grep gopteran

# Configuration (remove sensitive data)
remora config show
cat docker-compose.yml

# Recent logs
remora daemon logs --tail 50
docker logs carina --tail 50
```

## Preventive Measures

### Regular Maintenance

1. **Keep components updated:**

```bash
# Update CLI
npm update -g @gopteran/remora

# Update Docker images
 docker compose pull
 docker compos up -d
```

2. **Monitor disk space:**

```bash
# Check disk usage
df -h
docker system df

# Clean up if needed
docker system prune -a
```

3. **Backup important data:**

```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Backup configuration
tar -czf config-backup.tar.gz ~/.gopteran/
```

### Security Best Practices

1. **Rotate tokens regularly:**

```bash
# Generate new API tokens
remora auth rotate-token

# Update service configurations
```

2. **Monitor access logs:**

```bash
# Check for suspicious activity
grep "401\|403" /var/log/nginx/access.log
```

3. **Keep dependencies updated:**

```bash
# Check for security updates
npm audit
pnpm audit

# Update dependencies
npm update
pnpm update
```

---

_If you can't find a solution to your problem in this guide, don't hesitate to
reach out to our community or support team. We're here to help!_
