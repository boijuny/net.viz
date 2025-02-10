# net.viz

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/boijuny/net.viz)

Modern neural network visualization for the AI era. Explore, analyze, and understand your ONNX models with an intuitive graph-based interface.

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Development](#development) • [Contribute](#contributing)

![net.viz Demo](docs/demo.gif)

</div>

## ✨ Features

- 🎯 **Interactive Graph Visualization**
  - Intuitive node-based visualization
  - Pan, zoom, and interactive exploration
  - Smart layout algorithms for complex models
  - Custom node grouping and collapsing

- 🔍 **Model Analysis**
  - Detailed layer inspection
  - Parameter visualization
  - Memory usage analysis (upcoming)
  - Performance profiling (upcoming)

- 🎨 **Modern UI/UX**
  - Dark/Light theme support
  - Responsive design
  - Command palette (⌘K)
  - Keyboard shortcuts

- 🛠 **Developer Tools**
  - Model comparison
  - Export capabilities
  - Custom scripting support
  - Extensive API

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm/yarn

### Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🏗 Project Structure

```
onnx-visualizer/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Business logic
│   │   ├── models/         # Data models
│   │   └── utils/          # Utilities
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utilities
│   └── package.json       # Frontend dependencies
```

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Style

- Backend: Black + isort
- Frontend: ESLint + Prettier

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs)
- [Architecture Overview](docs/architecture.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ONNX](https://onnx.ai/) for the model format
- [React Flow](https://reactflow.dev/) for graph visualization
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- All our [contributors](https://github.com/boijuny/net.viz/graphs/contributors)

---

<div align="center">

Made with ❤️ by the net.viz team

[![GitHub Repo stars](https://img.shields.io/github/stars/boijuny/net.viz?style=social)](https://github.com/boijuny/net.viz)
[![Follow on GitHub](https://img.shields.io/github/followers/boijuny?style=social)](https://github.com/boijuny)

</div> 