# Technical Specifications Document - KigaliGo

## 1. Introduction

### 1.1 Document Purpose
This Technical Specifications Document provides detailed technical requirements, implementation guidelines, and system specifications for the KigaliGo smart urban mobility platform.

### 1.2 Scope
This document covers:
- Functional specifications
- Non-functional requirements
- API specifications
- Database specifications
- Integration specifications
- Performance requirements
- Security specifications

## 2. Functional Specifications

### 2.1 User Management System

#### 2.1.1 User Registration
**Description**: New user account creation with email/phone verification

**Functional Requirements**:
- FR-UM-001: Users shall register with email or phone number
- FR-UM-002: System shall validate email format and phone number format
- FR-UM-003: System shall send verification code to email/phone
- FR-UM-004: Users shall verify their account within 24 hours
- FR-UM-005: System shall support bilingual registration (English/Kinyarwanda)

**Technical Implementation**:
```python
# User Registration API Endpoint
POST /api/auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "preferred_language": "en|rw"
}
```

#### 2.1.2 User Authentication
**Description**: Secure user login and session management

**Functional Requirements**:
- FR-UM-006: Users shall authenticate with email/phone and password
- FR-UM-007: System shall implement JWT token-based authentication
- FR-UM-008: Tokens shall expire after 24 hours
- FR-UM-009: System shall support refresh token mechanism
- FR-UM-010: Failed login attempts shall be limited to 5 per 15 minutes

**Technical Implementation**:
```python
# Authentication API Endpoint
POST /api/auth/login
Content-Type: application/json

{
  "email_or_phone": "string",
  "password": "string"
}

# Response
{
  "access_token": "string",
  "refresh_token": "string",
  "user": {
    "id": "integer",
    "name": "string",
    "email": "string"
  }
}
```

### 2.2 Trip Planning System

#### 2.2.1 Route Calculation
**Description**: Multi-modal route planning with real-time data

**Functional Requirements**:
- FR-TP-001: System shall calculate routes for bus, taxi, and walking modes
- FR-TP-002: System shall provide combined modal routes
- FR-TP-003: Route calculation shall complete within 3 seconds
- FR-TP-004: System shall consider real-time traffic conditions
- FR-TP-005: Routes shall include step-by-step directions

**Technical Implementation**:
```python
# Route Planning API Endpoint
POST /api/routes/plan
Content-Type: application/json
Authorization: Bearer <token>

{
  "origin": {
    "lat": "float",
    "lng": "float",
    "address": "string"
  },
  "destination": {
    "lat": "float", 
    "lng": "float",
    "address": "string"
  },
  "modes": ["bus", "taxi", "walking"],
  "preferences": {
    "avoid_tolls": "boolean",
    "prefer_faster": "boolean",
    "max_walking_distance": "integer"
  }
}
```

#### 2.2.2 Fare Estimation
**Description**: Accurate fare calculation for different transport modes

**Functional Requirements**:
- FR-TP-006: System shall calculate fares for buses, taxis, and motorcycles
- FR-TP-007: Fare calculation shall consider distance, time, and mode
- FR-TP-008: System shall support Tap&Go fare integration
- FR-TP-009: Fare estimates shall be accurate within ±10%
- FR-TP-010: System shall display fare breakdown

**Technical Implementation**:
```python
# Fare Calculation API Endpoint
POST /api/fares/calculate
Content-Type: application/json

{
  "distance_km": "float",
  "duration_minutes": "float",
  "mode": "bus|taxi|moto",
  "route_zones": ["integer"]
}

# Response
{
  "estimated_fare": "float",
  "currency": "RWF",
  "breakdown": {
    "base_fare": "float",
    "distance_fare": "float",
    "time_fare": "float",
    "surcharges": "float"
  }
}
```

### 2.3 Real-time Tracking System

#### 2.3.1 Vehicle Location Tracking
**Description**: Real-time vehicle position monitoring

**Functional Requirements**:
- FR-RT-001: System shall receive GPS updates from vehicles every 10 seconds
- FR-RT-002: Vehicle positions shall be accurate within 10 meters
- FR-RT-003: System shall store location history for 24 hours
- FR-RT-004: Map shall update vehicle positions in real-time
- FR-RT-005: System shall handle 1000+ concurrent vehicle updates

**Technical Implementation**:
```python
# Vehicle Location Update API Endpoint
POST /api/vehicles/{vehicle_id}/location
Content-Type: application/json
Authorization: Bearer <vehicle_token>

{
  "latitude": "float",
  "longitude": "float",
  "timestamp": "ISO8601",
  "speed": "float",
  "heading": "float",
  "accuracy": "float"
}
```

#### 2.3.2 ETA Calculation
**Description**: Estimated time of arrival calculations

**Functional Requirements**:
- FR-RT-006: System shall calculate ETA for nearby vehicles
- FR-RT-007: ETA shall consider current traffic conditions
- FR-RT-008: ETA accuracy shall be within ±2 minutes
- FR-RT-009: System shall update ETA every 30 seconds

### 2.4 Safety Reporting System

#### 2.4.1 Incident Reporting
**Description**: User-reported safety incidents

**Functional Requirements**:
- FR-SR-001: Users shall report safety incidents anonymously
- FR-SR-002: Reports shall include location, time, and incident type
- FR-SR-003: System shall support photo/video evidence
- FR-SR-004: Reports shall be categorized by severity level
- FR-SR-005: System shall notify relevant authorities for severe incidents

**Technical Implementation**:
```python
# Safety Report API Endpoint
POST /api/reports/safety
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "incident_type": "harassment|theft|accident|other",
  "severity": "low|medium|high|critical",
  "location": {
    "lat": "float",
    "lng": "float",
    "address": "string"
  },
  "description": "string",
  "evidence": ["file"],
  "anonymous": "boolean"
}
```

## 3. Non-Functional Requirements

### 3.1 Performance Requirements

#### 3.1.1 Response Time Requirements
- NFR-PERF-001: API response time < 500ms for 95% of requests
- NFR-PERF-002: Page load time < 2 seconds on 3G networks
- NFR-PERF-003: Map rendering time < 1 second
- NFR-PERF-004: Route calculation time < 3 seconds

#### 3.1.2 Throughput Requirements
- NFR-PERF-005: System shall handle 1000 concurrent users
- NFR-PERF-006: System shall process 10000 API requests per minute
- NFR-PERF-007: Database shall handle 5000 transactions per second

#### 3.1.3 Scalability Requirements
- NFR-PERF-008: System shall scale horizontally to handle 10x load
- NFR-PERF-009: Database shall support read replicas for scaling
- NFR-PERF-010: CDN shall distribute static assets globally

### 3.2 Availability Requirements

#### 3.2.1 Uptime Requirements
- NFR-AVAIL-001: System availability ≥ 99.5%
- NFR-AVAIL-002: API availability ≥ 99.9%
- NFR-AVAIL-003: Database availability ≥ 99.95%
- NFR-AVAIL-004: Maximum downtime per month: 3.6 hours

#### 3.2.2 Recovery Requirements
- NFR-AVAIL-005: Recovery Time Objective (RTO): 4 hours
- NFR-AVAIL-006: Recovery Point Objective (RPO): 1 hour
- NFR-AVAIL-007: Backup frequency: Daily automated backups

### 3.3 Security Requirements

#### 3.3.1 Authentication & Authorization
- NFR-SEC-001: Passwords shall be hashed using bcrypt with minimum 12 rounds
- NFR-SEC-002: JWT tokens shall use RS256 signing algorithm
- NFR-SEC-003: API shall implement rate limiting: 100 requests/minute/user
- NFR-SEC-004: Sessions shall timeout after 24 hours of inactivity

#### 3.3.2 Data Protection
- NFR-SEC-005: All data transmission shall use TLS 1.3
- NFR-SEC-006: Sensitive data shall be encrypted at rest using AES-256
- NFR-SEC-007: Personal data shall be pseudonymized in analytics
- NFR-SEC-008: System shall comply with GDPR data protection principles

#### 3.3.3 Input Validation
- NFR-SEC-009: All user inputs shall be validated and sanitized
- NFR-SEC-010: SQL injection protection through parameterized queries
- NFR-SEC-011: XSS protection through output encoding
- NFR-SEC-012: CSRF protection for state-changing operations

### 3.4 Usability Requirements

#### 3.4.1 Accessibility
- NFR-USE-001: WCAG 2.1 AA compliance
- NFR-USE-002: Screen reader compatibility
- NFR-USE-003: Keyboard navigation support
- NFR-USE-004: Color contrast ratio ≥ 4.5:1

#### 3.4.2 Internationalization
- NFR-USE-005: Support for English and Kinyarwanda
- NFR-USE-006: RTL language support capability
- NFR-USE-007: Date/time formatting per locale
- NFR-USE-008: Currency formatting per locale

## 4. API Specifications

### 4.1 API Design Principles

#### 4.1.1 RESTful Design
- Resources identified by URIs
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Stateless communication
- HATEOAS for navigation

#### 4.1.2 Response Format
- JSON response format
- Consistent error response structure
- HTTP status codes for results
- API versioning in URL path

### 4.2 Core API Endpoints

#### 4.2.1 Authentication Endpoints
```python
# User Registration
POST /api/v1/auth/register

# User Login
POST /api/v1/auth/login

# Token Refresh
POST /api/v1/auth/refresh

# Logout
POST /api/v1/auth/logout

# Password Reset
POST /api/v1/auth/reset-password
```

#### 4.2.2 User Management Endpoints
```python
# Get User Profile
GET /api/v1/users/me

# Update User Profile
PUT /api/v1/users/me

# Delete User Account
DELETE /api/v1/users/me

# User Preferences
GET /api/v1/users/me/preferences
PUT /api/v1/users/me/preferences
```

#### 4.2.3 Trip Planning Endpoints
```python
# Plan Route
POST /api/v1/routes/plan

# Get Route Details
GET /api/v1/routes/{route_id}

# Search Places
GET /api/v1/places/search

# Get Place Details
GET /api/v1/places/{place_id}
```

#### 4.2.4 Vehicle Tracking Endpoints
```python
# Get Nearby Vehicles
GET /api/v1/vehicles/nearby

# Get Vehicle Details
GET /api/v1/vehicles/{vehicle_id}

# Update Vehicle Location
POST /api/v1/vehicles/{vehicle_id}/location

# Get Vehicle Route
GET /api/v1/vehicles/{vehicle_id}/route
```

#### 4.2.5 Fare Endpoints
```python
# Calculate Fare
POST /api/v1/fares/calculate

# Get Fare Rules
GET /api/v1/fares/rules

# Get Fare History
GET /api/v1/fares/history
```

#### 4.2.6 Safety Endpoints
```python
# Submit Safety Report
POST /api/v1/reports/safety

# Get Safety Reports
GET /api/v1/reports/safety

# Get Report Statistics
GET /api/v1/reports/statistics
```

### 4.3 API Response Format

#### 4.3.1 Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-11-19T10:00:00Z"
}
```

#### 4.3.2 Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "timestamp": "2025-11-19T10:00:00Z"
}
```

## 5. Database Specifications

### 5.1 Database Design

#### 5.1.1 Schema Overview
- PostgreSQL 14+ with PostGIS 3.3+
- Spatial indexing for location queries
- Foreign key constraints for data integrity
- Triggers for automated timestamp updates

#### 5.1.2 Core Tables

**Users Table**:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(128),
    is_active BOOLEAN DEFAULT true,
    is_email_verified BOOLEAN DEFAULT false,
    preferred_language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

**Vehicles Table**:
```sql
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL, -- bus, taxi, moto
    capacity INTEGER NOT NULL,
    current_location GEOGRAPHY(POINT, 4326),
    last_location_update TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_location ON vehicles USING GIST(current_location);
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);
```

**Trips Table**:
```sql
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    origin_location GEOGRAPHY(POINT, 4326) NOT NULL,
    destination_location GEOGRAPHY(POINT, 4326) NOT NULL,
    origin_address VARCHAR(500),
    destination_address VARCHAR(500),
    origin_zone_id INTEGER REFERENCES zones(id),
    destination_zone_id INTEGER REFERENCES zones(id),
    distance_km FLOAT NOT NULL,
    duration_minutes FLOAT NOT NULL,
    mode VARCHAR(20) NOT NULL, -- bus, taxi, moto, combined
    estimated_fare FLOAT,
    actual_fare FLOAT,
    fare_breakdown TEXT, -- JSON
    route_polyline TEXT, -- Encoded polyline
    route_steps TEXT, -- JSON
    status VARCHAR(20) DEFAULT 'planned', -- planned, in_progress, completed, cancelled
    planned_start_time TIMESTAMP,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_origin ON trips USING GIST(origin_location);
CREATE INDEX idx_trips_destination ON trips USING GIST(destination_location);
```

### 5.2 Database Performance

#### 5.2.1 Indexing Strategy
- Primary keys: B-tree indexes
- Foreign keys: B-tree indexes
- Spatial data: GIST indexes
- Timestamps: Partial indexes for recent data
- Composite indexes for common query patterns

#### 5.2.2 Query Optimization
- EXPLAIN ANALYZE for query performance monitoring
- Query result caching for frequently accessed data
- Connection pooling for database connections
- Read replicas for scaling read operations

## 6. Integration Specifications

### 6.1 External Integrations

#### 6.1.1 Google Maps API
**Purpose**: Mapping, geocoding, and directions

**Technical Details**:
```javascript
// Geocoding API
https://maps.googleapis.com/maps/api/geocode/json
?address={address}
&key={API_KEY}

// Directions API
https://maps.googleapis.com/maps/api/directions/json
?origin={origin}
&destination={destination}
&mode={mode}
&key={API_KEY}
```

**Rate Limits**: 100 requests/second
**Authentication**: API Key
**Error Handling**: Retry with exponential backoff

#### 6.1.2 Payment Integration (Phase 2)
**Purpose**: Mobile money payments

**Technical Details**:
```python
# MTN Mobile Money API
POST /api/v1/payments/momo
{
  "phone": "string",
  "amount": "float",
  "reference": "string",
  "callback_url": "string"
}
```

### 6.2 Internal Integrations

#### 6.2.1 Frontend-Backend Integration
**Protocol**: HTTPS REST API
**Authentication**: JWT Bearer tokens
**Data Format**: JSON
**Error Handling**: Standard HTTP status codes

#### 6.2.2 Backend-Database Integration
**ORM**: SQLAlchemy
**Connection Pool**: SQLAlchemy connection pooling
**Transactions**: ACID compliance
**Migration**: Flask-Migrate

## 7. Performance Specifications

### 7.1 Response Time Targets

| Operation | Target | Maximum |
|-----------|--------|---------|
| API Response | < 500ms | 2s |
| Page Load | < 2s | 5s |
| Map Rendering | < 1s | 3s |
| Route Calculation | < 3s | 10s |
| Database Query | < 100ms | 500ms |

### 7.2 Throughput Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| Concurrent Users | 1,000 | 10,000 |
| API Requests/Minute | 10,000 | 50,000 |
| Database Transactions/Second | 5,000 | 20,000 |
| File Uploads/Minute | 100 | 500 |

### 7.3 Resource Utilization

| Resource | Target | Maximum |
|----------|--------|---------|
| CPU Usage | < 70% | 90% |
| Memory Usage | < 80% | 95% |
| Disk Usage | < 85% | 95% |
| Network Bandwidth | < 70% | 90% |

## 8. Security Specifications

### 8.1 Authentication Security

#### 8.1.1 Password Security
```python
# Password hashing configuration
bcrypt.gensalt(rounds=12)
# Minimum password length: 8 characters
# Password complexity: letters, numbers, special characters
```

#### 8.1.2 Token Security
```python
# JWT Configuration
{
  "algorithm": "RS256",
  "access_token_expiry": "24h",
  "refresh_token_expiry": "7d",
  "issuer": "kigali-go",
  "audience": "kigali-go-users"
}
```

### 8.2 Data Security

#### 8.2.1 Encryption
- **Transport**: TLS 1.3 with perfect forward secrecy
- **At Rest**: AES-256 encryption for sensitive data
- **Key Management**: Hardware security modules (HSM)

#### 8.2.2 Data Privacy
- **PII Masking**: Personal data pseudonymization
- **Data Retention**: Automatic deletion after 2 years
- **Right to Erasure**: Complete data deletion on request

## 9. Testing Specifications

### 9.1 Testing Strategy

#### 9.1.1 Unit Testing
- **Frontend**: Jest + React Testing Library
- **Backend**: pytest
- **Coverage**: Minimum 70% code coverage
- **Automation**: CI/CD pipeline integration

#### 9.1.2 Integration Testing
- **API Testing**: Postman/Newman automation
- **Database Testing**: Testcontainers for isolated testing
- **End-to-End**: Cypress for user journey testing

#### 9.1.3 Performance Testing
- **Load Testing**: Apache JMeter
- **Stress Testing**: Peak load scenarios
- **Volume Testing**: Large dataset performance

### 9.2 Test Environments

#### 9.2.1 Development Environment
- Local development setup
- Feature branch testing
- Manual testing capabilities

#### 9.2.2 Staging Environment
- Production-like configuration
- Automated testing execution
- Performance benchmarking

#### 9.2.3 Production Environment
- Synthetic monitoring
- Real user monitoring
- A/B testing capabilities

## 10. Deployment Specifications

### 10.1 Infrastructure Requirements

#### 10.1.1 Frontend Deployment
- **Platform**: Vercel
- **Build Process**: Vite production build
- **Asset Optimization**: Code splitting, minification
- **CDN**: Global content delivery network

#### 10.1.2 Backend Deployment
- **Platform**: Render
- **Container**: Docker
- **Orchestration**: Kubernetes ready
- **Scaling**: Horizontal pod autoscaling

#### 10.1.3 Database Deployment
- **Platform**: Cloud PostgreSQL
- **Replication**: Primary-replica configuration
- **Backup**: Daily automated backups
- **Monitoring**: Performance metrics collection

### 10.2 Configuration Management

#### 10.2.1 Environment Variables
```bash
# Database Configuration
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port

# Security Configuration
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# External API Keys
GOOGLE_MAPS_API_KEY=your-google-maps-key
MTN_MOMO_API_KEY=your-mtn-momo-key

# Application Configuration
DEBUG=false
LOG_LEVEL=info
CORS_ORIGINS=https://kigali-go.vercel.app
```

#### 10.2.2 Feature Flags
- **New Features**: Gradual rollout capability
- **A/B Testing**: Feature comparison testing
- **Emergency Switches**: Quick feature disabling

## 11. Monitoring & Logging Specifications

### 11.1 Application Monitoring

#### 11.1.1 Performance Metrics
- **Response Time**: API endpoint performance
- **Error Rate**: Failed request percentage
- **Throughput**: Requests per second
- **Resource Usage**: CPU, memory, disk, network

#### 11.1.2 Business Metrics
- **User Engagement**: Active users, session duration
- **Feature Usage**: API endpoint usage statistics
- **Conversion Rates**: Registration completion, trip planning
- **Geographic Distribution**: User location analytics

### 11.2 Logging Specifications

#### 11.2.1 Log Format
```json
{
  "timestamp": "2025-11-19T10:00:00Z",
  "level": "INFO|WARN|ERROR",
  "service": "auth|routes|vehicles",
  "message": "User login successful",
  "user_id": "12345",
  "request_id": "req-abc123",
  "duration_ms": 150,
  "metadata": {
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0..."
  }
}
```

#### 11.2.2 Log Retention
- **Application Logs**: 30 days
- **Audit Logs**: 1 year
- **Error Logs**: 90 days
- **Access Logs**: 90 days

## 12. Compliance & Standards

### 12.1 Technical Standards

#### 12.1.1 Code Standards
- **Python**: PEP 8 style guide
- **JavaScript**: ESLint + Prettier configuration
- **HTML**: HTML5 semantic markup
- **CSS**: BEM methodology

#### 12.1.2 API Standards
- **REST**: RESTful API design principles
- **Documentation**: OpenAPI 3.0 specification
- **Versioning**: Semantic versioning
- **Deprecation**: 6-month deprecation notice

### 12.2 Compliance Requirements

#### 12.2.1 Data Protection
- **GDPR**: European data protection compliance
- **Local Laws**: Rwandan data protection regulations
- **Privacy Policy**: Transparent data usage disclosure
- **Cookie Policy**: Cookie usage and consent

#### 12.2.2 Accessibility
- **WCAG 2.1 AA**: Web content accessibility guidelines
- **Screen Readers**: NVDA, JAWS compatibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: Minimum 4.5:1 contrast ratio

---

**Document Version**: 1.0  
**Last Updated**: November 2025  
**Next Review**: December 2025  
**Maintained By**: Technical Architecture Team
