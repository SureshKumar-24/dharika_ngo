# Contributing to Dharika Foundation

Thank you for your interest in contributing to Dharika Foundation! We welcome contributions from everyone who wants to help make a positive impact on underserved communities.

## 🤝 How to Contribute

### 1. Fork the Repository

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/dharika_ngo.git
cd dharika_ngo
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### 3. Create a Branch

```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments where necessary
- Test your changes locally

### 5. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new feature description"
# or
git commit -m "fix: resolve bug description"
```

#### Commit Message Format

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 6. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📋 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Use meaningful variable and function names
- Keep functions small and focused

### File Structure

```
src/
├── app/           # Next.js App Router pages and API routes
├── components/    # React components
│   ├── sections/  # Page sections
│   ├── ui/        # Reusable UI components
│   └── admin/     # Admin-specific components
├── lib/           # Utility functions and integrations
└── types/         # TypeScript type definitions
```

### Testing

Before submitting a PR:

```bash
# Build the project
npm run build

# Run linting
npm run lint
```

## 🐛 Reporting Bugs

1. Check if the bug has already been reported
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS)

## 💡 Suggesting Features

1. Check existing issues for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

## 📝 Documentation

- Update README.md if you change functionality
- Add JSDoc comments to functions
- Update .env.example if you add new environment variables

## 🔒 Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables for secrets
- Report security vulnerabilities privately to dharika.co@gmail.com

## 📞 Questions?

- Email: dharika.co@gmail.com
- Instagram: [@dharika.in](https://www.instagram.com/dharika.in)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Dharika Foundation better! 🙏
