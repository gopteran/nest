---
title: "Contributing"
draft: false
summary: "How to contribute to the Gopteran project - code, documentation, and community"
tags: ["contributing", "development", "community", "open-source"]
categories: ["Documentation"]
weight: 25
---

# Contributing to Gopteran

We're thrilled that you're interested in contributing to Gopteran! This guide will help you get started with contributing to our ecosystem of infrastructure management tools.

## Ways to Contribute

### 🐛 Report Bugs
Help us improve by reporting bugs you encounter:
- Use GitHub Issues in the relevant repository
- Provide detailed reproduction steps
- Include system information and logs
- Check if the issue already exists

### 💡 Suggest Features
Share your ideas for new features:
- Open a GitHub Discussion or Issue
- Describe the use case and benefits
- Consider implementation complexity
- Engage with community feedback

### 📝 Improve Documentation
Help make our docs better:
- Fix typos and grammar
- Add missing information
- Create tutorials and examples
- Translate content

### 💻 Contribute Code
Submit code improvements:
- Bug fixes
- New features
- Performance optimizations
- Test coverage improvements

### 🎨 Design and UX
Enhance user experience:
- UI/UX improvements
- Accessibility enhancements
- Visual design updates
- User research insights

### 🤝 Community Support
Help other users:
- Answer questions in Discord
- Review pull requests
- Mentor new contributors
- Share your experiences

## Getting Started

### 1. Choose Your Component

Each component has its own repository and contribution guidelines:

- **[Aerie](https://github.com/gopteran/aerie)** - Control panel (Full-stack)
- **[Carina](https://github.com/gopteran/carina)** - Backend API (Node.js/TypeScript)
- **[Ventus](https://github.com/gopteran/ventus)** - Frontend framework (SvelteKit)
- **[Remora](https://github.com/gopteran/remora)** - CLI agent (Node.js)
- **[Avis](https://github.com/gopteran/avis)** - Discord bot (Discord.js)
- **[Nest](https://github.com/gopteran/nest)** - Documentation (Hugo)

### 2. Set Up Development Environment

#### Prerequisites
- **Node.js** 18+ and **pnpm**
- **Git** for version control
- **Docker** (optional, for full stack development)
- **PostgreSQL** (for backend development)

#### Fork and Clone
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/COMPONENT_NAME.git
cd COMPONENT_NAME

# Add upstream remote
git remote add upstream https://github.com/gopteran/COMPONENT_NAME.git
```

#### Install Dependencies
```bash
# Install project dependencies
pnpm install

# Copy environment configuration
cp .env.example .env
# Edit .env with your settings
```

### 3. Development Workflow

#### Create a Branch
```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

#### Make Changes
- Follow the existing code style
- Write tests for new functionality
- Update documentation as needed
- Commit changes with clear messages

#### Test Your Changes
```bash
# Run tests
pnpm test

# Run linting
pnpm lint

# Build the project
pnpm build

# Start development server
pnpm dev
```

#### Submit Pull Request
```bash
# Push your branch
git push origin feature/your-feature-name

# Create pull request on GitHub
# Fill out the PR template completely
```

## Code Standards

### General Guidelines

1. **Code Quality**
   - Write clean, readable code
   - Follow existing patterns and conventions
   - Use meaningful variable and function names
   - Add comments for complex logic

2. **Testing**
   - Write unit tests for new functions
   - Add integration tests for new features
   - Ensure all tests pass before submitting
   - Aim for good test coverage

3. **Documentation**
   - Update README files as needed
   - Add JSDoc comments for functions
   - Update API documentation
   - Include examples in documentation

### Language-Specific Standards

#### TypeScript/JavaScript
```typescript
// Use TypeScript for type safety
interface ProjectConfig {
  name: string;
  description?: string;
  settings: Record<string, unknown>;
}

// Use async/await over promises
async function createProject(config: ProjectConfig): Promise<Project> {
  try {
    const project = await api.projects.create(config);
    return project;
  } catch (error) {
    logger.error('Failed to create project:', error);
    throw error;
  }
}

// Use meaningful names and proper error handling
```

#### CSS/Styling
```css
/* Use Tailwind CSS classes when possible */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors;
}

/* Use CSS custom properties for theming */
:root {
  --color-primary: #2563eb;
  --color-secondary: #38bdf8;
}
```

### Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(api): add project creation endpoint

Add POST /projects endpoint with validation and error handling.
Includes tests and documentation updates.

Closes #123
```

```
fix(cli): resolve authentication token refresh issue

Token refresh was failing due to incorrect header format.
Updated to use proper Authorization header.

Fixes #456
```

## Pull Request Guidelines

### Before Submitting

1. **Sync with upstream:**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run quality checks:**
```bash
pnpm lint
pnpm test
pnpm build
```

3. **Update documentation:**
- Update README if needed
- Add/update API documentation
- Include examples for new features

### PR Template

When creating a pull request, include:

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs tests
   - Code quality checks
   - Security scans

2. **Code Review**
   - At least one maintainer review required
   - Address feedback promptly
   - Make requested changes

3. **Merge**
   - Squash and merge for clean history
   - Delete feature branch after merge

## Component-Specific Guidelines

### Aerie (Control Panel)
- Follow full-stack best practices
- Ensure responsive design
- Test both frontend and backend changes
- Update integration tests

### Carina (Backend API)
- Follow REST API conventions
- Add comprehensive error handling
- Update OpenAPI documentation
- Include database migrations if needed

### Ventus (Frontend)
- Follow SvelteKit conventions
- Ensure accessibility compliance
- Test across different browsers
- Optimize for performance

### Remora (CLI)
- Follow CLI best practices
- Ensure cross-platform compatibility
- Add help text for new commands
- Update shell completions

### Avis (Discord Bot)
- Follow Discord.js best practices
- Test commands in development server
- Update command documentation
- Handle rate limits properly

### Nest (Documentation)
- Follow Hugo conventions
- Use proper markdown formatting
- Include code examples
- Test links and references

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- **Be respectful** in all interactions
- **Be constructive** in feedback and discussions
- **Be patient** with new contributors
- **Be collaborative** in problem-solving

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General discussions and questions
- **Discord**: Real-time chat and community support
- **Email**: Private or sensitive matters

### Recognition

We value all contributions and recognize contributors through:

- **Contributors file** in each repository
- **Release notes** mentioning contributors
- **Discord roles** for active contributors
- **Swag and rewards** for significant contributions

## Development Resources

### Useful Links

- **[GitHub Organization](https://github.com/gopteran)**
- **[Discord Server](https://discord.gg/gopteran)**
- **[Project Roadmap](https://github.com/orgs/gopteran/projects)**
- **[API Documentation](/docs/api)**

### Development Tools

- **IDE Extensions**: ESLint, Prettier, TypeScript
- **Browser Extensions**: Vue/React DevTools, Redux DevTools
- **CLI Tools**: GitHub CLI, Docker, Postman/Insomnia

### Learning Resources

- **[SvelteKit Documentation](https://kit.svelte.dev/)**
- **[Hugo Documentation](https://gohugo.io/documentation/)**
- **[Discord.js Guide](https://discordjs.guide/)**
- **[Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)**

## Frequently Asked Questions

### Q: How do I get started as a first-time contributor?

A: Start with documentation improvements or small bug fixes. Look for issues labeled "good first issue" or "help wanted". Join our Discord for guidance!

### Q: Can I work on multiple components?

A: Absolutely! Many contributors work across multiple repositories. Just make sure to follow each component's specific guidelines.

### Q: How long does the review process take?

A: We aim to provide initial feedback within 48 hours. Complex changes may take longer to review thoroughly.

### Q: What if my PR is rejected?

A: Don't worry! We'll provide feedback on why and how to improve. Rejection often leads to better solutions through collaboration.

### Q: Can I contribute if I'm not a developer?

A: Yes! We need help with documentation, design, testing, community support, and more. Every contribution is valuable.

## Getting Help

If you need help with contributing:

1. **Check existing documentation** and issues
2. **Ask in Discord** #contributors channel
3. **Open a GitHub Discussion** for general questions
4. **Email us** at [contributors@gopteran.com](mailto:contributors@gopteran.com)

## Thank You!

Thank you for considering contributing to Gopteran! Your contributions help make infrastructure management better for everyone. We look forward to working with you! 🚀

---

*"In an ecosystem defined by flight and precision, every contribution helps us soar higher together."*
