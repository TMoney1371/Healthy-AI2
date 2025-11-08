# Healthy Life Tracker - iOS App API Documentation

## Base URL
```
https://your-domain.com/api
```

## Authentication
All API endpoints require authentication using Bearer tokens. Include your API token in the Authorization header:

```
Authorization: Bearer YOUR_API_TOKEN_HERE
```

## Endpoints

### 1. Health Status Check
**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-08T12:00:00.000000Z"
}
```

---

### 2. Get User Info
**GET** `/user`

Get the authenticated user's information.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "email_verified_at": "2025-11-08T12:00:00.000000Z",
  "created_at": "2025-11-08T12:00:00.000000Z",
  "updated_at": "2025-11-08T12:00:00.000000Z"
}
```

---

### 3. Sync Biometric Data
**POST** `/sync/biometrics`

Sync biometric data from Apple Health (sleep, heart rate, weight, blood pressure, etc.)

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "data": [
    {
      "type": "sleep",
      "value": 7.5,
      "unit": "hours",
      "recorded_at": "2025-11-08",
      "source": "apple_health",
      "metadata": {
        "deep_sleep": 2.5,
        "rem_sleep": 1.8
      }
    },
    {
      "type": "heart_rate",
      "value": 72,
      "unit": "bpm",
      "recorded_at": "2025-11-08",
      "source": "apple_watch"
    },
    {
      "type": "weight",
      "value": 75.5,
      "unit": "kg",
      "recorded_at": "2025-11-08"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully synced 3 biometric records",
  "synced": 3
}
```

**Supported Biometric Types:**
- `sleep` - Sleep duration
- `heart_rate` - Heart rate measurements
- `weight` - Body weight
- `blood_pressure` - Blood pressure (use metadata for systolic/diastolic)
- `body_temperature` - Body temperature
- `blood_glucose` - Blood glucose levels
- `spo2` - Blood oxygen saturation

---

### 4. Sync Exercise Data
**POST** `/sync/exercises`

Sync workout and exercise data from Apple Health.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "data": [
    {
      "type": "running",
      "date": "2025-11-08",
      "duration": 30,
      "calories": 250,
      "distance": 5.2,
      "heart_rate_avg": 145,
      "apple_watch_data": {
        "max_heart_rate": 165,
        "elevation_gain": 45,
        "workout_uuid": "ABC123..."
      }
    },
    {
      "type": "strength",
      "date": "2025-11-08",
      "duration": 45,
      "calories": 180,
      "heart_rate_avg": 120
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully synced 2 exercise records",
  "synced": 2
}
```

**Supported Exercise Types:**
- `running`
- `cycling`
- `swimming`
- `walking`
- `strength`
- `yoga`
- `hiit`
- Custom types are also accepted

---

### 5. Batch Sync
**POST** `/sync/batch`

Sync multiple data types in a single request for efficiency.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "biometrics": [
    {
      "type": "sleep",
      "value": 7.5,
      "unit": "hours",
      "recorded_at": "2025-11-08"
    }
  ],
  "exercises": [
    {
      "type": "running",
      "date": "2025-11-08",
      "duration": 30,
      "calories": 250
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Batch sync completed",
  "results": {
    "biometrics": {
      "success": true,
      "message": "Successfully synced 1 biometric records",
      "synced": 1
    },
    "exercises": {
      "success": true,
      "message": "Successfully synced 1 exercise records",
      "synced": 1
    }
  }
}
```

---

### 6. Get Sync Status
**GET** `/sync/status`

Get the current sync status and last sync timestamps.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "biometrics": {
      "total_synced": 245,
      "last_sync": "2025-11-08T12:00:00.000000Z"
    },
    "exercises": {
      "total_synced": 89,
      "last_sync": "2025-11-08T11:30:00.000000Z"
    }
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 422 Validation Error
```json
{
  "message": "The data.0.type field is required.",
  "errors": {
    "data.0.type": [
      "The data.0.type field is required."
    ]
  }
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Failed to sync biometric data",
  "error": "Error details..."
}
```

---

## iOS Swift Integration Example

```swift
import Foundation

class HealthSyncAPI {
    private let baseURL = "https://your-domain.com/api"
    private let apiToken: String
    
    init(apiToken: String) {
        self.apiToken = apiToken
    }
    
    func syncBiometrics(data: [[String: Any]], completion: @escaping (Result<[String: Any], Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/sync/biometrics") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = ["data": data]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            // Handle response
        }.resume()
    }
}
```

---

## Rate Limiting

API requests are rate-limited to prevent abuse. Current limits:
- 60 requests per minute for authenticated endpoints
- 10 requests per minute for unauthenticated endpoints

---

## Best Practices

1. **Batch Requests**: Use the `/sync/batch` endpoint when syncing multiple data types
2. **Deduplicate Data**: The API uses `updateOrCreate`, so sending the same data multiple times won't create duplicates
3. **Error Handling**: Always check the `success` field in responses
4. **Token Security**: Store API tokens securely in the iOS Keychain
5. **Background Sync**: Consider using iOS Background App Refresh for automatic syncing

---

## Support

For issues or questions, contact support through the web application settings page.
