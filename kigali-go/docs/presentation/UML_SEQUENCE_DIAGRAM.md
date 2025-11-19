# UML Sequence Diagram - KigaliGo

## 1. Sequence Diagram Overview

The UML Sequence Diagrams for KigaliGo illustrate the dynamic interactions between system components over time for key workflows. These diagrams show how objects collaborate to accomplish specific use cases.

## 2. User Registration and Authentication Sequence

### 2.1 User Registration Flow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Frontend   │   │   Auth API   │   │ User Service │   │ User Model   │   │   Database   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
       │                   │                   │                   │                   │
       │ POST /register    │                   │                   │                   │
       ├─────────────────►│                   │                   │                   │
       │                   │ validateInput()   │                   │                   │
       │                   ├─────────────────►│                   │                   │
       │                   │                   │ checkEmailExists()│                   │
       │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │ SELECT * FROM    │
       │                   │                   │                   │ users WHERE      │
       │                   │                   │                   │ email = ?        │
       │                   │                   │                   ├─────────────────►│
       │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│
       │                   │                   │                   │ emailAvailable   │
       │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │                   │
       │                   │                   │ createUser()      │                   │
       │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │ INSERT INTO users │
       │                   │                   │                   │ (name, email,     │
       │                   │                   │                   │ password_hash,   │
       │                   │                   │                   │ created_at)      │
       │                   │                   │                   ├─────────────────►│
       │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│
       │                   │                   │                   │ userId           │
       │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │                   │
       │                   │ generateToken()    │                   │                   │
       │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │                   │
       │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │
       │◄─────────────────│                   │                   │                   │
       │ 201 Created      │                   │                   │                   │
       │                   │                   │                   │                   │
```

### 2.2 User Login Flow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Frontend   │   │   Auth API   │   │ User Service │   │ User Model   │   │   Database   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
       │                   │                   │                   │                   │
       │ POST /login       │                   │                   │                   │
       ├─────────────────►│                   │                   │                   │
       │                   │ authenticateUser()│                   │                   │
       │                   ├─────────────────►│                   │                   │
       │                   │                   │ findByEmail()     │                   │
       │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │ SELECT * FROM    │
       │                   │                   │                   │ users WHERE      │
       │                   │                   │                   │ email = ?        │
       │                   │                   │                   ├─────────────────►│
       │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│
       │                   │                   │                   │ user             │
       │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │                   │
       │                   │                   │ checkPassword()   │                   │
       │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │                   │
       │                   │                   │◄─────────────────│                   │
       │                   │                   │ passwordValid     │                   │
       │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │
       │                   │ generateJWT()     │                   │                   │
       │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │                   │
       │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │
       │◄─────────────────│                   │                   │                   │
       │ 200 OK + Token   │                   │                   │                   │
       │                   │                   │                   │                   │
```

## 3. Trip Planning Sequence

### 3.1 Route Planning Flow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Frontend   │   │ Route API    │   │Route Service │   │Maps Service │   │Fare Service │   │   Database   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
       │                   │                   │                   │                   │                   │
       │ POST /routes/plan│                   │                   │                   │                   │
       ├─────────────────►│                   │                   │                   │                   │
       │                   │ planRoute()       │                   │                   │                   │
       │                   ├─────────────────►│                   │                   │                   │
       │                   │                   │ validateLocations()│                   │                   │
       │                   │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │ geocode()        │                   │
       │                   │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │ coordinates       │                   │
       │                   │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │ calculateRoutes()  │                   │                   │
       │                   │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │ getDirections()   │                   │
       │                   │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │ routeOptions      │                   │
       │                   │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │ calculateFares()  │                   │                   │
       │                   │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │ getFareEstimate() │                   │
       │                   │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │ fareEstimates     │                   │
       │                   │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │◄─────────────────│                   │                   │                   │
       │◄─────────────────│                   │                   │                   │                   │
       │ 200 OK + Routes  │                   │                   │                   │                   │
       │                   │                   │                   │                   │                   │
```

### 3.2 Trip Creation Flow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Frontend   │   │   Trip API   │   │Trip Service │   │ Vehicle Svc  │   │   Database   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
       │                   │                   │                   │                   │
       │ POST /trips       │                   │                   │                   │
       ├─────────────────►│                   │                   │                   │
       │                   │ createTrip()      │                   │                   │
       │                   ├─────────────────►│                   │                   │
       │                   │                   │ validateRequest()  │                   │
       │                   │                   │                   │                   │
       │                   │                   │ findAvailableVehicle()│                │
       │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │ getNearbyVehicles()│
       │                   │                   │                   ├─────────────────►│
       │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│
       │                   │                   │                   │ vehicleList      │
       │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │                   │
       │                   │                   │ assignVehicle()    │                   │
       │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │ updateVehicleStatus()│
       │                   │                   │                   ├─────────────────►│
       │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│
       │                   │                   │                   │ success          │
       │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │                   │
       │                   │                   │ saveTrip()         │                   │
       │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │ INSERT INTO trips │
       │                   │                   │                   │ (...)            │
       │                   │                   │                   ├─────────────────►│
       │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│
       │                   │                   │                   │ tripId           │
       │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │                   │
       │                   │◄─────────────────│                   │                   │
       │◄─────────────────│                   │                   │                   │
       │ 201 Created      │                   │                   │                   │
       │                   │                   │                   │                   │
```

## 4. Real-time Tracking Sequence

### 4.1 Vehicle Location Update Flow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Driver App   │   │ Location API │   │Tracking Svc  │   │ Vehicle Svc  │   │WebSocket Svc│   │   Database   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
       │                   │                   │                   │                   │                   │
       │ POST /location    │                   │                   │                   │                   │
       ├─────────────────►│                   │                   │                   │                   │
       │                   │ updateLocation()  │                   │                   │                   │
       │                   ├─────────────────►│                   │                   │                   │
       │                   │                   │ validateLocation()│                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │ updateVehicleLocation()│                │                   │
       │                   │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │ setLocation()     │                   │
       │                   │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │ success          │                   │
       │                   │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │ broadcastLocation()│                   │                   │
       │                   │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │ sendToClients()   │                   │
       │                   │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │ sentCount        │                   │
       │                   │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │◄─────────────────│                   │                   │                   │
       │◄─────────────────│                   │                   │                   │                   │
       │ 200 OK           │                   │                   │                   │                   │
       │                   │                   │                   │                   │                   │
```

### 4.2 Client Location Subscription Flow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Frontend   │   │ WebSocket API│   │Tracking Svc  │   │ Vehicle Svc  │   │   Database   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
       │                   │                   │                   │                   │
       │ WebSocket Connect │                   │                   │                   │
       ├─────────────────►│                   │                   │                   │
       │                   │ subscribeToTracking()│                │                   │
       │                   ├─────────────────►│                   │                   │
       │                   │                   │ getActiveVehicles()│                   │
       │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │ getActiveVehicles()│
       │                   │                   │                   ├─────────────────►│
       │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│
       │                   │                   │                   │ vehicleList      │
       │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │                   │
       │                   │                   │ sendInitialData()  │                   │
       │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │                   │
       │                   │                   │◄─────────────────│                   │
       │                   │◄─────────────────│                   │                   │
       │◄─────────────────│                   │                   │                   │
       │ Connected        │                   │                   │                   │
       │                   │                   │                   │                   │
       │                   │                   │                   │                   │
       │ Location Updates  │                   │                   │                   │
       │◄─────────────────│                   │                   │                   │
       │ (WebSocket)      │                   │                   │                   │
       │                   │                   │                   │                   │
```

## 5. Payment Processing Sequence

### 5.1 Payment Processing Flow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Frontend   │   │ Payment API  │   │Payment Svc   │   │Trip Service │   │Payment Gateway│   │   Database   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
       │                   │                   │                   │                   │                   │
       │ POST /payments   │                   │                   │                   │                   │
       ├─────────────────►│                   │                   │                   │                   │
       │                   │ processPayment()  │                   │                   │                   │
       │                   ├─────────────────►│                   │                   │                   │
       │                   │                   │ validatePayment()  │                   │                   │
       │                   │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │ getTripDetails()  │                   │
       │                   │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │ tripInfo         │                   │
       │                   │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │ calculateAmount()  │                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │ initiatePayment()  │                   │                   │
       │                   │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │ processTransaction()│                │
       │                   │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │ transactionId    │                   │
       │                   │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │ createPaymentRecord()│                │                   │
       │                   │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │ INSERT INTO payments│
       │                   │                   │                   │ (...)            │
       │                   │                   │                   ├─────────────────►│
       │                   │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│
       │                   │                   │                   │ paymentId        │                   │
       │                   │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │◄─────────────────│                   │                   │                   │
       │◄─────────────────│                   │                   │                   │                   │
       │ 200 OK + Receipt │                   │                   │                   │                   │
       │                   │                   │                   │                   │                   │
```

## 6. Safety Reporting Sequence

### 6.1 Incident Reporting Flow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Frontend   │   │ Report API   │   │Report Svc   │   │File Service │   │Notification Svc│   │   Database   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
       │                   │                   │                   │                   │                   │
       │ POST /reports     │                   │                   │                   │                   │
       ├─────────────────►│                   │                   │                   │                   │
       │                   │ submitReport()    │                   │                   │                   │
       │                   ├─────────────────►│                   │                   │                   │
       │                   │                   │ validateReport()   │                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │ uploadEvidence()   │                   │                   │
       │                   │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │ uploadFiles()     │                   │
       │                   │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │ fileUrls         │                   │
       │                   │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │ createReport()     │                   │                   │
       │                   │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │ INSERT INTO reports│
       │                   │                   │                   │ (...)            │
       │                   │                   │                   ├─────────────────►│
       │                   │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│
       │                   │                   │                   │ reportId         │                   │
       │                   │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │ assessSeverity()   │                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │ notifyAuthorities()│                   │                   │
       │                   │                   ├─────────────────►│                   │                   │
       │                   │                   │                   │ sendNotification()│                   │
       │                   │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │ sent             │                   │
       │                   │                   │◄─────────────────│                   │                   │
       │                   │                   │                   │                   │                   │
       │                   │◄─────────────────│                   │                   │                   │
       │◄─────────────────│                   │                   │                   │                   │
       │ 201 Created      │                   │                   │                   │                   │
       │                   │                   │                   │                   │                   │
```

## 7. Error Handling Sequences

### 7.1 API Error Handling Flow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Frontend   │   │   API Layer │   │ Service Layer│   │ Error Handler│   │   Database   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
       │                   │                   │                   │                   │
       │ POST /endpoint    │                   │                   │                   │
       ├─────────────────►│                   │                   │                   │
       │                   │ validateRequest()  │                   │                   │
       │                   ├─────────────────►│                   │                   │
       │                   │                   │ processRequest()   │                   │
       │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │ databaseQuery()   │
       │                   │                   │                   ├─────────────────►│
       │                   │                   │                   │                   │
       │                   │                   │                   │◄─────────────────│
       │                   │                   │                   │ DatabaseError    │
       │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │                   │
       │                   │                   │ handleError()      │                   │
       │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │ logError()       │
       │                   │                   │                   │                   │
       │                   │                   │                   │ formatErrorResponse()│
       │                   │                   │                   │                   │
       │                   │                   │◄─────────────────│                   │
       │                   │                   │ ErrorResponse      │                   │
       │                   │◄─────────────────│                   │                   │
       │◄─────────────────│                   │                   │                   │
       │ 500 Error        │                   │                   │                   │
       │                   │                   │                   │                   │
```

## 8. Component Interaction Patterns

### 8.1 Request-Response Pattern
```
Client → API → Service → Repository → Database
Client ← API ← Service ← Repository ← Database
```

### 8.2 Event-Driven Pattern
```
Event Producer → Message Queue → Event Consumer → Action
```

### 8.3 Observer Pattern
```
Subject → notify() → Observer.update()
```

## 9. Performance Optimization Sequences

### 9.1 Caching Flow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Client     │   │   API Layer  │   │Cache Service│   │   Database   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
       │                   │                   │                   │
       │ GET /data         │                   │                   │
       ├─────────────────►│                   │                   │
       │                   │ checkCache()      │                   │
       │                   ├─────────────────►│                   │
       │                   │                   │ get(key)          │
       │                   │                   │                   │
       │                   │                   │◄─────────────────│
       │                   │                   │ cacheHit?         │
       │                   │◄─────────────────│                   │
       │                   │                   │                   │
       │                   │ if cacheHit:     │                   │
       │                   │ return cached    │                   │
       │                   │ else:            │                   │
       │                   │ queryDatabase()   │                   │
       │                   ├─────────────────►│                   │
       │                   │                   │                   │
       │                   │                   │◄─────────────────│
       │                   │                   │ data             │
       │                   │                   │                   │
       │                   │                   │ set(key, data)    │
       │                   │                   ├─────────────────►│
       │                   │                   │                   │
       │                   │                   │◄─────────────────│
       │                   │                   │ success          │
       │                   │◄─────────────────│                   │
       │◄─────────────────│                   │                   │
       │ 200 OK + Data     │                   │                   │
       │                   │                   │                   │
```

## 10. Security Sequences

### 10.1 JWT Authentication Flow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Client     │   │   API Layer  │   │Auth Middleware│   │   Database   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
       │                   │                   │                   │
       │ Request + Token   │                   │                   │
       ├─────────────────►│                   │                   │
       │                   │ extractToken()    │                   │
       │                   ├─────────────────►│                   │
       │                   │                   │ validateToken()   │                   │
       │                   │                   ├─────────────────►│                   │
       │                   │                   │                   │ verifySignature()│
       │                   │                   │                   │ checkExpiry()   │
       │                   │                   │                   │◄─────────────────│
       │                   │                   │                   │ valid?           │
       │                   │                   │◄─────────────────│                   │
       │                   │                   │                   │                   │
       │                   │                   │ if valid:         │                   │
       │                   │                   │ proceed()         │                   │
       │                   │                   │ else:             │                   │
       │                   │                   │ reject()          │                   │
       │                   │◄─────────────────│                   │
       │◄─────────────────│                   │                   │
       │ Response         │                   │                   │
       │                   │                   │                   │
```

## 11. Sequence Diagram Guidelines

### 11.1 Best Practices
- Show clear object lifelines
- Include activation boxes to show when objects are active
- Use proper message types (synchronous, asynchronous, return)
- Include error paths for critical operations
- Show timeout scenarios for external calls

### 11.2 Notation Standards
- **Solid line with arrowhead**: Synchronous call
- **Dashed line with arrowhead**: Return message
- **Open arrowhead**: Asynchronous message
- **X**: Object destruction
- **Rectangle**: Activation/execution

### 11.3 Level of Detail
- **High-level**: Show major system interactions
- **Detailed**: Include method names and parameters
- **Implementation**: Include error handling and timeouts

---

**Document Version**: 1.0  
**Last Updated**: November 2025  
**Next Review**: December 2025  
**Maintained By**: System Architecture Team
