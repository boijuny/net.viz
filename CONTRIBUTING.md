# Contributing to net.viz

First off, thank you for considering contributing to net.viz! It's people like you that make it such a great tool.

## Getting Started

1. Fork the repository on GitHub: https://github.com/boijuny/net.viz
2. Clone your fork locally:
```bash
git clone git@github.com:your-username/net.viz.git
cd net.viz
```

3. Create a branch for your changes:
```bash
git checkout -b feature/your-feature-name
```

4. Make your changes and commit them:
```bash
git add .
git commit -m "Add your feature"
```

5. Push to your fork:
```bash
git push origin feature/your-feature-name
```

6. Open a Pull Request on GitHub

## Development Setup

1. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
cd backend
pip install -r requirements.txt
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

## Code Style

### Backend (Python)
- Use Black for code formatting
- Use isort for import sorting
- Follow PEP 8 guidelines
- Use type hints

```bash
# Format code
black .
isort .

# Run tests
pytest
```

### Frontend (TypeScript/React)
- Use ESLint and Prettier
- Follow the Airbnb JavaScript Style Guide
- Use TypeScript types/interfaces

```bash
# Format code
npm run format

# Run tests
npm test
```

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation if you're changing functionality
3. Add tests for your changes
4. Ensure the test suite passes
5. Make sure your code lints
6. Reference any relevant issues in your PR description

## Code of Conduct

This project adheres to the Contributor Covenant code of conduct. By participating, you are expected to uphold this code.

## Questions?

Feel free to open an issue or contact the maintainers:
- GitHub: [@boijuny](https://github.com/boijuny)
- Project Issues: [net.viz Issues](https://github.com/boijuny/net.viz/issues)

Thank you for your contribution! 🎉 