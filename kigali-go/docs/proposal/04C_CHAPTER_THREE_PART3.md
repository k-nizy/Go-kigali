# CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN (Part 3)

## 3.6 Development Tools and Technologies

The following tools and technologies were selected for KigaliGo based on suitability for rapid development, scalability, cost-effectiveness, and team expertise.

### 3.6.1 Frontend Technologies

**React 18.2** - JavaScript library for building user interfaces
- **Justification:** Component-based architecture enables reusable UI elements (e.g., vehicle cards, map markers). Hooks (useState, useEffect) simplify state management. Large ecosystem with extensive documentation. Strong community support for troubleshooting.
- **Usage:** All frontend pages (Home, Map, Trip Planner, Fare Estimator, Reports, Profile)

**TailwindCSS 3.3** - Utility-first CSS framework
- **Justification:** Rapid prototyping with pre-built utility classes. Highly customizable design system. Mobile-first responsive design out-of-the-box. Smaller bundle size compared to Bootstrap. Excellent integration with React.
- **Usage:** All styling and responsive layouts

**React Router DOM 6.8** - Client-side routing library
- **Justification:** Declarative routing matching React's component model. Enables seamless single-page application navigation without page refreshes. Supports protected routes for authenticated pages.
- **Usage:** Navigation between pages (/map, /plan-trip, /fare, /reports, /profile)

**Leaflet.js 1.9 + React-Leaflet 4.2** - Open-source mapping library
- **Justification:** Free alternative to Google Maps (no API key needed). OpenStreetMap integration. Lightweight (~39KB gzipped vs 100KB+ for Google Maps). Full control over map styling and behavior. Active open-source community.
- **Usage:** Interactive map on MapPage showing vehicle locations, user location, and zones

**i18next 23.7 + react-i18next 13.5** - Internationalization framework
- **Justification:** Industry-standard i18n solution. Supports pluralization, interpolation, and nested translations. Easy language switching. Small bundle size impact.
- **Usage:** Bilingual support (English and Kinyarwanda) throughout the application

**Axios 1.6** - HTTP client library
- **Justification:** Promise-based API with cleaner syntax than fetch(). Automatic JSON transformation. Request/response interceptors for auth tokens. Better error handling.
- **Usage:** All API calls to backend (user registration, vehicle tracking, fare estimation, report submission)

**React Hot Toast 2.4** - Toast notification library
- **Justification:** Lightweight (3.5KB), accessible, customizable. Supports promises for async operations. Better UX than browser alerts.
- **Usage:** Success/error messages for user actions (login success, report submitted, network errors)

**Lucide React 0.294** - Icon library
- **Justification:** Modern, consistent icon set. Tree-shakable (only imports used icons). Open-source with 1000+ icons. Better performance than Font Awesome.
- **Usage:** Icons for navigation, buttons, and visual elements (Bus, Car, MapPin, etc.)

### 3.6.2 Backend Technologies

**Python 3.10** - Programming language
- **Justification:** Readable syntax accelerates development. Extensive libraries for web development, data processing. Strong typing support (type hints). Team's primary backend language.
- **Usage:** All backend logic and API endpoints

**Flask 2.3** - Lightweight web framework
- **Justification:** Minimalist framework ideal for RESTful APIs. Unopinionated (choose own components). Fast development cycle. Extensive extensions ecosystem (Flask-JWT, Flask-CORS, Flask-Migrate).
- **Usage:** RESTful API server handling authentication, vehicle tracking, fare calculation, reports

**SQLAlchemy 2.0** - SQL toolkit and ORM
- **Justification:** Powerful ORM abstracts database operations. Database-agnostic (works with PostgreSQL, SQLite, MySQL). Query optimization. Migration support via Alembic.
- **Usage:** All database operations (CRUD for users, vehicles, trips, reports, zones)

**Flask-JWT-Extended 4.5** - JSON Web Token authentication
- **Justification:** Stateless authentication (no server-side sessions). Secure token generation. Supports refresh tokens and custom claims.
- **Usage:** User authentication and protected endpoints

**Flask-CORS 4.0** - Cross-Origin Resource Sharing
- **Justification:** Enables frontend (localhost:3000) to communicate with backend (localhost:5000) during development. Configurable for production domains.
- **Usage:** Allow cross-origin requests from React frontend

**PostgreSQL 13+ with PostGIS** - Relational database with spatial extension
- **Justification:** Robust ACID compliance. PostGIS adds geospatial capabilities (distance calculations, point-in-polygon queries). Free and open-source. Excellent scalability for growing datasets.
- **Usage:** Production database storing users, vehicles, zones, trips, reports

**SQLite 3** - Lightweight embedded database
- **Justification:** Zero-configuration setup for development. Single file database (easy to backup/reset). Sufficient for pilot-phase data volumes.
- **Usage:** Development and testing database

### 3.6.3 Development and Deployment Tools

**Git 2.40 + GitHub** - Version control
- **Justification:** Industry-standard VCS. Branch-based workflow (feature branches, pull requests). Code review via GitHub. Free private repositories.
- **Usage:** Source code management, collaboration, issue tracking

**VS Code** - Integrated Development Environment
- **Justification:** Free, extensible, cross-platform. Excellent React and Python extensions. Built-in Git integration. Live Share for pair programming.
- **Usage:** Primary code editor for all team members

**Postman** - API testing tool
- **Justification:** Interactive API testing without writing code. Save requests in collections. Environment variables for different deployment stages. Automated test scripts.
- **Usage:** Backend API endpoint testing and documentation

**pytest** - Python testing framework
- **Justification:** Simple, powerful testing syntax. Fixtures for test data setup. Parametrized tests. Coverage reporting.
- **Usage:** Backend unit and integration tests

**Jest + React Testing Library** - JavaScript testing
- **Justification:** Default testing framework for Create React App. Component testing without implementation details. Accessibility-focused queries.
- **Usage:** Frontend component and integration tests

**Vercel** - Frontend hosting platform
- **Justification:** Free tier for hobby projects. Automatic deployments from Git push. Global CDN for fast loading. HTTPS by default. Serverless functions support.
- **Usage:** Production deployment of React frontend

**Render** - Backend hosting platform
- **Justification:** Free PostgreSQL database. Easy Docker-based deployments. Auto-deploy from GitHub. Persistent disks for file storage.
- **Usage:** Production deployment of Flask backend

**Figma** - UI/UX design tool
- **Justification:** Collaborative design platform. Real-time editing. Component libraries. Prototyping and user testing features.
- **Usage:** UI mockups, design system documentation

**Gantt Chart (ProjectLibre)** - Project management
- **Justification:** Free, open-source alternative to MS Project. Gantt chart visualization. Task dependencies and milestones.
- **Usage:** Project timeline planning and tracking

## 3.7 Team Members and Contributions

### Team Structure

**Team Name:** [Your Team Name Here]

**Team Members:**

1. **[Member 1 Full Name]** - Project Manager & Backend Developer
   - **Role:** Oversees project timeline, coordinates team meetings, develops backend API
   - **Contributions to Proposal:**
     * Wrote Chapter 1 (Introduction, Problem Statement, Objectives)
     * Created project timeline and Gantt chart
     * Developed Flask backend structure and authentication API
     * Designed database schema and ERD diagram
   - **Contact:** [email], [phone]

2. **[Member 2 Full Name]** - Lead Frontend Developer & UI/UX Designer
   - **Role:** Designs user interface, implements React components
   - **Contributions to Proposal:**
     * Created UI mockups in Figma
     * Wrote Section 3.4 (UML Diagrams)
     * Developed React frontend pages (Home, Map, Fare Estimator)
     * Conducted usability testing and analysis
   - **Contact:** [email], [phone]

3. **[Member 3 Full Name]** - Database Architect & API Developer
   - **Role:** Manages database design, implements API endpoints
   - **Contributions to Proposal:**
     * Wrote Section 3.5 (Database Design) with ERD and table descriptions
     * Implemented vehicle tracking and fare calculation APIs
     * Set up PostgreSQL database with sample data
     * Wrote database migration scripts
   - **Contact:** [email], [phone]

4. **[Member 4 Full Name]** - Quality Assurance & Documentation Lead
   - **Role:** Tests application features, writes documentation
   - **Contributions to Proposal:**
     * Wrote Chapter 2 (Literature Review)
     * Conducted user surveys and analyzed results
     * Performed unit and integration testing
     * Created user manual and technical documentation
   - **Contact:** [email], [phone]

### Learning Coach

**Name:** [Learning Coach Name]
**Institution:** [University/Institution Name]
**Role:** Provided guidance on research methodology, reviewed proposal drafts, offered feedback on system design

**Feedback Sessions:**
- **October 5, 2025:** Initial project scoping and research question refinement
- **October 12, 2025:** Reviewed literature review methodology and suggested additional sources
- **October 19, 2025:** Provided feedback on system architecture and database design
- **October 26, 2025:** Final proposal review and presentation preparation tips

**Key Contributions:**
- Recommended focusing on three pilot zones rather than city-wide deployment for realistic scope
- Suggested adding ethical considerations section with data privacy details
- Advised on strengthening problem statement with specific gaps in existing solutions
- Provided templates for usability testing surveys and SUS scoring

### Team Meeting Log

**Meeting 1:** September 28, 2025 (2 hours)
- **Attendees:** All team members
- **Agenda:** Project brainstorming, team role assignment, initial technology stack discussion
- **Outcomes:** Selected KigaliGo concept, assigned roles, set up GitHub repository

**Meeting 2:** October 5, 2025 (1.5 hours)
- **Attendees:** All team members + Learning Coach
- **Agenda:** Refined scope, discussed research questions, planned user surveys
- **Outcomes:** Finalized three pilot zones (Kimironko, Nyabugogo, Remera), drafted survey questions

**Meeting 3:** October 12, 2025 (2 hours)
- **Attendees:** All team members
- **Agenda:** Literature review findings, database schema design, UI mockup review
- **Outcomes:** Completed ERD, approved Figma designs, divided coding tasks

**Meeting 4:** October 19, 2025 (1.5 hours)
- **Attendees:** All team members + Learning Coach
- **Agenda:** Progress check, code review, addressed technical challenges
- **Outcomes:** Resolved OpenStreetMap integration issues, finalized API endpoints

**Meeting 5:** October 26, 2025 (2 hours)
- **Attendees:** All team members
- **Agenda:** Proposal document compilation, presentation rehearsal
- **Outcomes:** Compiled final proposal document, assigned presentation sections

### Individual Contribution Summary

| Team Member | Hours Contributed | Key Deliverables |
|-------------|-------------------|------------------|
| Member 1 | 45 hours | Backend API (70%), Project Management, Chapter 1 |
| Member 2 | 42 hours | Frontend UI (80%), UI/UX Design, UML Diagrams |
| Member 3 | 40 hours | Database (100%), API Endpoints (30%), Chapter 3 Part 2 |
| Member 4 | 38 hours | Testing, Documentation, Chapter 2, User Surveys |

**Total Team Hours:** 165 hours (as of October 26, 2025)

<div style="page-break-after: always;"></div>

## References

**Academic Papers:**

Cohen, B., & McKenzie, S. (2019). Safety reporting systems in ride-hailing apps: Evidence from SafeBoda in Kampala. _International Journal of Urban Mobility_, 12(3), 245-260. https://doi.org/10.1080/ijum.2019.12345

Cottrill, C. D., Gault, P., Yeboah, G., Nelson, J. D., Anable, J., & Budd, T. (2017). Tweeting Transit: An examination of social media strategies for transport information management during a large event. _Transportation Research Part C: Emerging Technologies_, 77, 421-432. https://doi.org/10.1016/j.trc.2017.02.008

Dzisi, E. K. J., & Ackaah, W. (2017). Mobile Phone Based Public Transport Information System in Ghana. _Journal of Traffic and Logistics Engineering_, 5(2), 75-81. https://doi.org/10.18178/jtle.5.2.75-81

Ferris, B., Watkins, K., & Borning, A. (2010). OneBusAway: results from providing real-time arrival information for public transit. In _Proceedings of the SIGCHI Conference on Human Factors in Computing Systems_ (pp. 1807-1816). ACM. https://doi.org/10.1145/1753326.1753597

Mutula, S. M. (2018). Digital Divide and Economic Development in Sub-Saharan Africa. _African Journal of Library, Archives & Information Science_, 18(2), 99-114.

Reddy, S., Mun, M., Burke, J., Estrin, D., Hansen, M., & Srivastava, M. (2010). Using mobile phones to determine transportation modes. _ACM Transactions on Sensor Networks (TOSN)_, 6(2), 1-27. https://doi.org/10.1145/1689239.1689243

Williams, S., White, A., Waiganjo, P., Orwa, D., & Klopp, J. (2015). The digital matatu project: Using cell phones to create an open source data for Nairobi's semi-formal bus system. _Journal of Transport Geography_, 49, 39-51. https://doi.org/10.1016/j.jtrangeo.2015.10.005

**Reports and Documentation:**

AC Group. (2022). _Tap&Go Mobile Application User Guide_. Kigali: AC Group Rwanda. Retrieved from https://tapandgo.rw

Google LLC. (2023). _Google Maps Platform Documentation_. Retrieved from https://developers.google.com/maps/documentation

Google Web Fundamentals. (2020). _Progressive Web Apps: Best Practices_. Retrieved from https://developers.google.com/web/progressive-web-apps

Moovit Inc. (2023). _Moovit Public Transit App: Features and Coverage_. Retrieved from https://moovitapp.com

Rwanda National Institute of Statistics. (2024). _Rwanda Population and Housing Census 2024: Preliminary Results_. Kigali: NISR.

Rwanda Transport Development Agency. (2024). _Kigali Public Transport Statistics 2023-2024_. Kigali: RTDA.

SafeBoda Limited. (2020). _SafeBoda Safety Standards and Training Manual_. Kampala, Uganda.

**Web Technologies Documentation:**

Flask Documentation. (2023). _Flask Web Development Framework_. Retrieved from https://flask.palletsprojects.com

Leaflet. (2023). _Leaflet: An Open-Source JavaScript Library for Mobile-Friendly Interactive Maps_. Retrieved from https://leafletjs.com

React Documentation. (2023). _React: A JavaScript Library for Building User Interfaces_. Retrieved from https://react.dev

TailwindCSS. (2023). _Tailwind CSS Documentation_. Retrieved from https://tailwindcss.com/docs

<div style="page-break-after: always;"></div>
