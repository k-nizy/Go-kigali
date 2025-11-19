# UML Use Case Diagram - KigaliGo

## 1. Use Case Overview

The KigaliGo system serves passengers, drivers, and administrators with various transportation-related functionalities. The use case diagram illustrates the interactions between different actors and the system.

## 2. Actors Identification

### 2.1 Primary Actors
- **Passenger**: End user who uses the transportation services
- **Driver**: Vehicle operator who provides transportation services
- **System Administrator**: Manages system configuration and monitoring

### 2.2 Secondary Actors
- **Payment Gateway**: External payment processing system
- **Maps Service**: External mapping and geocoding service
- **Notification Service**: External push notification service

## 3. Use Case Diagram (Textual Representation)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           KIGALI GO SYSTEM                              │
│                                                                         │
│  ┌──────────────┐        ┌──────────────────┐        ┌──────────────┐ │
│  │   Passenger  │        │      Driver      │        │ Administrator │ │
│  └──────────────┘        └──────────────────┘        └──────────────┘ │
│         │                         │                         │         │
│         │─────────────────────────┼─────────────────────────│         │
│         │                         │                         │         │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    USE CASES                                    │ │
│  │                                                                 │ │
│  │  PASSENGER USE CASES:                                           │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │ User Management                                           │   │ │
│  │  │ • Register Account                                      │   │ │
│  │  │ • Login/Logout                                          │   │ │
│  │  │ • Manage Profile                                        │   │ │
│  │  │ • Reset Password                                        │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │ Trip Planning                                            │   │ │
│  │  │ • Plan Route                                             │   │ │
│  │  │ • Get Directions                                        │   │ │
│  │  │ • Calculate Fare                                         │   │ │
│  │  │ • Compare Transport Modes                                │   │ │
│  │  │ • Save Favorite Routes                                   │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │ Real-time Tracking                                       │   │ │
│  │  │ • View Live Map                                          │   │ │
│  │  │ • Track Vehicle Location                                 │   │ │
│  │  │ • Get ETA Updates                                        │   │ │
│  │  │ • View Nearby Vehicles                                   │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │ Trip Management                                          │   │ │
│  │  │ • Start Trip                                             │   │ │
│  │  │ • Track Trip Progress                                     │   │ │
│  │  │ • Complete Trip                                          │   │ │
│  │  │ • View Trip History                                      │   │ │
│  │  │ • Rate Trip Experience                                   │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │ Safety & Reporting                                       │   │ │
│  │  │ • Report Safety Incident                                 │   │ │
│  │  │ • Submit Feedback                                        │   │ │
│  │  │ • View Safety Statistics                                 │   │ │
│  │  │ • Emergency Assistance                                   │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │ Payment & Fares                                          │   │ │
│  │  │ • Pay Fare                                                │   │ │
│  │  │ • View Payment History                                    │   │ │
│  │  │ • Manage Payment Methods                                  │   │ │
│  │  │ • Get Fare Estimates                                      │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                 │ │
│  │  DRIVER USE CASES:                                            │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │ Driver Management                                         │   │ │
│  │  │ • Register Driver Account                                 │   │ │
│  │  │ • Update Vehicle Information                              │   │ │
│  │  │ • Set Availability Status                                 │   │ │
│  │  │ • View Driver Profile                                     │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │ Trip Operations                                          │   │ │
│  │  │ • Accept Trip Requests                                   │   │ │
│  │  │ • Update Location                                        │   │ │
│  │  │ • Navigate to Pickup                                      │   │ │
│  │  │ • Complete Trip                                          │   │ │
│  │  │ • Manage Trip Schedule                                   │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │ Earnings & Reports                                       │   │ │
│  │  │ • View Earnings Summary                                  │   │ │
│  │  │ • Download Payment Reports                               │   │ │
│  │  │ • View Performance Metrics                               │   │ │
│  │  │ • Manage Tax Documents                                   │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                 │ │
│  │  ADMINISTRATOR USE CASES:                                     │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │ System Management                                         │   │ │
│  │  │ • Manage Users                                            │   │ │
│  │  │ • Configure System Settings                               │   │ │
│  │  │ • Monitor System Health                                   │   │ │
│  │  │ • Manage Database                                          │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │ Content Management                                        │   │ │
│  │  │ • Update Route Information                                │   │ │
│  │  │ • Manage Vehicle Fleet                                    │   │ │
│  │  │ • Configure Fare Rules                                    │   │ │
│  │  │ • Update Zone Definitions                                 │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │ Analytics & Reporting                                    │   │ │
│  │  │ • Generate System Reports                                 │   │ │
│  │  │ • View Usage Analytics                                    │   │ │
│  │  │ • Monitor Performance Metrics                            │   │ │
│  │  │ • Export Data                                             │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    EXTERNAL SYSTEMS                             │ │
│  │                                                                 │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐     │ │
│  │  │ Payment      │  │ Maps         │  │ Notification     │     │ │
│  │  │ Gateway      │  │ Service      │  │ Service          │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘     │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4. Detailed Use Case Descriptions

### 4.1 Passenger Use Cases

#### 4.1.1 Register Account
**Use Case ID**: UC-P-001  
**Actor**: Passenger  
**Description**: New user creates an account to access KigaliGo services  
**Preconditions**: None  
**Postconditions**: User account created, verification email sent  
**Main Flow**:
1. User opens registration form
2. User enters personal information (name, email, phone)
3. User creates password
4. User selects preferred language
5. System validates input data
6. System creates user account
7. System sends verification email/SMS
8. User verifies account

**Alternative Flows**:
- Email already exists: Show error, suggest login
- Invalid phone format: Show validation error
- Password too weak: Show password requirements

#### 4.1.2 Plan Route
**Use Case ID**: UC-P-002  
**Actor**: Passenger  
**Description**: User plans a trip from origin to destination  
**Preconditions**: User is logged in  
**Postconditions**: Route options displayed with fares and ETAs  
**Main Flow**:
1. User enters origin location
2. User enters destination location
3. User selects transport preferences
4. System calculates available routes
5. System displays route options
6. User selects preferred route
7. System provides detailed directions

**Alternative Flows**:
- No routes available: Suggest alternative locations
- Location not found: Show search suggestions
- Network error: Show cached routes if available

#### 4.1.3 Track Vehicle
**Use Case ID**: UC-P-003  
**Actor**: Passenger  
**Description**: User tracks real-time vehicle location during trip  
**Preconditions**: User has active trip  
**Postconditions**: Real-time vehicle position displayed  
**Main Flow**:
1. User opens trip tracking screen
2. System retrieves current vehicle location
3. System displays vehicle on map
4. System updates position every 10 seconds
5. User views ETA updates

**Alternative Flows**:
- GPS signal lost: Show last known position
- Vehicle offline: Display status message
- Network issues: Attempt reconnection

#### 4.1.4 Report Safety Incident
**Use Case ID**: UC-P-004  
**Actor**: Passenger  
**Description**: User reports a safety-related incident  
**Preconditions**: User is logged in  
**Postconditions**: Incident report submitted and logged  
**Main Flow**:
1. User selects report incident option
2. User chooses incident type
3. User provides incident details
4. User may attach evidence (photos/videos)
5. User submits report
6. System confirms report receipt
7. System notifies relevant authorities

**Alternative Flows**:
- Anonymous reporting: Skip user identification
- Emergency incident: Prioritize and escalate immediately
- Invalid location: Use current GPS location

### 4.2 Driver Use Cases

#### 4.2.1 Update Location
**Use Case ID**: UC-D-001  
**Actor**: Driver  
**Description**: Driver updates vehicle location in real-time  
**Preconditions**: Driver is logged in and online  
**Postconditions**: Vehicle location updated in system  
**Main Flow**:
1. Driver app obtains GPS coordinates
2. System validates GPS accuracy
3. System updates vehicle location
4. System broadcasts location to passengers
5. System logs location history

**Alternative Flows**:
- GPS accuracy low: Wait for better signal
- Network unavailable: Queue location updates
- Invalid coordinates: Use last valid location

#### 4.2.2 Accept Trip Request
**Use Case ID**: UC-D-002  
**Actor**: Driver  
**Description**: Driver accepts a passenger trip request  
**Preconditions**: Driver is available and receives request  
**Postconditions**: Trip assigned to driver, passenger notified  
**Main Flow**:
1. System sends trip request to driver
2. Driver reviews trip details
3. Driver accepts or declines request
4. System updates trip status
5. System notifies passenger of driver assignment
6. System provides navigation to pickup location

**Alternative Flows**:
- Request timeout: Reassign to another driver
- Driver declines: Keep request active for other drivers
- Driver unavailable: Mark driver as offline

### 4.3 Administrator Use Cases

#### 4.3.1 Manage Users
**Use Case ID**: UC-A-001  
**Actor**: Administrator  
**Description**: Admin manages user accounts and permissions  
**Preconditions**: Admin is logged in with appropriate permissions  
**Postconditions**: User accounts updated as needed  
**Main Flow**:
1. Admin accesses user management interface
2. Admin searches for specific user
3. Admin views user details
4. Admin modifies user information
5. Admin updates user permissions
6. System confirms changes
7. User notified of changes if applicable

**Alternative Flows**:
- User not found: Display search suggestions
- Insufficient permissions: Show authorization error
- Concurrent modification: Show conflict resolution

#### 4.3.2 Configure Fare Rules
**Use Case ID**: UC-A-002  
**Actor**: Administrator  
**Description**: Admin sets up and modifies fare calculation rules  
**Preconditions**: Admin has fare management permissions  
**Postconditions**: Fare rules updated and applied to system  
**Main Flow**:
1. Admin accesses fare configuration interface
2. Admin selects transport mode
3. Admin sets base fare rates
4. Admin configures distance/time charges
5. Admin defines zone-based pricing
6. Admin saves configuration
7. System validates rules
8. Rules applied to fare calculations

**Alternative Flows**:
- Invalid fare values: Show validation errors
- Conflicting rules: Highlight conflicts for resolution
- System impact warning: Show affected routes/users

## 5. Use Case Relationships

### 5.1 Include Relationships
- **Register Account** includes **Validate User Input**
- **Plan Route** includes **Calculate Fare**
- **Track Vehicle** includes **Update Map Display**
- **Report Safety Incident** includes **Verify Location**

### 5.2 Extend Relationships
- **Login** extends by **Social Media Login**
- **Plan Route** extends by **Multi-Modal Route Planning**
- **Pay Fare** extends by **Split Payment**
- **Manage Profile** extends by **Biometric Authentication**

### 5.3 Generalization Relationships
- **User Management** (general) → **Passenger Profile** (specific)
- **User Management** (general) → **Driver Profile** (specific)
- **Trip Management** (general) → **Passenger Trip** (specific)
- **Trip Management** (general) → **Driver Trip** (specific)

## 6. Use Case Prioritization

### 6.1 High Priority (MVP)
- User Registration and Login
- Basic Route Planning
- Real-time Vehicle Tracking
- Simple Fare Calculation
- Basic Safety Reporting

### 6.2 Medium Priority (Phase 2)
- Advanced Route Options
- Payment Integration
- Driver Management
- Analytics Dashboard
- Multi-language Support

### 6.3 Low Priority (Future)
- AI Route Optimization
- Voice Navigation
- Social Features
- Gamification
- Third-party Integrations

## 7. Use Case Metrics

### 7.1 Frequency of Use
| Use Case | Frequency | Criticality |
|----------|-----------|-------------|
| Login/Logout | Very High | Critical |
| Plan Route | High | Critical |
| Track Vehicle | High | Critical |
| Report Incident | Low | Important |
| Manage Users | Medium | Important |

### 7.2 Business Value
| Use Case | Business Value | Implementation Complexity |
|----------|----------------|---------------------------|
| Route Planning | Very High | Medium |
| Real-time Tracking | Very High | High |
| Payment Processing | High | High |
| Safety Reporting | Medium | Low |
| Analytics | Medium | Medium |

## 8. Use Case Testing Scenarios

### 8.1 Positive Test Cases
- Valid user registration with all required fields
- Successful route planning with valid locations
- Accurate vehicle tracking during active trip
- Proper safety incident reporting with evidence

### 8.2 Negative Test Cases
- Registration with duplicate email
- Route planning with invalid locations
- Vehicle tracking with GPS signal loss
- Safety report with missing required fields

### 8.3 Edge Cases
- Network connectivity issues
- GPS accuracy problems
- Concurrent user operations
- System overload conditions

---

**Document Version**: 1.0  
**Last Updated**: November 2025  
**Next Review**: December 2025  
**Maintained By**: System Architecture Team
