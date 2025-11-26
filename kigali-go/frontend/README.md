# KigaliGo Frontend

The modern, responsive Progressive Web App (PWA) for the KigaliGo urban mobility platform. Built with React, Vite, and TailwindCSS.

## ✨ Features

- **🗺️ Interactive Maps**: Real-time vehicle tracking using Google Maps API
- **📱 PWA Support**: Installable on mobile devices with offline capabilities
- **🎨 Modern UI**: Custom design system inspired by Kigali's aesthetics
- **🌓 Dark Mode**: Fully supported system-wide dark mode
- **🌍 Localization**: English and Kinyarwanda support
- **⚡ Fast Performance**: Optimized build with Vite

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS + PostCSS
- **Maps**: @react-google-maps/api
- **State Management**: React Context + Hooks
- **Routing**: React Router v6
- **Icons**: Lucide React + Heroicons
- **PWA**: Vite PWA Plugin
- **Testing**: Vitest + React Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example file and add your keys:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api/v1
   REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_key_here
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`

## 🏗️ Project Structure

```
frontend/
├── public/             # Static assets (manifest, icons)
├── src/
│   ├── assets/         # Images and fonts
│   ├── components/     # Reusable UI components
│   │   ├── common/     # Buttons, inputs, cards
│   │   ├── layout/     # Navbar, sidebar, footer
│   │   └── map/        # Map-related components
│   ├── contexts/       # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components (routes)
│   ├── services/       # API service integration
│   ├── styles/         # Global styles & Tailwind config
│   ├── utils/          # Helper functions
│   ├── App.js          # Main app component
│   └── main.jsx        # Entry point
├── .env.example        # Environment template
├── index.html          # HTML entry point
├── tailwind.config.js  # Tailwind configuration
└── vite.config.js      # Vite configuration
```

## 🧪 Testing

Run the test suite:

```bash
# Run unit tests
npm test

# Run tests with UI
npm run test:ui

# Run coverage report
npm run coverage
```

## 📦 Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```

The build artifacts will be stored in the `dist/` directory, ready for deployment to Vercel, Netlify, or any static host.

## 🤝 Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
