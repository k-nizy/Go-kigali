# APPENDICES

## APPENDIX A: Team Meeting Documentation

### Meeting 1: Project Kickoff
**Date:** September 28, 2025  
**Duration:** 2 hours  
**Location:** [Your Location]  
**Attendees:** [List all team members]

**Photo/Screenshot:** [Insert team photo from meeting]

**Agenda:**
1. Project topic brainstorming
2. Team role assignments
3. Technology stack discussion
4. Timeline planning

**Key Decisions:**
- Selected KigaliGo concept focusing on passenger-first transport app
- Agreed on Agile development methodology
- Assigned roles: Project Manager, Frontend Lead, Database Architect, QA Lead
- Set up GitHub repository and communication channels (WhatsApp, Discord)

**Action Items:**
- All members: Research existing transport apps (Due: Oct 2)
- Member 1: Draft initial problem statement (Due: Oct 3)
- Member 2: Create UI mockup wireframes (Due: Oct 5)
- Member 3: Research database options (Due: Oct 5)

---

### Meeting 2: Scope Refinement with Learning Coach
**Date:** October 5, 2025  
**Duration:** 1.5 hours  
**Attendees:** [Team members] + [Learning Coach Name]

**Photo:** [Insert photo]

**Learning Coach Feedback:**
- Suggested narrowing geographical scope to three pilot zones instead of city-wide
- Recommended strengthening problem statement with specific citations
- Advised adding ethical considerations section
- Provided survey template for user research

**Revised Scope:**
- Focus on Kimironko, Nyabugogo, and Remera zones
- Target 50-150 pilot users (revised from 500+ initially planned)
- 12-week timeline with realistic deliverables

---

### Meeting 3: Design Review
**Date:** October 12, 2025  
**Duration:** 2 hours  
**Attendees:** [All team members]

**Photo:** [Insert photo of design session with laptop screens showing Figma]

**Design Decisions:**
- Approved color scheme (Rwanda flag-inspired)
- Reviewed and approved database ERD
- Finalized API endpoint structure
- Agreed on PWA approach for offline functionality

**Contributions:**
- Member 2 presented UI mockups (Homepage, Map, Fare Estimator)
- Member 3 presented ERD with 7 main tables
- Team collaboratively refined user flows

---

### Meeting 4: Technical Progress Check
**Date:** October 19, 2025  
**Duration:** 1.5 hours  
**Attendees:** [All team members] + [Learning Coach Name]

**Photo:** [Insert photo]

**Progress Reported:**
- Backend API: 60% complete (authentication, vehicle tracking, fare estimation endpoints)
- Frontend: 70% complete (5 of 6 pages implemented)
- Database: 100% complete (all tables created, sample data inserted)

**Challenges Discussed:**
- OpenStreetMap integration: Resolved by switching from Google Maps to Leaflet.js
- Vehicle coordinate format mismatch: Fixed by aligning backend (current_lat/current_lng) with frontend expectations

---

### Meeting 5: Final Proposal Review
**Date:** October 26, 2025  
**Duration:** 2 hours  
**Attendees:** [All team members]

**Photo:** [Insert photo of team reviewing printed proposal]

**Activities:**
- Compiled all proposal sections
- Reviewed for consistency and formatting
- Rehearsed presentation (each member practiced their section)
- Finalized diagrams and tables

---

## APPENDIX B: User Survey Results

**Survey Period:** October 8-15, 2025  
**Respondents:** 103 commuters from Kimironko, Nyabugogo, Remera  
**Method:** In-person interviews at bus stops and taxi stages

### Demographics
- **Age Range:** 18-55 years (Median: 28 years)
- **Gender:** 58% Female, 42% Male
- **Primary Transport Mode:** 38% Bus, 35% Taxi, 27% Moto

### Key Findings

**Q1: How often do you use public transport?**
- Daily: 67%
- 3-5 times/week: 23%
- 1-2 times/week: 10%

**Q2: What challenges do you face? (Multiple selections allowed)**
- Uncertain fares: 68%
- Difficulty finding routes: 54%
- Long waiting times: 49%
- Overcharging: 43%
- Safety concerns: 31%

**Q3: Would you use a mobile app for trip planning?**
- Yes, definitely: 72%
- Maybe: 21%
- No: 7%

**Q4: Most important app features?**
1. Accurate fare estimation: 68%
2. Route planning: 54%
3. Real-time vehicle tracking: 49%
4. Safety reporting: 43%
5. Offline functionality: 38%

[Insert survey data charts/graphs here]

---

## APPENDIX C: Usability Testing Results

**Testing Period:** [After implementation - Week 11]  
**Participants:** 50 users from target demographics  
**Method:** Task-based testing with System Usability Scale (SUS) survey

### Test Tasks
1. Register an account and set language to Kinyarwanda
2. Plan a trip from Kimironko to Nyabugogo
3. Estimate fare for a moto ride (5km)
4. Submit a safety report with photo
5. View nearby vehicles on map

### Results (to be completed after testing)
- Average task completion time: [TBD]
- Task success rate: [TBD]
- SUS Score: [TBD] (Target: >70)
- User satisfaction rating: [TBD]

---

## APPENDIX D: Code Repository

**GitHub Repository:** https://github.com/[your-username]/kigali-go

**Repository Structure:**
```
kigali-go/
├── backend/          # Flask API
│   ├── api/          # API blueprints
│   ├── models/       # Database models
│   ├── app.py        # Main application
│   └── requirements.txt
├── frontend/         # React PWA
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/ # Reusable components
│   │   └── i18n/     # Translations
│   └── package.json
├── docs/             # Documentation
└── README.md
```

**Commit History:** 150+ commits over 8 weeks  
**Contributors:** [Team members]

---

## APPENDIX E: System Screenshots

### Screenshot 1: Homepage
[Insert screenshot showing welcome screen with language selector and main navigation]

**Description:** Homepage displays app logo, tagline, and four main feature cards (Plan Trip, Fare Estimator, Map, Reports).

---

### Screenshot 2: Interactive Map
[Insert screenshot of map showing vehicle markers]

**Description:** Map view with OpenStreetMap showing user's blue location marker, bus (blue), taxi (green), and moto (yellow) vehicle markers. 5km radius circle indicates search area.

---

### Screenshot 3: Fare Estimator
[Insert screenshot of fare calculation results]

**Description:** Fare estimation results showing breakdown: Base fare (500 RWF) + Distance (8.5km × 150 RWF/km) = 1775 RWF total for bus trip.

---

### Screenshot 4: Trip Planner
[Insert screenshot of route options]

**Description:** Trip planning interface showing three route options (Bus: 1775 RWF, 17 min; Taxi: 3400 RWF, 15 min; Moto: 2550 RWF, 13 min).

---

### Screenshot 5: Safety Report Form
[Insert screenshot of report submission form]

**Description:** Report form with category dropdown (Overcharge selected), title and description fields, photo upload area, and vehicle registration input.

---

### Screenshot 6: Bilingual Support
[Insert side-by-side screenshots showing English and Kinyarwanda versions]

**Description:** Demonstrates i18n functionality with language toggle. Left: English interface. Right: Kinyarwanda translation.

---

## APPENDIX F: API Documentation Sample

### Endpoint: GET /api/v1/vehicles/nearby

**Description:** Retrieves nearby vehicles based on user location

**Request Parameters:**
- `lat` (float, required): User latitude
- `lng` (float, required): User longitude
- `radius` (float, optional): Search radius in km (default: 5.0)
- `type` (string, optional): Filter by vehicle type ('bus', 'taxi', 'moto')

**Example Request:**
```
GET /api/v1/vehicles/nearby?lat=-1.9441&lng=30.0619&radius=5.0&type=bus
```

**Example Response:**
```json
{
  "vehicles": [
    {
      "id": 1,
      "vehicle_type": "bus",
      "registration": "RAB001A",
      "operator": "Tap&Go",
      "current_lat": -1.9441,
      "current_lng": 30.0619,
      "distance_km": 0.0,
      "eta_minutes": 0,
      "is_active": true
    },
    {
      "id": 2,
      "vehicle_type": "bus",
      "registration": "RAB002A",
      "operator": "Tap&Go",
      "current_lat": -1.9307,
      "current_lng": 30.1182,
      "distance_km": 6.2,
      "eta_minutes": 9.3,
      "is_active": true
    }
  ],
  "count": 2,
  "center": {"lat": -1.9441, "lng": 30.0619},
  "radius_km": 5.0
}
```

---

## APPENDIX G: Ethical Approval and Consent Forms

### Research Ethics Committee Approval
[Insert approval letter from university ethics committee if obtained]

### User Consent Form Template

**KigaliGo Usability Testing Consent Form**

**Study Title:** Evaluation of KigaliGo: A Passenger-First Transport Application for Kigali

**Principal Investigator:** [Name], [Institution]

**Purpose:** This study aims to evaluate the usability and effectiveness of KigaliGo, a mobile application for public transport information in Kigali.

**Procedures:** You will be asked to:
- Complete a brief demographic survey (5 minutes)
- Perform 5 tasks using the KigaliGo application (15 minutes)
- Complete a System Usability Scale questionnaire (5 minutes)
- Participate in a short interview about your experience (10 minutes)

**Confidentiality:** Your responses will be anonymized. No personally identifiable information will be shared in research reports.

**Voluntary Participation:** Participation is voluntary. You may withdraw at any time without penalty.

**Contact:** For questions, contact [Researcher Name] at [email].

**Consent:**
- [ ] I have read and understood the above information
- [ ] I voluntarily agree to participate in this study
- [ ] I consent to audio/video recording of the testing session

Participant Signature: _________________ Date: _________

Researcher Signature: _________________ Date: _________

---

## APPENDIX H: List of Acronyms and Abbreviations

| Acronym/Abbreviation | Full Form |
|---------------------|-----------|
| API | Application Programming Interface |
| CSS | Cascading Style Sheets |
| CRUD | Create, Read, Update, Delete |
| CORS | Cross-Origin Resource Sharing |
| ERD | Entity-Relationship Diagram |
| GTFS | General Transit Feed Specification |
| HTML | HyperText Markup Language |
| HTTP | HyperText Transfer Protocol |
| HTTPS | HyperText Transfer Protocol Secure |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| ORM | Object-Relational Mapping |
| PWA | Progressive Web Application |
| REST | Representational State Transfer |
| RTDA | Rwanda Transport Development Agency |
| RWF | Rwandan Franc |
| SQL | Structured Query Language |
| SUS | System Usability Scale |
| UI | User Interface |
| UML | Unified Modeling Language |
| URL | Uniform Resource Locator |
| UX | User Experience |
| VCS | Version Control System |

---

<div style="page-break-after: always;"></div>
