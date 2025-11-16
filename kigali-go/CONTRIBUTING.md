# Contributing to KigaliGo

Thank you for your interest in contributing to KigaliGo! We welcome all contributions, from bug reports to new features and documentation improvements.

##  Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. Create a new **branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Commit** your changes with a clear message
5. **Push** to your fork and submit a pull request

##  Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
flask run
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

##  Coding Standards

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) for Python code
- Use [Google Style Python Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
- Write meaningful commit messages
- Keep pull requests focused on a single feature or bug fix

##  Reporting Bugs

1. Check if the bug has already been reported
2. Provide a clear title and description
3. Include steps to reproduce the issue
4. Add any relevant logs or screenshots

##  Feature Requests

1. Explain the problem you're trying to solve
2. Describe your proposed solution
3. Include any alternative solutions you've considered

##  Testing

Run tests before submitting a pull request:
```bash
# Backend tests
pytest

# Frontend tests
npm test
```

##  License

By contributing to KigaliGo, you agree that your contributions will be licensed under the project's [LICENSE](LICENSE) file.
