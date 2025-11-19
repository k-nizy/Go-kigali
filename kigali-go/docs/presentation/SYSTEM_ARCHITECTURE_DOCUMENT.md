# System Architecture Document - KigaliGo

## 1. Executive Summary

KigaliGo is a comprehensive smart urban mobility platform designed to revolutionize public transportation in Kigali, Rwanda. The system provides real-time vehicle tracking, multi-modal trip planning, fare estimation, and safety reporting through a Progressive Web Application (PWA) architecture.

## 2. System Overview

### 2.1 Purpose
- Provide real-time public transportation information
- Enable seamless multi-modal trip planning
- Support scalable urban mobility solutions
- Enable multi-modal trip planning (buses, taxis, walking)
- Offer accurate fare estimation
- Enhance passenger safety through reporting systems
- Support bilingual accessibility (English/Kinyarwanda)

### 2.2 Scope
- Passenger-facing mobile web application
- Real-time vehicle tracking and monitoring
- Route planning and navigation
- Fare calculation and estimation
- Safety incident reporting
- User account management
- Administrative dashboard

## 3. Architecture Principles

### 3.1 Design Principles
- **Mobile-First**: Progressive Web App optimized for mobile devices
- **Offline Capability**: Service workers enable offline functionality
- **Scalability**: Microservices-ready architecture
- **Accessibility**: WCAG AA compliance, bilingual support
- **Performance**: Sub-2 second load times, optimized queries
- **Security**: JWT authentication, data encryption

### 3.2 Technical Principles
- **API-First**: RESTful API with OpenAPI documentation
- **Data-Driven**: PostGIS for geospatial operations
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Internationalization**: Built-in i18n support

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Layer  │    │  Application    │    │   Data Layer    │
│                 │    │     Layer       │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ React PWA   │ │◄──►│ │ Flask API   │ │◄──►│ │ PostgreSQL  │ │
│ │ (Frontend)  │ │    │ │ (Backend)   │ │    │ │ + PostGIS   │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Service     │ │    │ │ Auth        │ │    │ │ Cache       │ │
│ │ Workers     │ │    │ │ Service     │ │    │ │ (Redis)     │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 4.2 Component Architecture

#### 4.2.1 Frontend Components
- **Progressive Web App**: React 18 + Vite
- **UI Framework**: TailwindCSS + Custom Design System
- **State Management**: React Context API
- **Maps Integration**: Google Maps API + Leaflet
- **Internationalization**: react-i18next
- **Offline Support**: Workbox Service Workers

#### 4.2.2 Backend Components
- **API Framework**: Flask + Flask-RESTful
- **Authentication**: JWT + bcrypt
- **Database ORM**: SQLAlchemy
- **Geospatial Engine**: PostGIS
- **Migration System**: Flask-Migrate
- **API Documentation**: OpenAPI/Swagger

#### 4.2.3 Data Layer Components
- **Primary Database**: PostgreSQL 14+
- **Spatial Extension**: PostGIS 3.3+
- **Caching Layer**: Redis (planned)
- **File Storage**: Cloud storage (AWS S3/CloudFront)

## 5. Data Flow Architecture

### 5.1 User Request Flow

```
User → PWA → Service Worker → API Gateway → Flask API → Business Logic → Database → Response
```

### 5.2 Real-time Data Flow

```
GPS Devices → Data Ingestion → Processing → PostGIS → WebSocket → PWA → User Interface
```

### 5.3 Offline Data Flow

```
PWA → Service Worker → Cache Storage → IndexedDB → Synchronization → API → Database
```

## 6. Security Architecture

### 6.1 Authentication & Authorization
- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control (RBAC)
- **Password Security**: bcrypt hashing with salt
- **Session Management**: Secure HTTP cookies

### 6.2 Data Protection
- **Transport Security**: HTTPS/TLS 1.3
- **Data Encryption**: AES-256 for sensitive data
- **API Security**: Rate limiting, CORS configuration
- **Input Validation**: Comprehensive input sanitization

## 7. Deployment Architecture

### 7.1 Production Environment

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │    Render       │    │   Cloud DB      │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ React PWA   │ │    │ │ Flask API   │ │    │ │ PostgreSQL  │ │
│ │ (CDN)       │ │    │ │ (Container) │ │    │ │ (Managed)   │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 7.2 Development Environment
- **Local Development**: Docker Compose
- **Version Control**: Git with feature branches
- **CI/CD**: GitHub Actions (planned)
- **Environment Management**: .env configuration

## 8. Integration Architecture

### 8.1 External Integrations
- **Google Maps API**: Mapping and geocoding
- **Payment Systems**: MTN Mobile Money (Phase 2)
- **Notification Services**: Push notifications (Phase 2)
- **Analytics**: User behavior tracking

### 8.2 Internal Integrations
- **Frontend ↔ Backend**: RESTful API
- **Backend ↔ Database**: SQLAlchemy ORM
- **Components**: React Context for state management

## 9. Performance Architecture

### 9.1 Caching Strategy
- **Browser Cache**: Service Worker caching
- **API Cache**: Redis for frequent queries
- **Database Cache**: Query result caching
- **CDN**: Static asset distribution

### 9.2 Optimization Techniques
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format, responsive images
- **Database Indexing**: GIST indexes for spatial queries
- **API Optimization**: Pagination, field selection

## 10. Monitoring & Observability

### 10.1 Application Monitoring
- **Performance Metrics**: Response times, error rates
- **User Analytics**: Feature usage, session duration
- **System Health**: Database connections, API availability

### 10.2 Logging Strategy
- **Application Logs**: Structured JSON logging
- **Error Tracking**: Sentry integration (planned)
- **Audit Logs**: User actions, system changes

## 11. Scalability Considerations

### 11.1 Horizontal Scaling
- **Frontend**: CDN distribution, edge caching
- **Backend**: Container orchestration (Kubernetes ready)
- **Database**: Read replicas, connection pooling

### 11.2 Vertical Scaling
- **Resource Optimization**: Memory management
- **Query Optimization**: Database tuning
- **Code Optimization**: Algorithm efficiency

## 12. Disaster Recovery & Business Continuity

### 12.1 Backup Strategy
- **Database Backups**: Daily automated backups
- **Code Repositories**: Git with multiple remotes
- **Configuration**: Infrastructure as Code

### 12.2 Recovery Procedures
- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 1 hour
- **Failover Testing**: Monthly disaster recovery tests

## 13. Technology Justification

### 13.1 Frontend Technology Choices
- **React**: Component-based architecture, ecosystem
- **PWA**: Offline capability, app-like experience
- **TailwindCSS**: Rapid development, consistency
- **Vite**: Fast development, modern tooling

### 13.2 Backend Technology Choices
- **Flask**: Lightweight, flexible, Python ecosystem
- **PostgreSQL**: Reliability, PostGIS support
- **SQLAlchemy**: ORM capabilities, database abstraction

## 14. Future Architecture Evolution

### 14.1 Phase 2 Enhancements
- **Microservices**: Service decomposition
- **Event-Driven Architecture**: Message queues
- **Advanced Analytics**: Data pipeline implementation

### 14.2 Long-term Vision
- **Native Mobile Apps**: React Native
- **AI Integration**: Route optimization, predictive analytics
- **IoT Integration**: Real-time vehicle telemetry

## 15. Architecture Decision Records (ADRs)

### ADR-001: Progressive Web App over Native
**Decision**: Implement PWA instead of native mobile apps
**Rationale**: Cross-platform compatibility, lower maintenance cost
**Consequences**: Limited access to some native features

### ADR-002: PostgreSQL with PostGIS
**Decision**: Use PostgreSQL with PostGIS for spatial data
**Rationale**: Advanced geospatial capabilities, open source
**Consequences**: Learning curve for team members

### ADR-003: Flask over Django
**Decision**: Use Flask instead of Django
**Rationale**: Lightweight, more flexibility for API design
**Consequences**: More boilerplate code for common features

## 16. Compliance & Standards

### 16.1 Technical Standards
- **API Design**: OpenAPI 3.0 specification
- **Code Quality**: ESLint, Prettier, PEP 8
- **Testing**: Jest, pytest, minimum 70% coverage

### 16.2 Accessibility Standards
- **WCAG 2.1 AA**: Color contrast, keyboard navigation
- **Screen Reader Support**: ARIA labels, semantic HTML
- **Mobile Accessibility**: Touch targets, viewport configuration

## 17. Documentation Architecture

### 17.1 Technical Documentation
- **API Documentation**: OpenAPI/Swagger
- **Code Documentation**: Inline comments, README files
- **Architecture Documentation**: This document, diagrams

### 17.2 User Documentation
- **User Guide**: Feature explanations, tutorials
- **FAQ**: Common questions and answers
- **Support Documentation**: Troubleshooting guides

---

**Document Version**: 1.0  
**Last Updated**: November 2025  
**Next Review**: December 2025  
**Maintained By**: System Architecture Team
