# Changelog

All notable changes to KigaliGo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Mobile app (React Native)
- Driver dashboard
- Payment integration
- Advanced analytics

## [1.0.0] - 2024-11-26

### Added
- 🗺️ Real-time vehicle tracking on interactive maps
- 🚌 Multi-modal trip planning (buses, taxis, walking)
- 💰 Accurate fare estimation before booking
- 🚏 Nearby stops and vehicle locations
- 📱 Progressive Web App (PWA) with offline support
- 🛡️ Safety reporting and feedback system
- 🔐 Complete authentication system with JWT
- 📧 Email verification for new users
- 🔄 Password reset functionality
- 🌓 Dark mode support
- 🔔 Real-time notifications
- 🌍 Bilingual support (English + Kinyarwanda)
- 📊 Admin dashboard
- 🎨 Rwanda-inspired design system
- 🗺️ Google Maps integration
- 📍 Location services with geolocation
- 🚀 Deployed on Vercel (frontend) and Render (backend)

### Technical
- React 18 + Vite frontend
- Python Flask backend with SQLAlchemy
- PostgreSQL database with PostGIS
- JWT authentication with token rotation
- Bcrypt password hashing (12 rounds)
- Rate limiting on sensitive endpoints
- Comprehensive API documentation
- Full test coverage
- Docker support
- CI/CD with GitHub Actions

### Security
- HTTP-only cookies for refresh tokens
- Token revocation and blocklist
- Input validation and sanitization
- CORS protection
- SQL injection protection

### Documentation
- Comprehensive README
- API documentation
- Deployment guide
- Contributing guidelines
- Security policy
- Code of conduct
- 30+ technical guides
- UML diagrams
- System architecture documentation

## [0.2.0] - 2024-11-20

### Added
- Authentication system
- User profile management
- Email verification
- Password reset flow

### Changed
- Improved UI/UX design
- Enhanced dark mode
- Better error handling

### Fixed
- Location timeout issues
- Notification display bugs
- Profile page rendering

## [0.1.0] - 2024-11-01

### Added
- Initial project setup
- Basic map functionality
- Route planning prototype
- Database schema design
- Basic frontend structure

---

## Release Notes Format

### Added
New features and functionality

### Changed
Changes to existing functionality

### Deprecated
Features that will be removed in upcoming releases

### Removed
Features that have been removed

### Fixed
Bug fixes

### Security
Security improvements and vulnerability fixes

---

## How to Update This Changelog

When making changes to the project:

1. Add your changes under the `[Unreleased]` section
2. Use the appropriate category (Added, Changed, Fixed, etc.)
3. Write clear, user-friendly descriptions
4. Include emoji for better readability
5. When releasing, move items from Unreleased to a new version section

## Version Numbering

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version (1.x.x): Incompatible API changes
- **MINOR** version (x.1.x): New functionality (backwards compatible)
- **PATCH** version (x.x.1): Bug fixes (backwards compatible)

---

[Unreleased]: https://github.com/your-repo/kigali-go/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-repo/kigali-go/releases/tag/v1.0.0
[0.2.0]: https://github.com/your-repo/kigali-go/releases/tag/v0.2.0
[0.1.0]: https://github.com/your-repo/kigali-go/releases/tag/v0.1.0
