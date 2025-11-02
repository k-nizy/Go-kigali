# CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN (Part 2)

## 3.4 Database Design

### 3.4.1 Database Management System

KigaliGo uses **PostgreSQL 13+** for production deployment and **SQLite** for development/testing. PostgreSQL is chosen for its robust support for JSON data types, geospatial extensions (PostGIS), and scalability. SQLAlchemy's ORM provides database-agnostic code, allowing for a seamless transition between development and production environments.

### 3.4.2 Database Tables and Schema

**Table 1: users**
Stores user account information for registration and authentication.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(100) | NOT NULL | User's full name |
| email | VARCHAR(120) | UNIQUE, NULLABLE | Email address (optional) |
| phone | VARCHAR(20) | UNIQUE, NULLABLE | Phone number (Rwanda format) |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| preferred_language | VARCHAR(2) | DEFAULT 'en' | 'en' or 'rw' |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| created_at | DATETIME | DEFAULT NOW() | Registration timestamp |
| updated_at | DATETIME | DEFAULT NOW() | Last modification timestamp |

**Sample Data:**
```
id | name           | email              | phone        | preferred_language | is_active
1  | Jean Uwimana   | jean@example.com   | +250788123456| rw                 | TRUE
2  | Alice Mukase   | alice@example.com  | +250788654321| en                 | TRUE
```

**Table 2: vehicles**
Tracks public transport vehicles operating in Kigali.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| vehicle_type | ENUM | 'bus', 'taxi', 'moto' | Transport mode |
| registration | VARCHAR(20) | UNIQUE, NOT NULL | License plate number |
| operator | VARCHAR(100) | NULLABLE | Operator name (e.g., Tap&Go) |
| driver_name | VARCHAR(100) | NULLABLE | Driver's name |
| capacity | INTEGER | DEFAULT 1 | Passenger capacity |
| current_lat | FLOAT | NULLABLE | Current latitude |
| current_lng | FLOAT | NULLABLE | Current longitude |
| bearing | FLOAT | NULLABLE | Direction in degrees (0-360) |
| speed | FLOAT | NULLABLE | Speed in km/h |
| route_id | VARCHAR(50) | NULLABLE | Route identifier |
| is_active | BOOLEAN | DEFAULT TRUE | Operational status |
| last_seen | DATETIME | DEFAULT NOW() | Last location update timestamp |

**Sample Data:**
```
id | vehicle_type | registration | operator | current_lat | current_lng | is_active
1  | bus          | RAB001A      | Tap&Go   | -1.9441     | 30.0619     | TRUE
2  | moto         | RAB003A      | Private  | -1.9526     | 30.0953     | TRUE
3  | taxi         | RAB004A      | Private  | -1.9706     | 30.1044     | TRUE
```

**Table 3: zones**
Defines geographical zones in Kigali for zone-based fare calculation.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Zone name (e.g., "Kimironko") |
| code | VARCHAR(10) | NULLABLE | Short code (e.g., "KMR") |
| district | VARCHAR(50) | NULLABLE | District (Gasabo/Nyarugenge/Kicukiro) |
| center_lat | FLOAT | NOT NULL | Zone center latitude |
| center_lng | FLOAT | NOT NULL | Zone center longitude |
| population | INTEGER | NULLABLE | Estimated population |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |

**Sample Data:**
```
id | name        | code | district     | center_lat | center_lng | population
1  | Nyabugogo   | NBG  | Nyarugenge   | -1.9444    | 30.0444    | 45000
2  | Kimironko   | KMR  | Gasabo       | -1.9307    | 30.1182    | 52000
3  | Remera      | RMR  | Gasabo       | -1.9526    | 30.0953    | 38000
```

**Table 4: fare_rules**
Defines fare calculation rules for different transport modes.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| mode | ENUM | 'bus', 'taxi', 'moto' | Transport mode |
| base_fare | FLOAT | NOT NULL | Fixed starting fare (RWF) |
| per_km_rate | FLOAT | NOT NULL | Rate per kilometer (RWF/km) |
| minimum_fare | FLOAT | NOT NULL | Minimum charge |
| peak_hour_multiplier | FLOAT | DEFAULT 1.0 | Peak hour multiplier (e.g., 1.2 = 20% increase) |
| night_multiplier | FLOAT | DEFAULT 1.0 | Night time multiplier |
| peak_start_time | VARCHAR(5) | 'HH:MM' | Peak start (e.g., "07:00") |
| peak_end_time | VARCHAR(5) | 'HH:MM' | Peak end (e.g., "09:00") |
| night_start_time | VARCHAR(5) | 'HH:MM' | Night start (e.g., "22:00") |
| night_end_time | VARCHAR(5) | 'HH:MM' | Night end (e.g., "06:00") |
| zone_id | INTEGER | FOREIGN KEY(zones) | Zone-specific rule (optional) |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |

**Sample Data:**
```
id | mode | base_fare | per_km_rate | minimum_fare | peak_hour_multiplier | night_multiplier
1  | bus  | 500       | 150         | 500          | 1.0                  | 1.0
2  | moto | 800       | 300         | 800          | 1.2                  | 1.3
3  | taxi | 1200      | 400         | 1200         | 1.2                  | 1.3
```

**Table 5: trips**
Records user trip history and planned routes.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY(users) | Trip owner |
| vehicle_id | INTEGER | FOREIGN KEY(vehicles) | Vehicle used (optional) |
| origin_lat | FLOAT | NOT NULL | Starting latitude |
| origin_lng | FLOAT | NOT NULL | Starting longitude |
| origin_address | VARCHAR(500) | NULLABLE | Human-readable start address |
| destination_lat | FLOAT | NOT NULL | Ending latitude |
| destination_lng | FLOAT | NOT NULL | Ending longitude |
| destination_address | VARCHAR(500) | NULLABLE | Human-readable end address |
| origin_zone_id | INTEGER | FOREIGN KEY(zones) | Starting zone |
| destination_zone_id | INTEGER | FOREIGN KEY(zones) | Ending zone |
| distance_km | FLOAT | NOT NULL | Trip distance |
| duration_minutes | FLOAT | NOT NULL | Estimated duration |
| mode | ENUM | 'bus', 'taxi', 'moto', 'combined' | Transport mode |
| estimated_fare | FLOAT | NULLABLE | Calculated fare estimate |
| status | ENUM | 'planned', 'completed', 'cancelled' | Trip status |
| created_at | DATETIME | DEFAULT NOW() | Creation timestamp |

**Sample Data:**
```
id | user_id | origin_address | destination_address | distance_km | mode | estimated_fare
1  | 1       | Kimironko      | Nyabugogo          | 8.5         | bus  | 1775
2  | 2       | Remera         | Kicukiro           | 5.2         | moto | 2360
```

**Table 6: reports**
Stores passenger safety and feedback reports.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY(users) | Reporter (optional for anonymous) |
| vehicle_id | INTEGER | FOREIGN KEY(vehicles) | Reported vehicle |
| report_type | ENUM | 'overcharge', 'safety', 'service', 'other' | Report category |
| title | VARCHAR(200) | NOT NULL | Brief title |
| description | TEXT | NOT NULL | Detailed description |
| lat | FLOAT | NULLABLE | Incident latitude |
| lng | FLOAT | NULLABLE | Incident longitude |
| vehicle_registration | VARCHAR(20) | NULLABLE | Vehicle license plate |
| photo_url | VARCHAR(500) | NULLABLE | Uploaded photo URL |
| status | ENUM | 'pending', 'in_review', 'resolved', 'dismissed' | Processing status |
| priority | ENUM | 'low', 'medium', 'high', 'urgent' | Severity level |
| admin_response | TEXT | NULLABLE | Administrator's response |
| resolved_at | DATETIME | NULLABLE | Resolution timestamp |
| created_at | DATETIME | DEFAULT NOW() | Submission timestamp |

**Sample Data:**
```
id | user_id | report_type | title                | vehicle_registration | status  | priority
1  | 1       | overcharge  | Charged 3000 RWF     | RAB005A             | pending | medium
2  | NULL    | safety      | Driver speeding      | RAB003A             | in_review| high
```

**Table 7: stops**
Defines bus stops and taxi/moto stations.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| zone_id | INTEGER | FOREIGN KEY(zones) | Zone location |
| name | VARCHAR(100) | NOT NULL | Stop name |
| code | VARCHAR(10) | NULLABLE | Stop code |
| lat | FLOAT | NOT NULL | Latitude |
| lng | FLOAT | NOT NULL | Longitude |
| stop_type | ENUM | 'bus', 'taxi', 'moto' | Service type |
| is_active | BOOLEAN | DEFAULT TRUE | Operational status |

**Sample Data:**
```
id | zone_id | name               | code | lat      | lng     | stop_type
1  | 1       | Nyabugogo Terminal | NBG1 | -1.9444  | 30.0444 | bus
2  | 2       | Kimironko Market   | KMR1 | -1.9307  | 30.1182 | taxi
```

### 3.4.3 Database Relationships

- **users (1) ──< (N) trips:** One user can have many trips
- **trips (N) >── (1) vehicles:** Many trips can use one vehicle
- **zones (1) ──< (N) stops:** One zone contains many stops
- **zones (1) ──< (N) fare_rules:** Fare rules can be zone-specific
- **vehicles (1) ──< (N) reports:** One vehicle can have many reports
- **zones (1) ──< (N) trips (origin/destination):** Trips have origin and destination zones

<div style="page-break-after: always;"></div>
