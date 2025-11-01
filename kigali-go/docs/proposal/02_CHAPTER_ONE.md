# CHAPTER ONE: INTRODUCTION

## 1.1 Introduction and Background

Kigali, the capital city of Rwanda, has experienced rapid urbanization over the past decade, with the population growing from 859,332 in 2012 to over 1.2 million in 2024 (Rwanda National Institute of Statistics, 2024). This population growth has increased demand for public transportation, with approximately 400,000 daily passenger trips recorded across the city's bus, taxi, and motorcycle taxi networks. The public transport sector in Kigali comprises multiple modes: government-regulated Tap&Go buses operating on fixed routes, shared taxis serving specific zones, and motorcycle taxis (motos) providing door-to-door service. Despite improvements in infrastructure, passengers face persistent challenges including unpredictable arrival times, lack of route information, fare ambiguity, and limited real-time tracking capabilities.

Traditionally, passengers rely on informal information-sharing mechanisms to navigate Kigali's transport network. Commuters ask fellow travelers for directions, memorize common routes through repeated trips, and negotiate fares based on estimated distances. Physical route maps exist at major bus terminals, but they are often outdated and do not reflect real-time vehicle locations. This traditional approach is time-consuming, creates information asymmetry favoring operators over passengers, and contributes to fare disputes. Software-based approaches have transformed urban mobility in cities worldwide through applications like Google Maps, Moovit, and Citymapper. However, these international solutions are poorly adapted to Kigali's context—they lack comprehensive data on local transport modes, do not account for Rwanda's unique fare structures with peak-hour pricing and zone-based rates, and require constant internet connectivity which is not always available in peripheral areas of Kigali.

## 1.2 Problem Statement

While international transport applications exist, two notable systems come closest to addressing Kigali's needs. First, Google Maps (Google LLC, 2023) provides basic transit directions in Kigali but only covers major bus routes and lacks integration with taxis and motos. Its fare estimates are inaccurate because they do not reflect Rwanda's zone-based pricing system, peak-hour multipliers, or the distinction between government-regulated and private operator fares. Second, Tap&Go Mobile App (AC Group, 2022), developed by the primary bus operator in Kigali, offers bus-specific features including balance checking and route information. However, it is limited to Tap&Go buses only, excluding the majority of public transport users who rely on taxis and motos. The app does not provide multi-modal route planning, fare comparisons across transport modes, or safety reporting features.

The gap that KigaliGo addresses is the absence of a comprehensive, passenger-centric mobile solution that integrates all transport modes (buses, taxis, and motos), provides accurate fare estimation based on Rwanda's official tariff structures, supports offline functionality for areas with poor connectivity, offers bilingual interface (English and Kinyarwanda) to serve Rwanda's diverse population, and includes safety and feedback mechanisms to improve service quality. Additionally, existing solutions do not empower passengers with transparent pricing information or provide a platform for reporting overcharging and safety incidents, which are common complaints in Kigali's transport sector.

## 1.3 Project's Main Objective

To develop a Progressive Web Application (PWA) that empowers Kigali passengers with comprehensive transport information, accurate fare estimation, real-time vehicle tracking, and safety reporting capabilities across all transport modes (buses, taxis, and motorcycle taxis) in order to improve commuting efficiency, reduce fare disputes, and enhance passenger safety.

### 1.3.1 Specific Objectives

The following specific objectives are designed to be SMART (Specific, Measurable, Achievable, Relevant, and Time-bound):

**Objective 1:** To conduct a comprehensive literature review of existing transport applications and collect baseline data on passenger challenges in Kigali through surveys of at least 100 commuters in three major zones (Kimironko, Nyabugogo, and Remera) by Week 4 of the project timeline.

**Objective 2:** To design and develop a fully functional Progressive Web Application with the following features by Week 10: (a) multi-modal trip planning with route suggestions for buses, taxis, and motos; (b) fare estimation engine implementing Rwanda's official tariff structures including base fares, per-kilometer rates, peak-hour multipliers, and zone-based pricing; (c) interactive map displaying real-time vehicle locations using OpenStreetMap; (d) bilingual user interface supporting English and Kinyarwanda; and (e) passenger safety reporting system for documenting overcharging, safety incidents, and service quality issues.

**Objective 3:** To conduct user acceptance testing with a minimum of 50 participants from the target zones and demonstrate measurable improvements in the following metrics by Week 12: (a) reduce average fare estimation error from ±30% (current manual estimation) to less than 5%; (b) decrease average trip planning time from 15 minutes (asking for directions) to under 2 minutes; (c) achieve a System Usability Scale (SUS) score above 70; and (d) collect at least 30 verified safety/feedback reports to demonstrate user engagement with the reporting feature.

## 1.4 Research Questions

1. What are the primary challenges faced by passengers when using public transport in Kigali, and how do these challenges vary across different demographic groups (age, language proficiency, transport mode preference)?

2. How can accurate fare estimation be achieved in a multi-modal transport system with complex pricing structures including time-based multipliers and zone-specific rates?

3. What design principles and user interface features are most effective for creating an accessible transport application for users with varying levels of digital literacy in Kigali?

4. To what extent can a Progressive Web Application with offline capabilities improve transport accessibility for passengers in areas with unreliable internet connectivity?

5. How does real-time vehicle tracking and transparent fare information impact passenger trust and satisfaction with public transport services?

## 1.5 Project Scope

**Geographical Scope:** The initial deployment of KigaliGo will focus on three high-traffic zones in Kigali: Kimironko (Gasabo District), Nyabugogo (Nyarugenge District), and Remera (Gasabo District). These zones collectively serve over 120,000 daily commuters and represent diverse transport patterns including residential, commercial, and transit hub areas. Vehicle tracking data will be collected for routes operating within and between these zones. The choice of these three zones is realistic for a 12-week development timeline and allows for meaningful data collection while avoiding the complexity of city-wide deployment.

**Target Users:** The application targets 50-150 active users during the pilot phase, including university students, working professionals, and market vendors who regularly use public transport. This sample size is achievable within the project timeframe and sufficient for collecting meaningful usability and effectiveness data.

**Technical Scope:** The system will be developed as a responsive Progressive Web Application accessible via mobile browsers (Chrome, Firefox, Safari) on Android and iOS devices, eliminating the need for app store deployment during the pilot phase.

### Project Scope (Inclusions):

The KigaliGo application will include the following features and functionalities:

**Core Features:**
1. **Trip Planning Module:** Users can input origin and destination locations (via address search, map selection, or current location) and receive multi-modal route suggestions. Each route option displays transport mode (bus/taxi/moto), estimated distance, duration, and fare.

2. **Fare Estimation Engine:** Implements Rwanda's official fare structure with base fares (RWF 500 for buses, RWF 800 for motos, RWF 1,200 for taxis), per-kilometer rates (RWF 150/km for buses, RWF 300/km for motos, RWF 400/km for taxis), peak-hour multipliers (1.2x during 7:00-9:00 AM and 5:00-7:00 PM), and night-time rates (1.3x from 10:00 PM to 6:00 AM). The engine calculates fares based on straight-line distance plus a 1.3x road-network factor.

3. **Interactive Map with Real-Time Tracking:** OpenStreetMap-based interface displaying vehicle locations updated every 30 seconds (simulated during pilot phase), passenger's current location with 5km radius circle, nearby vehicles color-coded by type (blue for buses, green for taxis, yellow for motos), and clickable markers showing vehicle registration, operator, distance from user, and estimated arrival time.

4. **Safety and Feedback Reporting:** Passengers can submit reports with categories (overcharging, safety concern, service quality, other), title and description fields, optional location tagging, optional photo upload, and vehicle registration number. Reports are stored in a database with timestamp, status tracking (pending/in-review/resolved), and admin response capability.

5. **User Profile Management:** User registration with name, email/phone, and preferred language, profile editing and password management, trip history display, and saved locations (home, work).

6. **Bilingual Support:** Complete interface translation in English and Kinyarwanda, language toggle in settings, and culturally appropriate design elements inspired by Imigongo art patterns.

7. **Offline Functionality:** Service worker caching of core application assets, offline-capable trip planning with last-known data, and queue-based report submission that syncs when connectivity is restored.

**Technical Deliverables:**
- Fully functional Progressive Web Application (frontend)
- RESTful API backend with comprehensive endpoints
- SQLite database (pilot) / PostgreSQL database (production)
- API documentation with usage examples
- User manual with screenshots
- Technical documentation including system architecture, database schema, and deployment guide

**Non-Technical Deliverables:**
- Literature review report with analysis of existing systems
- User survey results and data analysis
- Usability testing report with SUS scores and feedback analysis
- Final project presentation
- Academic poster for research showcase

### Project Scope (Exclusions):

To maintain realistic boundaries, the following are **excluded** from the project:

1. **Real-time GPS tracking of actual vehicles:** Due to lack of access to operator fleet management systems, vehicle tracking will use simulated data during the pilot phase.

2. **Payment integration:** The application provides fare estimates only; actual payment transactions (mobile money, credit cards) are not included.

3. **Driver/operator dashboard:** The focus is solely on the passenger experience; driver interfaces for trip acceptance or navigation are excluded.

4. **Native mobile applications:** iOS and Android native apps are excluded; the PWA approach covers mobile users through browsers.

5. **City-wide deployment:** Full coverage of all Kigali routes and zones is excluded; only the three pilot zones are included.

6. **Admin dashboard with full CRUD operations:** While basic admin response to reports is supported, comprehensive content management system features are excluded.

7. **Advanced analytics and machine learning:** Predictive arrival times using ML models and demand forecasting are excluded from the pilot phase.

### Deliverables:

**Software Deliverables:**
1. KigaliGo Progressive Web Application (accessible via web browser)
2. Backend API server with documented endpoints
3. Database with sample data for 5+ vehicles and 5 zones
4. Source code repository on GitHub with README and setup instructions

**Documentation Deliverables:**
1. System Requirements Specification (SRS) document
2. API Documentation with endpoint descriptions and examples
3. Database Schema with ERD and table descriptions
4. User Manual with step-by-step instructions and screenshots
5. Technical Deployment Guide

**Research Deliverables:**
1. Literature Review Report (15-20 pages)
2. User Survey Analysis Report with charts and statistics
3. Usability Testing Report including SUS scores and qualitative feedback
4. Project Proposal Document (this document)
5. Final Presentation Slides
6. Academic Poster

## 1.6 Significance and Justification

The successful implementation of KigaliGo will have significant impacts on Kigali's transport ecosystem and passenger experience. First, it will empower passengers with transparent, reliable information, reducing the information asymmetry that currently exists between transport operators and commuters. By providing accurate fare estimates before boarding, the application will minimize disputes and create accountability, potentially reducing overcharging incidents by up to 40% based on similar interventions in other cities (Nairobi's Digital Matatu project reduced fare disputes by 35% in pilot zones).

Second, KigaliGo will improve transport efficiency by reducing the time passengers spend seeking route information and waiting for vehicles. Current estimates suggest passengers spend an average of 15 minutes asking for directions and an additional 10-15 minutes waiting at uncertain locations. With real-time tracking and route planning, these inefficiencies can be reduced, potentially saving each commuter 20-30 minutes per day, which translates to 100-150 hours per year per person—time that can be reallocated to productive activities or leisure.

Third, the safety reporting feature will create a feedback loop that encourages improved service quality. When passengers can easily document incidents with photos and location data, transport operators and regulators gain valuable insights into problem areas and repeat offenders. This data-driven approach to service improvement has been shown to reduce safety incidents by 25-30% in cities that implemented similar systems (Kampala's SafeBoda reported 28% reduction in rider complaints within six months of launching their feedback system). Additionally, the aggregated safety data can inform policy decisions by the Rwanda Transport Development Agency and City of Kigali, contributing to evidence-based transport planning.

## 1.7 Ethical Considerations and Guidelines

This project adheres to strict ethical standards in research and software development. **Informed Consent:** All participants in user surveys, interviews, and usability testing will provide written informed consent after receiving clear explanations of the study's purpose, their rights to withdraw at any time, and how their data will be used. Consent forms will be available in both English and Kinyarwanda to ensure full comprehension.

**Data Privacy and Protection:** The application implements multiple privacy safeguards. User accounts are optional—passengers can use core features (trip planning, fare estimation) without registration. For users who choose to create accounts, passwords are hashed using bcrypt with salt rounds, never stored in plain text. Personal information (names, email addresses, phone numbers) is stored securely in the database with restricted access and is never shared with third parties. Safety reports can be submitted anonymously; if users choose to include contact information, it is used solely for follow-up communication and is never publicly displayed. All data transmission between the frontend and backend uses HTTPS encryption. The application complies with Rwanda's Data Protection and Privacy Law (2021) and includes a clear Privacy Policy accessible within the app.

**Integrity and Transparency:** The application clearly communicates its limitations to users. Fare estimates are labeled as "estimated" with disclaimers that actual fares may vary based on traffic, exact route taken, and operator policies. During the pilot phase when vehicle tracking uses simulated data, this is explicitly stated in the interface. The application's source code is open-source (MIT License), allowing public review and community contributions, ensuring transparency in how fare calculations are performed.

**Avoiding Harm:** The system is designed to avoid potential harms. User interface elements use color schemes that are colorblind-accessible. The application includes warnings for users to verify routes and fares with operators before boarding. Safety reporting features include content moderation to prevent harassment or false accusations—reports are reviewed by administrators before being made visible to operators. The system does not share real-time passenger locations with third parties, preventing potential stalking or targeting of users.

## 1.8 Research Timeline

The project follows a 12-week timeline divided into five phases:

**Gantt Chart:**

```
Week    1  2  3  4  5  6  7  8  9  10  11  12
├────┼──┼──┼──┼──┼──┼──┼──┼──┼───┼───┼───┤
Phase 1: Research & Planning
Literature Review           [████████]
User Surveys                    [████]
Requirements Analysis              [████]
─────────────────────────────────────────────
Phase 2: System Design
Database Design                        [████]
UI/UX Design                           [████]
System Architecture                    [████]
─────────────────────────────────────────────
Phase 3: Development
Backend API                               [██████]
Frontend Development                         [██████]
Map Integration                                 [████]
─────────────────────────────────────────────
Phase 4: Testing & Refinement
Unit Testing                                       [████]
Integration Testing                                   [████]
User Acceptance Testing                                  [████]
─────────────────────────────────────────────
Phase 5: Documentation & Deployment
Documentation                                               [████]
Deployment                                                    [██]
Final Presentation                                              [██]
```

**Detailed Timeline:**

- **Weeks 1-4 (Phase 1):** Conduct literature review, design and distribute user surveys, analyze survey data, define system requirements
- **Weeks 4-6 (Phase 2):** Design database schema, create UI mockups, define API endpoints, document system architecture
- **Weeks 6-9 (Phase 3):** Develop backend API, build frontend React components, integrate OpenStreetMap
- **Weeks 9-11 (Phase 4):** Perform unit and integration testing, conduct usability testing with 50 users, implement feedback
- **Weeks 11-12 (Phase 5):** Complete documentation, deploy application, prepare final presentation

## 1.9 Feasibility, Innovation, Risk Assessment, and Evaluation Plan

**Feasibility:** The project is technically feasible given the team's expertise in React, Flask, and database design. All required technologies (React, Flask, PostgreSQL, OpenStreetMap) are open-source and well-documented. The 12-week timeline is realistic for developing a functional PWA with core features, though some advanced features (ML-based predictions) are deferred to future phases. Financial feasibility is strong—development costs are minimal as all tools are free, and deployment on platforms like Render (backend) and Vercel (frontend) offers free tiers sufficient for pilot-phase traffic.

**Innovation:** KigaliGo introduces several innovations adapted to Kigali's context: (1) **Multi-modal integration** combining buses, taxis, and motos in a single interface—no existing app covers all three modes; (2) **Offline-first architecture** using PWA service workers to cache critical data, enabling fare estimation even without internet; (3) **Zone-based dynamic pricing engine** that accurately models Rwanda's complex fare structures including peak/night multipliers; (4) **Community-driven safety** reporting that empowers passengers to document incidents with photos and GPS coordinates; (5) **Cultural localization** with Kinyarwanda language support and Imigongo-inspired design elements that resonate with Rwandan users.

**Risk Assessment:** Key risks include: (1) **Data availability risk** (High impact, Medium probability)—inability to access real-time vehicle GPS data from operators. Mitigation: Use simulated data during pilot, establish partnerships with operators for future phases. (2) **User adoption risk** (Medium impact, Medium probability)—passengers may prefer traditional methods. Mitigation: Conduct extensive usability testing, offer clear value proposition (time savings, fare transparency). (3) **Technical infrastructure risk** (Medium impact, Low probability)—server downtime or database failures. Mitigation: Implement automated backups, use reliable hosting providers, design for graceful degradation. (4) **Regulatory risk** (High impact, Low probability)—potential concerns from transport regulators about accuracy of information. Mitigation: Engage with Rwanda Transport Development Agency early, clearly label estimates as approximate.

**Evaluation Plan:** Success will be evaluated through quantitative and qualitative metrics. **Quantitative metrics** include: System Usability Scale (SUS) score (target: >70), fare estimation accuracy compared to actual fares (target: <5% error), average trip planning time (target: <2 minutes), number of active users during pilot (target: 50-150), number of safety reports submitted (target: >30). **Qualitative metrics** include: user feedback from interviews about perceived value and ease of use, observations during usability testing sessions, analysis of common user interface issues encountered, and stakeholder feedback from transport operators and regulators. Data will be collected through application analytics, user surveys (pre-test and post-test), and structured interviews. Success criteria are met if SUS score exceeds 70, fare accuracy is within 5%, and at least 60% of test users indicate they would continue using the app beyond the pilot period.

<div style="page-break-after: always;"></div>
