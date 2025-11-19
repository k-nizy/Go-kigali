# Entity Relationship Diagram (ERD) - KigaliGo

## 1. ERD Overview

The Entity Relationship Diagram for KigaliGo illustrates the database schema structure, showing entities, attributes, relationships, and constraints. The design follows relational database principles with proper normalization and referential integrity.

## 2. Core Entities

### 2.1 User Management Entities

```
┌─────────────────────────────────────────────────────────────────────┐
│                              USER                                   │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│     uuid            VARCHAR(36)    NOT NULL UNIQUE                   │
│     name            VARCHAR(100)   NOT NULL                          │
│     email           VARCHAR(255)   NOT NULL UNIQUE                   │
│     phone           VARCHAR(20)    NULL UNIQUE                       │
│     password_hash   VARCHAR(255)   NOT NULL                          │
│     is_active       BOOLEAN        NOT NULL DEFAULT TRUE             │
│     is_email_verified BOOLEAN      NOT NULL DEFAULT FALSE            │
│     preferred_language VARCHAR(10) NOT NULL DEFAULT 'en'            │
│     created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
│     updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
│     last_login      TIMESTAMP      NULL                               │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_user_email (email)                                            │
│   idx_user_uuid (uuid)                                             │
│   idx_user_active (is_active)                                       │
└─────────────────────────────────────────────────────────────────────┘
              │
              │ 1..*
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         USER_PROFILE                                │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│ FK  user_id         INTEGER        NOT NULL UNIQUE                   │
│     avatar          VARCHAR(255)   NULL                              │
│     home_address    TEXT           NULL                              │
│     work_address    TEXT           NULL                              │
│     preferred_payment_method VARCHAR(50) NULL                       │
│     notification_settings JSON          NULL                         │
│     accessibility_options JSON         NULL                         │
│     created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
│     updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_user_profile_user_id (user_id)                                │
│ FOREIGN KEY: user_id REFERENCES user(id) ON DELETE CASCADE          │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Transportation Entities

```
┌─────────────────────────────────────────────────────────────────────┐
│                             VEHICLE                                 │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│     uuid            VARCHAR(36)    NOT NULL UNIQUE                   │
│     license_plate   VARCHAR(20)    NOT NULL UNIQUE                   │
│     vehicle_type    ENUM('bus','taxi','moto') NOT NULL              │
│     capacity        INTEGER        NOT NULL                          │
│     current_location POINT          NOT NULL                          │
│     last_location_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP │
│     is_active       BOOLEAN        NOT NULL DEFAULT TRUE             │
│ FK  driver_id       INTEGER        NULL                              │
│     created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
│     updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_vehicle_uuid (uuid)                                           │
│   idx_vehicle_license (license_plate)                               │
│   idx_vehicle_driver (driver_id)                                    │
│   idx_vehicle_location (current_location)                            │
│   idx_vehicle_active (is_active)                                     │
│ FOREIGN KEY: driver_id REFERENCES driver(id) ON DELETE SET NULL      │
└─────────────────────────────────────────────────────────────────────┘
              │
              │ 1..*
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                             DRIVER                                  │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│ FK  user_id         INTEGER        NOT NULL UNIQUE                   │
│     license_number  VARCHAR(50)    NOT NULL UNIQUE                   │
│     driver_license  VARCHAR(50)    NOT NULL                          │
│ FK  vehicle_id      INTEGER        NULL UNIQUE                        │
│     is_online       BOOLEAN        NOT NULL DEFAULT FALSE            │
│     rating          DECIMAL(3,2)   NOT NULL DEFAULT 0.00            │
│     total_trips     INTEGER        NOT NULL DEFAULT 0                │
│     created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
│     updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_driver_user_id (user_id)                                      │
│   idx_driver_vehicle_id (vehicle_id)                                 │
│   idx_driver_online (is_online)                                      │
│   idx_driver_rating (rating)                                         │
│ FOREIGN KEY: user_id REFERENCES user(id) ON DELETE CASCADE          │
│ FOREIGN KEY: vehicle_id REFERENCES vehicle(id) ON DELETE SET NULL    │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 Trip Management Entities

```
┌─────────────────────────────────────────────────────────────────────┐
│                               TRIP                                  │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│     uuid            VARCHAR(36)    NOT NULL UNIQUE                   │
│ FK  user_id         INTEGER        NOT NULL                          │
│ FK  vehicle_id      INTEGER        NULL                              │
│     origin_location POINT          NOT NULL                          │
│     destination_location POINT       NOT NULL                          │
│     origin_address  TEXT           NOT NULL                          │
│     destination_address TEXT        NOT NULL                          │
│ FK  origin_zone_id   INTEGER        NOT NULL                          │
│ FK  destination_zone_id INTEGER     NOT NULL                          │
│     distance_km     DECIMAL(8,3)   NOT NULL                          │
│     duration_minutes INTEGER        NOT NULL                          │
│     mode            ENUM('bus','taxi','moto','walking','combined') NOT NULL│
│     estimated_fare  DECIMAL(10,2) NOT NULL                          │
│     actual_fare     DECIMAL(10,2) NULL                              │
│     fare_breakdown  JSON           NULL                              │
│     route_polyline  TEXT           NULL                              │
│     route_steps     JSON           NULL                              │
│     status          ENUM('planned','in_progress','completed','cancelled') NOT NULL│
│     planned_start_time TIMESTAMP   NULL                              │
│     actual_start_time TIMESTAMP    NULL                              │
│     actual_end_time TIMESTAMP      NULL                              │
│     created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
│     updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_trip_uuid (uuid)                                               │
│   idx_trip_user_id (user_id)                                         │
│   idx_trip_vehicle_id (vehicle_id)                                   │
│   idx_trip_origin_zone (origin_zone_id)                              │
│   idx_trip_destination_zone (destination_zone_id)                    │
│   idx_trip_status (status)                                           │
│   idx_trip_created_at (created_at)                                   │
│   idx_trip_location (origin_location, destination_location)          │
│ FOREIGN KEY: user_id REFERENCES user(id) ON DELETE CASCADE          │
│ FOREIGN KEY: vehicle_id REFERENCES vehicle(id) ON DELETE SET NULL    │
│ FOREIGN KEY: origin_zone_id REFERENCES zone(id) ON DELETE RESTRICT   │
│ FOREIGN KEY: destination_zone_id REFERENCES zone(id) ON DELETE RESTRICT│
└─────────────────────────────────────────────────────────────────────┘
              │
              │ 1..*
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           TRIP_EVENT                                │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│ FK  trip_id         INTEGER        NOT NULL                          │
│     event_type      ENUM('created','started','completed','cancelled','driver_assigned') NOT NULL│
│     event_data      JSON           NULL                              │
│     location        POINT          NULL                              │
│     timestamp       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_trip_event_trip_id (trip_id)                                   │
│   idx_trip_event_timestamp (timestamp)                              │
│   idx_trip_event_type (event_type)                                   │
│ FOREIGN KEY: trip_id REFERENCES trip(id) ON DELETE CASCADE          │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.4 Geographic Entities

```
┌─────────────────────────────────────────────────────────────────────┐
│                               ZONE                                   │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│     name            VARCHAR(100)   NOT NULL                          │
│     code            VARCHAR(10)    NOT NULL UNIQUE                   │
│     geometry        POLYGON        NOT NULL                          │
│     zone_type       ENUM('residential','commercial','industrial','mixed') NOT NULL│
│     base_fare       DECIMAL(8,2)   NOT NULL DEFAULT 0.00            │
│     is_active       BOOLEAN        NOT NULL DEFAULT TRUE             │
│     created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
│     updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_zone_code (code)                                               │
│   idx_zone_active (is_active)                                        │
│   idx_zone_geometry (geometry)                                        │
│ SPATIAL INDEX: idx_zone_spatial (geometry)                           │
└─────────────────────────────────────────────────────────────────────┘
              │
              │ 1..*
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                               STOP                                   │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│     name            VARCHAR(100)   NOT NULL                          │
│     code            VARCHAR(20)    NOT NULL UNIQUE                   │
│     location        POINT          NOT NULL                          │
│ FK  zone_id         INTEGER        NOT NULL                          │
│     stop_type       ENUM('bus','taxi','moto','shared') NOT NULL      │
│     facilities      JSON           NULL                              │
│     is_active       BOOLEAN        NOT NULL DEFAULT TRUE             │
│     created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
│     updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_stop_code (code)                                               │
│   idx_stop_zone_id (zone_id)                                         │
│   idx_stop_location (location)                                       │
│   idx_stop_active (is_active)                                        │
│ FOREIGN KEY: zone_id REFERENCES zone(id) ON DELETE CASCADE          │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.5 Route Management Entities

```
┌─────────────────────────────────────────────────────────────────────┐
│                              ROUTE                                  │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│     name            VARCHAR(100)   NOT NULL                          │
│     code            VARCHAR(20)    NOT NULL UNIQUE                   │
│     route_type      ENUM('circular','linear','express') NOT NULL     │
│     mode            ENUM('bus','taxi','moto') NOT NULL               │
│     total_distance  DECIMAL(8,3)   NOT NULL                          │
│     estimated_duration INTEGER       NOT NULL                         │
│     is_active       BOOLEAN        NOT NULL DEFAULT TRUE             │
│     created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
│     updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_route_code (code)                                              │
│   idx_route_mode (mode)                                              │
│   idx_route_active (is_active)                                       │
└─────────────────────────────────────────────────────────────────────┘
              │
              │ 1..*
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           ROUTE_STOP                                │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│ FK  route_id        INTEGER        NOT NULL                          │
│ FK  stop_id         INTEGER        NOT NULL                          │
│     sequence_order   INTEGER        NOT NULL                          │
│     is_mandatory    BOOLEAN        NOT NULL DEFAULT FALSE            │
│     wait_time_seconds INTEGER       NULL                              │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_route_stop_route_id (route_id)                                 │
│   idx_route_stop_stop_id (stop_id)                                   │
│   idx_route_stop_sequence (route_id, sequence_order)                 │
│ UNIQUE INDEX: idx_route_stop_unique (route_id, stop_id)              │
│ FOREIGN KEY: route_id REFERENCES route(id) ON DELETE CASCADE          │
│ FOREIGN KEY: stop_id REFERENCES stop(id) ON DELETE CASCADE           │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.6 Fare Management Entities

```
┌─────────────────────────────────────────────────────────────────────┐
│                            FARE_RULE                                │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│ FK  zone_id         INTEGER        NOT NULL                          │
│     transport_mode  ENUM('bus','taxi','moto','walking') NOT NULL    │
│     base_fare       DECIMAL(8,2)   NOT NULL                          │
│     per_kilometer_rate DECIMAL(6,4) NOT NULL                         │
│     per_minute_rate DECIMAL(6,4)  NOT NULL                           │
│     minimum_fare    DECIMAL(8,2)   NOT NULL                          │
│     maximum_fare    DECIMAL(8,2)   NULL                              │
│     surcharge_rules JSON           NULL                              │
│     effective_from  DATE           NOT NULL                          │
│     effective_to    DATE           NULL                              │
│     is_active       BOOLEAN        NOT NULL DEFAULT TRUE             │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_fare_rule_zone_id (zone_id)                                    │
│   idx_fare_rule_mode (transport_mode)                                │
│   idx_fare_rule_effective (effective_from, effective_to)              │
│   idx_fare_rule_active (is_active)                                   │
│ FOREIGN KEY: zone_id REFERENCES zone(id) ON DELETE CASCADE          │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.7 Payment Entities

```
┌─────────────────────────────────────────────────────────────────────┐
│                             PAYMENT                                 │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│ FK  trip_id         INTEGER        NOT NULL UNIQUE                   │
│ FK  user_id         INTEGER        NOT NULL                          │
│     amount          DECIMAL(10,2)  NOT NULL                          │
│     currency        VARCHAR(3)     NOT NULL DEFAULT 'RWF'            │
│     payment_method  ENUM('cash','card','mobile','wallet') NOT NULL   │
│     payment_status  ENUM('pending','processing','completed','failed','refunded') NOT NULL│
│     transaction_id  VARCHAR(100)   NULL UNIQUE                        │
│     gateway_response JSON          NULL                              │
│     processed_at    TIMESTAMP      NULL                              │
│     created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_payment_trip_id (trip_id)                                      │
│   idx_payment_user_id (user_id)                                      │
│   idx_payment_status (payment_status)                                │
│   idx_payment_transaction_id (transaction_id)                         │
│   idx_payment_processed_at (processed_at)                             │
│ FOREIGN KEY: trip_id REFERENCES trip(id) ON DELETE CASCADE          │
│ FOREIGN KEY: user_id REFERENCES user(id) ON DELETE CASCADE           │
└─────────────────────────────────────────────────────────────────────┘
              │
              │ 1..*
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                             REFUND                                  │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│ FK  payment_id      INTEGER        NOT NULL                          │
│     refund_amount   DECIMAL(10,2)  NOT NULL                          │
│     reason          TEXT           NOT NULL                          │
│     status          ENUM('pending','approved','rejected','processed') NOT NULL│
│     processed_by    INTEGER        NULL                              │
│     processed_at    TIMESTAMP      NULL                              │
│     created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_refund_payment_id (payment_id)                                 │
│   idx_refund_status (status)                                         │
│   idx_refund_processed_at (processed_at)                             │
│ FOREIGN KEY: payment_id REFERENCES payment(id) ON DELETE CASCADE     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.8 Safety and Reporting Entities

```
┌─────────────────────────────────────────────────────────────────────┐
│                             REPORT                                  │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│ FK  user_id         INTEGER        NOT NULL                          │
│     incident_type   ENUM('harassment','theft','accident','vehicle_issue','service_problem','other') NOT NULL│
│     severity        ENUM('low','medium','high','critical') NOT NULL   │
│     location        POINT          NOT NULL                          │
│     description     TEXT           NOT NULL                          │
│     evidence_files  JSON           NULL                              │
│     is_anonymous    BOOLEAN        NOT NULL DEFAULT FALSE            │
│     status          ENUM('submitted','under_review','resolved','closed') NOT NULL│
│ FK  assigned_to      INTEGER        NULL                              │
│     resolved_at      TIMESTAMP      NULL                              │
│     created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
│     updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_report_user_id (user_id)                                       │
│   idx_report_incident_type (incident_type)                           │
│   idx_report_severity (severity)                                     │
│   idx_report_status (status)                                         │
│   idx_report_assigned_to (assigned_to)                               │
│   idx_report_created_at (created_at)                                 │
│   idx_report_location (location)                                     │
│ FOREIGN KEY: user_id REFERENCES user(id) ON DELETE CASCADE          │
│ FOREIGN KEY: assigned_to REFERENCES user(id) ON DELETE SET NULL     │
└─────────────────────────────────────────────────────────────────────┘
              │
              │ 1..*
              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         REPORT_COMMENT                               │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│ FK  report_id       INTEGER        NOT NULL                          │
│ FK  user_id         INTEGER        NOT NULL                          │
│     comment         TEXT           NOT NULL                          │
│     is_internal     BOOLEAN        NOT NULL DEFAULT FALSE            │
│     created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_report_comment_report_id (report_id)                           │
│   idx_report_comment_user_id (user_id)                               │
│   idx_report_comment_internal (is_internal)                           │
│ FOREIGN KEY: report_id REFERENCES report(id) ON DELETE CASCADE       │
│ FOREIGN KEY: user_id REFERENCES user(id) ON DELETE CASCADE          │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.9 System Management Entities

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SYSTEM_CONFIG                               │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│     config_key      VARCHAR(100)   NOT NULL UNIQUE                   │
│     config_value    TEXT           NOT NULL                          │
│     description     TEXT           NULL                              │
│     category        VARCHAR(50)    NOT NULL                          │
│     is_editable     BOOLEAN        NOT NULL DEFAULT TRUE             │
│     updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_system_config_key (config_key)                                 │
│   idx_system_config_category (category)                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           AUDIT_LOG                                 │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id              INTEGER        NOT NULL AUTO_INCREMENT          │
│ FK  user_id         INTEGER        NULL                              │
│     action          VARCHAR(100)   NOT NULL                          │
│     resource_type   VARCHAR(50)    NOT NULL                          │
│     resource_id     INTEGER        NULL                              │
│     old_value       JSON           NULL                              │
│     new_value       JSON           NULL                              │
│     ip_address      VARCHAR(45)    NULL                              │
│     user_agent      TEXT           NULL                              │
│     timestamp       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP │
├─────────────────────────────────────────────────────────────────────┤
│ INDEXES:                                                            │
│   idx_audit_log_user_id (user_id)                                   │
│   idx_audit_log_action (action)                                      │
│   idx_audit_log_resource (resource_type, resource_id)                │
│   idx_audit_log_timestamp (timestamp)                                │
│ FOREIGN KEY: user_id REFERENCES user(id) ON DELETE SET NULL         │
└─────────────────────────────────────────────────────────────────────┘
```

## 3. Relationship Summary

### 3.1 One-to-One Relationships
- User ↔ UserProfile (1:1)
- Driver ↔ Vehicle (1:1, optional)
- Trip ↔ Payment (1:1)

### 3.2 One-to-Many Relationships
- User → Trip (1:N)
- User → Report (1:N)
- User → Payment (1:N)
- Vehicle → Trip (1:N)
- Driver → Trip (1:N)
- Zone → Stop (1:N)
- Zone → FareRule (1:N)
- Route → RouteStop (1:N)
- Stop → RouteStop (1:N)
- Trip → TripEvent (1:N)
- Report → ReportComment (1:N)
- Payment → Refund (1:N)

### 3.3 Many-to-Many Relationships (Resolved)
- Route ↔ Stop (through RouteStop)

## 4. Constraints and Rules

### 4.1 Primary Keys
- All tables use auto-increment integer primary keys
- UUID fields provide application-level unique identifiers

### 4.2 Foreign Key Constraints
- **CASCADE DELETE**: Used for dependent entities (user profiles, trip events)
- **SET NULL**: Used for optional relationships (driver assignment)
- **RESTRICT**: Used for critical references (zone references in trips)

### 4.3 Unique Constraints
- Email uniqueness in users table
- Phone number uniqueness (if provided)
- License plate uniqueness
- UUID uniqueness across all entities
- Trip-payment one-to-one relationship

### 4.4 Check Constraints
- Rating values between 0.00 and 5.00
- Distance and duration values must be positive
- Fare amounts must be positive
- Timestamps for future dates validation

## 5. Indexing Strategy

### 5.1 Performance Indexes
- **User lookup indexes**: email, uuid, is_active
- **Trip queries indexes**: user_id, status, created_at, location
- **Vehicle tracking indexes**: current_location, is_active, driver_id
- **Geographic indexes**: spatial indexes on location fields
- **Temporal indexes**: created_at, updated_at timestamps

### 5.2 Composite Indexes
- Route stop sequence ordering
- Zone and fare rule combinations
- User and trip relationships
- Location-based queries

### 5.3 Spatial Indexes
- Vehicle current_location
- Trip origin/destination locations
- Zone geometries
- Stop locations
- Report locations

## 6. Data Types and Extensions

### 6.1 PostgreSQL Extensions Used
- **PostGIS**: For spatial data types and functions
- **uuid-ossp**: For UUID generation
- **pgcrypto**: For password hashing

### 6.2 Spatial Data Types
- **POINT**: For precise locations (vehicle, stops, trip endpoints)
- **POLYGON**: For zone boundaries
- **LINESTRING**: For route polylines

### 6.3 JSON Data Types
- **JSON**: For flexible configuration and metadata storage
- **JSONB**: For indexed JSON columns (PostgreSQL specific)

## 7. Normalization Level

### 7.1 Third Normal Form (3NF)
- All non-key attributes depend on the primary key
- No transitive dependencies
- Proper separation of concerns

### 7.2 Denormalization Decisions
- Limited denormalization for performance
- Redundant data in trip table for faster queries
- Cached calculations in payment and fare tables

## 8. Data Integrity

### 8.1 Referential Integrity
- All foreign key relationships properly defined
- Cascade actions prevent orphaned records
- Constraints ensure data consistency

### 8.2 Domain Integrity
- Enum constraints for categorical data
- Check constraints for numeric ranges
- Not null constraints for required fields

### 8.3 Entity Integrity
- Primary key constraints prevent duplicates
- Unique constraints prevent duplicate business keys
- Default values ensure data completeness

## 9. Security Considerations

### 9.1 Data Protection
- Password hashing using bcrypt
- Sensitive data encryption at rest
- Audit logging for all data modifications

### 9.2 Access Control
- Row-level security for user data
- Column-level security for sensitive information
- View-based access for reporting

## 10. Performance Optimization

### 10.1 Query Optimization
- Proper indexing for common query patterns
- Partitioning strategy for large tables
- Materialized views for complex queries

### 10.2 Storage Optimization
- Appropriate data types to minimize storage
- Compression for large text fields
- Archive strategy for historical data

## 11. Migration Strategy

### 11.1 Version Control
- Database migrations using Flask-Migrate
- Versioned schema changes
- Rollback procedures for failed migrations

### 11.2 Data Migration
- ETL processes for data import
- Validation scripts for data integrity
- Performance testing for migration impact

## 12. ERD Diagram Legend

### 12.1 Notation Symbols
- **PK**: Primary Key
- **FK**: Foreign Key
- **UNQ**: Unique Constraint
- **IDX**: Index
- **SPATIAL**: Spatial Index

### 12.2 Cardinality Notation
- **1**: One
- **N**: Many
- **1..1**: Exactly one
- **1..N**: One to many
- **0..1**: Zero or one
- **0..N**: Zero to many

---

**Document Version**: 1.0  
**Last Updated**: November 2025  
**Next Review**: December 2025  
**Maintained By**: Database Architecture Team
