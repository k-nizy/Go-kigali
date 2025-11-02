# CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN (Part 1)

## 3.1 Introduction

The development of KigaliGo employs a mixed-methods research approach. **Qualitative methods** include semi-structured interviews with 20 regular commuters, observation studies at bus terminals (Nyabugogo, Kimironko), and focus groups with diverse user profiles. **Quantitative methods** comprise structured surveys of 100+ passengers, measuring trip planning time, fare estimation accuracy, and usability testing using the System Usability Scale (SUS) scoring.

The software development follows an **Agile methodology** with two-week sprints, daily standups, and continuous integration. This iterative approach enables rapid prototyping and the incorporation of user feedback.

## 3.2 Development Model

**KigaliGo follows a 5-Phase Agile Development Model:**

**Phase 1: Research & Requirements (Weeks 1-4)**
- Literature review of existing transport apps
- User surveys and interviews
- Requirements analysis and prioritization

**Phase 2: Design (Weeks 4-6)**
- Database schema design
- UI/UX mockups using Figma
- System architecture definition
- API endpoint specification

**Phase 3: Iterative Development (Weeks 6-9)**
- Sprint 1: Authentication system and database setup
- Sprint 2: Map integration and vehicle tracking
- Sprint 3: Fare estimation and reporting features
- Each sprint includes: Development → Testing → Code Review → Demo

**Phase 4: Testing & Validation (Weeks 9-11)**
- Unit testing (pytest for backend, Jest for frontend)
- Integration testing
- Usability testing with 50+ participants
- Bug fixes and refinement based on feedback

**Phase 5: Deployment & Documentation (Weeks 11-12)**
- Complete technical documentation
- Deploy to cloud (Vercel for frontend, Render for backend)
- Final presentation preparation

## 3.3 System Architecture

KigaliGo follows a **three-tier client-server architecture**:

**Tier 1: Presentation Layer (Client)**
- React 18 Progressive Web Application
- Responsive design with TailwindCSS
- Service Worker for offline functionality
- Leaflet.js for OpenStreetMap integration
- i18next for bilingual support (English/Kinyarwanda)

**Tier 2: Application Layer (Server)**
- Flask 2.3 RESTful API
- JWT-based authentication
- Business logic modules:
  - Fare calculation engine
  - Distance/duration algorithms
  - Time-based multipliers (peak/night hours)
- Flask-CORS for cross-origin requests
- Rate limiting for security

**Tier 3: Data Layer (Database)**
- PostgreSQL (production) / SQLite (development)
- PostGIS extension for geospatial queries
- SQLAlchemy ORM for database operations
- Normalized schema (3NF) with indexed foreign keys

**Key Architecture Principles:**
- Separation of concerns (each layer has distinct responsibility)
- Stateless API (JWT tokens carry authentication state)
- Loose coupling (JSON API allows frontend flexibility)
- Scalability (horizontal scaling via multiple backend instances)

<div style="page-break-after: always;"></div>
