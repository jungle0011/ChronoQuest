# Contributing to BizPlanNaija

Thank you for your interest in contributing to BizPlanNaija! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git
- Firebase account
- Cloudinary account
- Paystack account (for payments)

### Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/bizplannaija.git
   cd bizplannaija
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. **Run the development server**
   ```bash
   pnpm dev
   ```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive names for variables, functions, and files

### File Structure

```
bizplannaija/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── admin/          # Admin panel pages
│   └── ...             # Other pages
├── components/         # Reusable components
│   └── ui/            # UI components
├── lib/               # Utility functions and configurations
├── contexts/          # React contexts
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── public/            # Static assets
```

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Add JSDoc comments for complex functions
- Follow the existing component patterns

### API Route Guidelines

- Use proper HTTP status codes
- Implement input validation with Zod
- Add error handling
- Use rate limiting where appropriate
- Follow RESTful conventions

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Writing Tests
- Write tests for new features
- Ensure good test coverage
- Use descriptive test names
- Mock external dependencies

## 🔒 Security

### Security Guidelines

1. **Never commit secrets**: All sensitive data should be in environment variables
2. **Validate inputs**: Use the provided validation schemas
3. **Sanitize content**: Use DOMPurify for HTML content
4. **Follow OWASP guidelines**: Implement security best practices

### Security Audit
```bash
pnpm security-audit
```

## 📦 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding guidelines
   - Add tests if applicable
   - Update documentation

3. **Run quality checks**
   ```bash
   pnpm lint
   pnpm type-check
   pnpm security-audit
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### PR Requirements

- [ ] Code follows the style guidelines
- [ ] Tests pass
- [ ] Security audit passes
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment details**
   - OS and version
   - Node.js version
   - Browser (if applicable)

2. **Steps to reproduce**
   - Clear, step-by-step instructions
   - Expected vs actual behavior

3. **Additional context**
   - Screenshots if applicable
   - Console errors
   - Network tab information

## 💡 Feature Requests

When requesting features:

1. **Describe the problem**
   - What issue does this solve?
   - Who would benefit from this?

2. **Propose a solution**
   - How should this work?
   - Any technical considerations?

3. **Provide context**
   - Use cases
   - Mockups or examples

## 📚 Documentation

### Updating Documentation

- Keep README.md up to date
- Update API documentation
- Add inline code comments
- Update security documentation

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep it organized and searchable

## 🚀 Deployment

### Pre-deployment Checklist

- [ ] All tests pass
- [ ] Security audit passes
- [ ] Environment variables are set
- [ ] Database migrations are applied
- [ ] Performance is acceptable
- [ ] Mobile responsiveness is verified

### Deployment Process

1. **Create a release branch**
   ```bash
   git checkout -b release/v1.0.0
   ```

2. **Update version numbers**
   - Update package.json
   - Update any version references

3. **Create a release**
   - Tag the release
   - Write release notes
   - Deploy to staging

4. **Production deployment**
   - Deploy to production
   - Monitor for issues
   - Update documentation

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Help others learn
- Provide constructive feedback
- Follow the project's values

### Communication

- Use GitHub issues for discussions
- Be clear and concise
- Ask questions when needed
- Share knowledge and resources

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For general questions and ideas
- **Documentation**: Check the README and docs first

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to BizPlanNaija! 🚀 