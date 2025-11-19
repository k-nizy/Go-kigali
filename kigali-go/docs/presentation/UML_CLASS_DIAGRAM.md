# UML Class Diagram - KigaliGo

## 1. Class Diagram Overview

The UML Class Diagram for KigaliGo illustrates the static structure of the system, including classes, attributes, methods, and relationships between objects. The design follows object-oriented principles with clear separation of concerns.

## 2. Core Domain Classes

### 2.1 User Management Classes

```
┌─────────────────────────────────────────────────────────────────────┐
│                            User                                     │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                       │
│ - uuid: String                                                      │
│ - name: String                                                      │
│ - email: String                                                     │
│ - phone: String                                                     │
│ - passwordHash: String                                              │
│ - isActive: Boolean                                                 │
│ - isEmailVerified: Boolean                                          │
│ - preferredLanguage: String                                         │
│ - createdAt: DateTime                                               │
│ - updatedAt: DateTime                                               │
│ - lastLogin: DateTime                                               │
├─────────────────────────────────────────────────────────────────────┤
│ + set_password(password: String)                                     │
│ + check_password(password: String): Boolean                         │
│ + to_dict(): Dictionary                                             │
│ + find_by_email(email: String): User                               │
│ + get_user_trips(limit: Integer, offset: Integer): List[Trip]      │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..* → Trip (user creates trips)                                   │
│ 1..* → Report (user submits reports)                               │
│ 1..* → UserSession (user has sessions)                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      UserProfile                                    │
├─────────────────────────────────────────────────────────────────────┤
│ - userId: Integer                                                    │
│ - avatar: String                                                     │
│ - homeAddress: String                                                │
│ - workAddress: String                                                │
│ - preferredPaymentMethod: String                                     │
│ - notificationSettings: JSON                                          │
│ - accessibilityOptions: JSON                                          │
├─────────────────────────────────────────────────────────────────────┤
│ + update_profile(data: Dictionary)                                   │
│ + set_avatar(image: File)                                            │
│ + get_notification_preferences(): JSON                               │
│ + update_notification_settings(settings: JSON)                       │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..1 → User (profile belongs to user)                                │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Transportation Classes

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Vehicle                                   │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                        │
│ - uuid: String                                                       │
│ - licensePlate: String                                               │
│ - vehicleType: VehicleType                                           │
│ - capacity: Integer                                                  │
│ - currentLocation: Point                                             │
│ - lastLocationUpdate: DateTime                                       │
│ - isActive: Boolean                                                  │
│ - driverId: Integer                                                  │
│ - createdAt: DateTime                                                │
│ - updatedAt: DateTime                                                │
├─────────────────────────────────────────────────────────────────────┤
│ + update_location(latitude: Float, longitude: Float)                 │
│ + get_nearby_vehicles(radius: Float): List[Vehicle]                  │
│ + is_available(): Boolean                                            │
│ + get_current_route(): Route                                         │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..* → Trip (vehicle serves trips)                                   │
│ 1..1 → Driver (vehicle assigned to driver)                           │
│ 1..* → LocationHistory (vehicle has location history)                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                            Driver                                    │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                        │
│ - userId: Integer                                                     │
│ - licenseNumber: String                                              │
│ - driverLicense: String                                              │
│ - vehicleId: Integer                                                 │
│ - isOnline: Boolean                                                  │
│ - rating: Float                                                      │
│ - totalTrips: Integer                                                │
│ - createdAt: DateTime                                                │
│ - updatedAt: DateTime                                                │
├─────────────────────────────────────────────────────────────────────┤
│ + go_online()                                                         │
│ + go_offline()                                                       │
│ + accept_trip(tripId: Integer): Boolean                              │
│ + complete_trip(tripId: Integer)                                     │
│ + update_rating(rating: Float)                                       │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..1 → User (driver is a user)                                       │
│ 1..1 → Vehicle (driver assigned to vehicle)                           │
│ 1..* → Trip (driver completes trips)                                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                             Trip                                     │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                        │
│ - uuid: String                                                       │
│ - userId: Integer                                                     │
│ - vehicleId: Integer                                                 │
│ - originLocation: Point                                              │
│ - destinationLocation: Point                                         │
│ - originAddress: String                                              │
│ - destinationAddress: String                                          │
│ - originZoneId: Integer                                              │
│ - destinationZoneId: Integer                                         │
│ - distanceKm: Float                                                  │
│ - durationMinutes: Float                                            │
│ - mode: TransportMode                                                │
│ - estimatedFare: Float                                               │
│ - actualFare: Float                                                  │
│ - fareBreakdown: JSON                                                │
│ - routePolyline: String                                              │
│ - routeSteps: JSON                                                   │
│ - status: TripStatus                                                 │
│ - plannedStartTime: DateTime                                         │
│ - actualStartTime: DateTime                                          │
│ - actualEndTime: DateTime                                             │
│ - createdAt: DateTime                                                │
│ - updatedAt: DateTime                                                │
├─────────────────────────────────────────────────────────────────────┤
│ + start_trip()                                                        │
│ + complete_trip()                                                    │
│ + cancel_trip(reason: String)                                        │
│ + calculate_fare(): Float                                            │
│ + get_eta(): Integer                                                  │
│ + update_status(status: TripStatus)                                  │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..1 → User (trip belongs to user)                                   │
│ 1..1 → Vehicle (trip uses vehicle)                                   │
│ 1..* → TripEvent (trip has events)                                   │
│ 1..1 → Payment (trip has payment)                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 Geographic Classes

```
┌─────────────────────────────────────────────────────────────────────┐
│                             Zone                                     │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                        │
│ - name: String                                                       │
│ - code: String                                                       │
│ - geometry: Polygon                                                  │
│ - zoneType: ZoneType                                                 │
│ - baseFare: Float                                                    │
│ - isActive: Boolean                                                  │
│ - createdAt: DateTime                                                │
│ - updatedAt: DateTime                                                │
├─────────────────────────────────────────────────────────────────────┤
│ + contains_point(latitude: Float, longitude: Float): Boolean        │
│ + get_fare_for_mode(mode: TransportMode): Float                      │
│ + get_adjacent_zones(): List[Zone]                                   │
│ + calculate_area(): Float                                            │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..* → Stop (zone contains stops)                                   │
│ 1..* → Trip (trips originate/terminate in zone)                       │
│ 1..* → FareRule (zone has fare rules)                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                             Stop                                     │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                        │
│ - name: String                                                       │
│ - code: String                                                       │
│ - location: Point                                                    │
│ - zoneId: Integer                                                     │
│ - stopType: StopType                                                 │
│ - facilities: JSON                                                   │
│ - isActive: Boolean                                                  │
│ - createdAt: DateTime                                                │
│ - updatedAt: DateTime                                                │
├─────────────────────────────────────────────────────────────────────┤
│ + get_nearby_vehicles(radius: Float): List[Vehicle]                  │
│ + get_scheduled_routes(): List[Route]                                │
│ + calculate_distance_to(point: Point): Float                        │
│ + is_accessible(): Boolean                                           │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..1 → Zone (stop belongs to zone)                                   │
│ 1..* → RouteStop (stop is part of routes)                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                            Route                                     │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                        │
│ - name: String                                                       │
│ - code: String                                                       │
│ - routeType: RouteType                                               │
│ - mode: TransportMode                                                │
│ - totalDistance: Float                                               │
│ - estimatedDuration: Integer                                         │
│ - isActive: Boolean                                                  │
│ - createdAt: DateTime                                                │
│ - updatedAt: DateTime                                                │
├─────────────────────────────────────────────────────────────────────┤
│ + get_stops(): List[Stop]                                            │
│ + calculate_fare(): Float                                            │
│ + get_next_departures(): List[DateTime]                              │
│ + is_operational_now(): Boolean                                      │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..* → RouteStop (route has stops)                                   │
│ 1..* → Schedule (route has schedules)                                │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.4 Fare Management Classes

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FareRule                                    │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                        │
│ - zoneId: Integer                                                     │
│ - transportMode: TransportMode                                        │
│ - baseFare: Float                                                    │
│ - perKilometerRate: Float                                            │
│ - perMinuteRate: Float                                               │
│ - minimumFare: Float                                                 │
│ - maximumFare: Float                                                 │
│ - surchargeRules: JSON                                               │
│ - effectiveFrom: DateTime                                             │
│ - effectiveTo: DateTime                                               │
│ - isActive: Boolean                                                  │
├─────────────────────────────────────────────────────────────────────┤
│ + calculate_fare(distance: Float, duration: Integer): Float         │
│ + apply_surcharges(baseFare: Float): Float                           │
│ + is_valid_for_date(date: DateTime): Boolean                         │
│ + get_current_rate(): FareRule                                       │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..1 → Zone (fare rule applies to zone)                              │
│ 1..* → Trip (trips use fare rules)                                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           Payment                                    │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                        │
│ - tripId: Integer                                                     │
│ - userId: Integer                                                     │
│ - amount: Float                                                       │
│ - currency: String                                                    │
│ - paymentMethod: PaymentMethod                                        │
│ - paymentStatus: PaymentStatus                                       │
│ - transactionId: String                                              │
│ - gatewayResponse: JSON                                               │
│ - processedAt: DateTime                                               │
│ - createdAt: DateTime                                                │
├─────────────────────────────────────────────────────────────────────┤
│ + process_payment(): Boolean                                         │
│ + refund_payment(reason: String): Boolean                             │
│ + generate_receipt(): Receipt                                        │
│ + apply_promo_code(code: String): Boolean                            │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..1 → Trip (payment belongs to trip)                                │
│ 1..1 → User (payment made by user)                                   │
│ 1..1 → Refund (payment may have refunds)                             │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.5 Safety and Reporting Classes

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Report                                     │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                        │
│ - userId: Integer                                                     │
│ - incidentType: IncidentType                                          │
│ - severity: SeverityLevel                                            │
│ - location: Point                                                     │
│ - description: String                                                 │
│ - evidence: List[File]                                                │
│ - isAnonymous: Boolean                                                │
│ - status: ReportStatus                                                │
│ - assignedTo: Integer                                                 │
│ - resolvedAt: DateTime                                               │
│ - createdAt: DateTime                                                │
│ - updatedAt: DateTime                                                │
├─────────────────────────────────────────────────────────────────────┤
│ + submit_report()                                                     │
│ + assign_to_staff(staffId: Integer)                                   │
│ + resolve_report(resolution: String)                                 │
│ + escalate_priority()                                                │
│ + add_evidence(file: File)                                            │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..1 → User (report submitted by user)                               │
│ 1..* → ReportComment (report has comments)                            │
│ 1..* → ReportAction (report has actions taken)                         │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.6 System Management Classes

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SystemConfig                                  │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                        │
│ - key: String                                                         │
│ - value: String                                                       │
│ - description: String                                                │
│ - category: String                                                    │
│ - isEditable: Boolean                                                 │
│ - updatedAt: DateTime                                                │
├─────────────────────────────────────────────────────────────────────┤
│ + get_value(key: String): String                                     │
│ + set_value(key: String, value: String)                              │
│ + get_all_configs(): Dictionary                                      │
│ + validate_config(key: String, value: String): Boolean              │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..* → AuditLog (config changes logged)                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         AuditLog                                     │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                        │
│ - userId: Integer                                                     │
│ - action: String                                                      │
│ - resourceType: String                                                │
│ - resourceId: Integer                                                 │
│ - oldValue: JSON                                                      │
│ - newValue: JSON                                                      │
│ - ipAddress: String                                                   │
│ - userAgent: String                                                   │
│ - timestamp: DateTime                                                 │
├─────────────────────────────────────────────────────────────────────┤
│ + log_action(user: User, action: String, resource: Object)            │
│ + get_user_actions(userId: Integer): List[AuditLog]                  │
│ + get_resource_history(resourceType: String, resourceId: Integer)     │
│ + export_audit_log(startDate: DateTime, endDate: DateTime)           │
├─────────────────────────────────────────────────────────────────────┤
│ Relationships:                                                      │
│ 1..1 → User (action performed by user)                               │
└─────────────────────────────────────────────────────────────────────┘
```

## 3. Enum Classes

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TransportMode                                 │
├─────────────────────────────────────────────────────────────────────┤
│ BUS = "bus"                                                          │
│ TAXI = "taxi"                                                        │
│ MOTO = "moto"                                                        │
│ WALKING = "walking"                                                  │
│ COMBINED = "combined"                                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         TripStatus                                   │
├─────────────────────────────────────────────────────────────────────┤
│ PLANNED = "planned"                                                  │
│ IN_PROGRESS = "in_progress"                                           │
│ COMPLETED = "completed"                                              │
│ CANCELLED = "cancelled"                                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     PaymentStatus                                    │
├─────────────────────────────────────────────────────────────────────┤
│ PENDING = "pending"                                                  │
│ PROCESSING = "processing"                                            │
│ COMPLETED = "completed"                                              │
│ FAILED = "failed"                                                    │
│ REFUNDED = "refunded"                                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     IncidentType                                    │
├─────────────────────────────────────────────────────────────────────┤
│ HARASSMENT = "harassment"                                            │
│ THEFT = "theft"                                                      │
│ ACCIDENT = "accident"                                                │
│ VEHICLE_ISSUE = "vehicle_issue"                                      │
│ SERVICE_PROBLEM = "service_problem"                                  │
│ OTHER = "other"                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 4. Class Relationships

### 4.1 Inheritance Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                           BaseEntity                                 │
├─────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                        │
│ - uuid: String                                                       │
│ - createdAt: DateTime                                                │
│ - updatedAt: DateTime                                                │
├─────────────────────────────────────────────────────────────────────┤
│ + to_dict(): Dictionary                                              │
│ + from_dict(data: Dictionary): BaseEntity                            │
│ + validate(): Boolean                                                │
└─────────────────────────────────────────────────────────────────────┘
            ▲
            │
    ┌───────┴───────┐
    │               │
┌─────────┐   ┌─────────────┐
│  User   │   │   Vehicle   │
└─────────┘   └─────────────┘
```

### 4.2 Aggregation Relationships

```
┌──────────────┐     1..*     ┌──────────────┐
│    User      │◄────────────►│     Trip     │
└──────────────┘              └──────────────┘
       │                            │
       │ 1..*                       │ 1..1
       ▼                            ▼
┌──────────────┐              ┌──────────────┐
│   Payment    │              │   Vehicle    │
└──────────────┘              └──────────────┘
```

### 4.3 Composition Relationships

```
┌──────────────┐     1..1     ┌──────────────┐
│    Trip      │◄────────────►│   Payment    │
└──────────────┘              └──────────────┘
       │
       │ 1..*
       ▼
┌──────────────┐
│  TripEvent    │
└──────────────┘
```

## 5. Design Patterns Applied

### 5.1 Repository Pattern
```
┌─────────────────────────────────────────────────────────────────────┐
│                         Repository                                  │
├─────────────────────────────────────────────────────────────────────┤
│ + find(id: Integer): Entity                                          │
│ + find_all(): List[Entity]                                           │
│ + save(entity: Entity): Entity                                       │
│ + delete(entity: Entity): Boolean                                    │
│ + find_by_criteria(criteria: Dictionary): List[Entity]               │
└─────────────────────────────────────────────────────────────────────┘
            ▲
            │
    ┌───────┴───────┐
    │               │
┌─────────┐   ┌─────────────┐
│UserRepo │   │TripRepo     │
└─────────┘   └─────────────┘
```

### 5.2 Service Layer Pattern
```
┌─────────────────────────────────────────────────────────────────────┐
│                         Service                                      │
├─────────────────────────────────────────────────────────────────────┤
│ + execute(request: Request): Response                                │
│ + validate_request(request: Request): Boolean                         │
│ + handle_error(error: Exception): Response                           │
└─────────────────────────────────────────────────────────────────────┘
            ▲
            │
    ┌───────┴───────┐
    │               │
┌─────────┐   ┌─────────────┐
│TripSvc  │   │PaymentSvc  │
└─────────┘   └─────────────┘
```

### 5.3 Observer Pattern
```
┌─────────────────────────────────────────────────────────────────────┐
│                        Subject                                       │
├─────────────────────────────────────────────────────────────────────┤
│ - observers: List[Observer]                                           │
│ + attach(observer: Observer)                                         │
│ + detach(observer: Observer)                                         │
│ + notify_observers(event: Event)                                      │
└─────────────────────────────────────────────────────────────────────┘
            ▲
            │
    ┌───────┴───────┐
    │               │
┌─────────┐   ┌─────────────┐
│ Vehicle │   │   Trip      │
└─────────┘   └─────────────┘
```

## 6. Class Responsibilities

### 6.1 User Classes
- **User**: Authentication, profile management, trip ownership
- **UserProfile**: Personal preferences, settings, payment methods
- **Driver**: Driver-specific operations, vehicle management

### 6.2 Transportation Classes
- **Vehicle**: Location tracking, availability status, route assignment
- **Trip**: Trip lifecycle management, fare calculation, status updates
- **Route**: Route definition, stop management, schedule information

### 6.3 Geographic Classes
- **Zone**: Geographic boundaries, fare rules, area management
- **Stop**: Physical locations, facilities, route connections

### 6.4 Business Logic Classes
- **FareRule**: Pricing logic, surcharge calculations
- **Payment**: Transaction processing, receipt generation
- **Report**: Safety incident management, escalation procedures

## 7. Data Validation Rules

### 7.1 Class Constraints
- **User.email**: Must be valid email format, unique
- **User.phone**: Must be valid phone format, unique if provided
- **Trip.distanceKm**: Must be positive number
- **Vehicle.capacity**: Must be positive integer
- **Payment.amount**: Must be positive number

### 7.2 Business Rules
- **Trip**: Cannot be completed without payment
- **Driver**: Must have valid vehicle assignment
- **Vehicle**: Cannot be in multiple active trips
- **User**: Must verify email before trip booking

## 8. Class Metrics

### 8.1 Complexity Metrics
| Class | Methods | Attributes | Relationships | Complexity |
|-------|---------|------------|---------------|------------|
| User | 8 | 10 | 3 | Medium |
| Trip | 12 | 15 | 4 | High |
| Vehicle | 6 | 8 | 3 | Medium |
| Payment | 8 | 9 | 3 | Medium |

### 8.2 Coupling Metrics
| Class | Dependencies | Fan-in | Fan-out | Coupling |
|-------|--------------|--------|---------|----------|
| User | 3 | 4 | 2 | Low |
| Trip | 5 | 3 | 5 | Medium |
| Vehicle | 4 | 3 | 3 | Low |
| Payment | 3 | 2 | 3 | Low |

## 9. Future Extensions

### 9.1 Planned Classes
- **Promotion**: Discount codes and special offers
- **Subscription**: Monthly pass management
- **Analytics**: Usage statistics and insights
- **Notification**: Push notification management

### 9.2 Extension Points
- **PaymentGateway**: Abstract payment processing
- **MapProvider**: Abstract mapping services
- **NotificationProvider**: Abstract notification services

---

**Document Version**: 1.0  
**Last Updated**: November 2025  
**Next Review**: December 2025  
**Maintained By**: System Architecture Team
