# KigaliGo API Documentation

This document provides comprehensive API documentation for KigaliGo backend service.

## Base URL

```
Production: https://kigali-go-backend.onrender.com/api/v1
Development: http://localhost:5000/api/v1
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "data": {}, // Response data
  "message": "Success message", // Optional message
  "error": "Error message", // Only present on errors
  "status_code": 200 // HTTP status code
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation errors |
| 500 | Internal Server Error - Server error |

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0781234567",
  "password": "password123",
  "preferred_language": "en"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0781234567",
    "preferred_language": "en"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### POST /auth/login
Login with email/phone and password.

**Request Body:**
```json
{
  "identifier": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### GET /auth/profile
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0781234567",
    "preferred_language": "en",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Trip Planning

#### GET /routes/plan
Plan a route between two locations.

**Query Parameters:**
- `origin` (required): Latitude,longitude of origin
- `destination` (required): Latitude,longitude of destination

**Example:**
```
GET /routes/plan?origin=-1.9441,30.0619&destination=-1.9307,30.1182
```

**Response:**
```json
{
  "origin": {
    "lat": -1.9441,
    "lng": 30.0619
  },
  "destination": {
    "lat": -1.9307,
    "lng": 30.1182
  },
  "options": [
    {
      "mode": "bus",
      "distance_km": 5.2,
      "duration_minutes": 18.5,
      "estimated_fare": 1200,
      "route_polyline": "encoded_polyline_string",
      "steps": ["Take bus from Nyabugogo", "Transfer at Kimironko"]
    },
    {
      "mode": "moto",
      "distance_km": 5.2,
      "duration_minutes": 12.3,
      "estimated_fare": 1800,
      "route_polyline": "encoded_polyline_string",
      "steps": ["Take motorcycle taxi"]
    }
  ]
}
```

### Vehicles

#### GET /vehicles/nearby
Get nearby vehicles within a radius.

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `radius` (optional): Search radius in kilometers (default: 1.0)
- `type` (optional): Vehicle type filter (bus, taxi, moto)

**Example:**
```
GET /vehicles/nearby?lat=-1.9441&lng=30.0619&radius=2.0&type=bus
```

**Response:**
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
      "distance_km": 0.5,
      "eta_minutes": 3.2,
      "is_available": true,
      "last_seen": "2024-01-01T12:00:00Z"
    }
  ],
  "count": 1,
  "center": {
    "lat": -1.9441,
    "lng": 30.0619
  },
  "radius_km": 2.0
}
```

### Zones and Stops

#### GET /zones
Get all active zones.

**Response:**
```json
{
  "zones": [
    {
      "id": 1,
      "name": "Nyabugogo",
      "code": "NBG",
      "district": "Nyarugenge",
      "center_lat": -1.9444,
      "center_lng": 30.0444,
      "population": 55000,
      "stops_count": 3
    }
  ],
  "count": 10
}
```

#### GET /stops
Get stops, optionally filtered by zone.

**Query Parameters:**
- `zone_id` (optional): Filter by zone ID
- `type` (optional): Filter by stop type (bus, taxi, moto, combined)

**Example:**
```
GET /stops?zone_id=1&type=bus
```

**Response:**
```json
{
  "stops": [
    {
      "id": 1,
      "name": "Nyabugogo Bus Terminal",
      "code": "NBG001",
      "lat": -1.9444,
      "lng": 30.0444,
      "zone_id": 1,
      "zone_name": "Nyabugogo",
      "stop_type": "bus",
      "is_shelter": true,
      "operating_hours": "05:00-23:00"
    }
  ],
  "count": 1
}
```

### Fare Estimation

#### GET /fare/estimate
Estimate fare for a trip.

**Query Parameters:**
- `distance_km` (required): Distance in kilometers
- `duration_minutes` (required): Duration in minutes
- `mode` (required): Transport mode (bus, taxi, moto)

**Example:**
```
GET /fare/estimate?distance_km=5.2&duration_minutes=15&mode=bus
```

**Response:**
```json
{
  "mode": "bus",
  "distance_km": 5.2,
  "duration_minutes": 15,
  "estimated_fare": 1200,
  "currency": "RWF",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Reports

#### POST /reports
Create a new report.

**Request Body:**
```json
{
  "report_type": "safety",
  "title": "Overcharged fare",
  "description": "Driver charged 2000 RWF instead of 1500 RWF",
  "lat": -1.9441,
  "lng": 30.0619,
  "address": "Nyabugogo Bus Terminal",
  "vehicle_registration": "RAB001A"
}
```

**Response:**
```json
{
  "message": "Report created successfully",
  "report": {
    "id": 1,
    "report_type": "safety",
    "title": "Overcharged fare",
    "description": "Driver charged 2000 RWF instead of 1500 RWF",
    "status": "pending",
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

#### GET /reports
Get reports (admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `limit` (optional): Number of reports to return (default: 20)
- `type` (optional): Filter by report type

**Response:**
```json
{
  "reports": [
    {
      "id": 1,
      "report_type": "safety",
      "title": "Overcharged fare",
      "description": "Driver charged 2000 RWF instead of 1500 RWF",
      "status": "pending",
      "priority": "medium",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ],
  "count": 1
}
```

### Statistics

#### GET /statistics
Get system statistics.

**Response:**
```json
{
  "statistics": {
    "total_vehicles": 150,
    "active_vehicles": 120,
    "total_zones": 10,
    "total_stops": 45,
    "total_trips": 1250,
    "today_trips": 85
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Admin Endpoints

#### GET /admin/dashboard
Get admin dashboard data.

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**
```json
{
  "statistics": {
    "total_users": 500,
    "active_users": 450,
    "total_vehicles": 150,
    "total_trips": 1250,
    "pending_reports": 5
  },
  "recent_trips": [...],
  "recent_reports": [...]
}
```

#### POST /admin/seed
Seed database with sample data (development only).

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**
```json
{
  "message": "Database seeded successfully",
  "vehicles_created": 15,
  "fare_rules_created": 3
}
```

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- General endpoints: 1000 requests per hour
- Route planning: 60 requests per minute
- Vehicle tracking: 120 requests per minute
- Reports: 10 requests per minute

## SDKs and Libraries

### JavaScript/Node.js

```javascript
import { apiService } from './services/api';

// Plan a route
const route = await apiService.routes.plan(
  '-1.9441,30.0619',
  '-1.9307,30.1182'
);

// Get nearby vehicles
const vehicles = await apiService.vehicles.getNearby(
  -1.9441,
  30.0619,
  2.0,
  'bus'
);
```

### Python

```python
import requests

# Plan a route
response = requests.get(
    'https://api.kigali-go.com/v1/routes/plan',
    params={
        'origin': '-1.9441,30.0619',
        'destination': '-1.9307,30.1182'
    }
)
```

## Webhooks

KigaliGo supports webhooks for real-time updates:

### Vehicle Location Updates

**Endpoint:** `POST /webhooks/vehicle-location`

**Payload:**
```json
{
  "vehicle_id": 1,
  "lat": -1.9441,
  "lng": 30.0619,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Report Status Updates

**Endpoint:** `POST /webhooks/report-status`

**Payload:**
```json
{
  "report_id": 1,
  "status": "resolved",
  "admin_response": "Issue has been addressed"
}
```

## Support

For API support:

- Email: api-support@kigali-go.com
- Documentation: [docs.kigali-go.com](https://docs.kigali-go.com)
- GitHub Issues: [github.com/kigali-go/issues](https://github.com/kigali-go/issues)
