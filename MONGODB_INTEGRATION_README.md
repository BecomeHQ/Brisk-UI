# MongoDB Integration for Leave and Attendance Metrics

This document explains how the "On Leave Today", "On Leave Next Week", "Leaves To Approve" MetricCards, "Checked-in Today" MetricCard, and the LeaveManagementDialog have been updated to fetch data from MongoDB instead of using mock data, with proper Slack ID to username mapping.

## Changes Made

### 1. Backend Changes

#### New API Endpoints (`server/routes/leaves.js`)

- **GET `/api/leaves/today`** - Returns array of usernames for employees on leave today
- **GET `/api/leaves/next-week`** - Returns array of usernames for employees on leave in the next 7 days
- **GET `/api/leaves/status/Pending`** - Returns pending leave requests with usernames mapped from Slack IDs
- **GET `/api/leaves`** - Returns all leave requests with usernames mapped from Slack IDs

#### New API Endpoints (`server/routes/attendance.js`)

- **GET `/api/attendance/today`** - Returns attendance statistics for today with username mapping

#### Database Schema

The system uses three models:

**Leave Model:**

```javascript
{
  user: String, // Contains Slack ID (e.g., "U1234567890")
  dates: [Date], // Array of leave dates
  reason: String,
  status: String, // "Approved", "Pending", "Rejected"
  leaveType: String,
  leaveDay: [String],
  leaveTime: [String]
}
```

**User Model:**

```javascript
{
  username: String, // Display name (e.g., "john_doe")
  slackId: String,  // Slack ID (e.g., "U1234567890")
  // ... leave balance fields
}
```

**Attendance Model:**

```javascript
{
  user: String, // Contains Slack ID (e.g., "U1234567890")
  checkinTime: String, // Time of check-in (e.g., "09:00")
  checkoutTime: String, // Time of check-out (optional)
  date: String, // Date in YYYY-MM-DD format
}
```

#### Slack ID to Username Mapping

The backend now performs a join operation for all leave and attendance-related endpoints:

1. Fetches records with Slack IDs
2. Queries User collection to get usernames for those Slack IDs
3. Maps Slack IDs to usernames before returning the response
4. Returns readable usernames instead of Slack IDs

### 2. Frontend Changes

#### New API Service (`client/src/services/api.ts`)

Created a comprehensive API service to handle all backend communication:

- `getEmployeesOnLeaveToday()` - Fetches employees on leave today (returns usernames)
- `getEmployeesOnLeaveNextWeek()` - Fetches employees on leave next week (returns usernames)
- `getPendingLeaveRequests()` - Fetches pending leave requests (returns usernames)
- `getAllLeaveRequests()` - Fetches all leave requests (returns usernames)
- `getTodayAttendanceStats()` - Fetches attendance statistics for today
- Error handling and loading states

#### Updated Dashboard Component (`client/src/pages/Index.tsx`)

- Replaced mock data with real API calls for all four metrics
- Added loading states and error handling for all metrics
- Uses `useEffect` to fetch data on component mount
- All MetricCards now show real-time data with readable usernames

#### Updated LeaveManagementDialog (`client/src/components/dashboard/LeaveManagementDialog.tsx`)

- Replaced mock data with real API calls
- Added loading states and error handling
- Fetches all leave requests when dialog opens
- Displays real-time data with proper username mapping
- Shows summary statistics based on actual data
- Includes placeholder functions for approve/reject actions

## Setup Instructions

### 1. Start MongoDB

```bash
# Make sure MongoDB is running on your system
mongod
```

### 2. Set up Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lovable-dashboard
NODE_ENV=development
```

### 3. Install Dependencies

```bash
# In the server directory
cd server
npm install

# In the client directory
cd ../client
npm install
```

### 4. Seed the Database

```bash
# In the server directory
npm run seed
```

This will create test users, leave records, and attendance records with proper Slack ID to username mapping.

### 5. Start the Server

```bash
# In the server directory
npm run dev
```

### 6. Start the Client

```bash
# In the client directory
npm run dev
```

## Testing

### Test the API Endpoints

```bash
# In the server directory
node test-leaves-api.js
```

This will test:

- Server health
- Get all leave requests (with username mapping)
- Get employees on leave today (with username mapping)
- Get employees on leave next week (with username mapping)
- Get pending leave requests (with username mapping)
- Get today's attendance statistics (with username mapping)
- Verify user data structure

### Expected Results

After seeding the database, you should see:

- **Employees on leave today**: 2 (john_doe, jane_smith)
- **Employees on leave next week**: 2 (mike_wilson, sarah_jones)
- **Pending leave requests**: 1 (sarah_jones)
- **Employees checked in today**: 3 (mike_wilson, sarah_jones, alex_brown)
- **Attendance percentage**: 60% (3/5 employees)
- **Slack ID to Username mapping**: U1234567890 → john_doe, etc.

## API Endpoints

### Get All Leave Requests

```
GET /api/leaves
```

**Response:**

```json
[
  {
    "_id": "...",
    "user": "U1234567890", // Slack ID in database
    "username": "john_doe", // Mapped username
    "dates": ["2024-01-XX"],
    "reason": "Personal day",
    "status": "Approved",
    "leaveType": "casualLeave"
  }
]
```

### Get Employees on Leave Today

```
GET /api/leaves/today
```

**Response:**

```json
["john_doe", "jane_smith"]
```

### Get Employees on Leave Next Week

```
GET /api/leaves/next-week
```

**Response:**

```json
["mike_wilson", "sarah_jones"]
```

### Get Pending Leave Requests

```
GET /api/leaves/status/Pending
```

**Response:**

```json
[
  {
    "_id": "...",
    "user": "U1234567893", // Slack ID in database
    "username": "sarah_jones", // Mapped username
    "dates": ["2024-01-XX"],
    "reason": "Family event",
    "status": "Pending",
    "leaveType": "casualLeave"
  }
]
```

### Get Today's Attendance Statistics

```
GET /api/attendance/today
```

**Response:**

```json
{
  "totalEmployees": 5,
  "checkedInCount": 3,
  "availableEmployees": 5,
  "attendancePercentage": 60,
  "checkedInUsers": ["mike_wilson", "sarah_jones", "alex_brown"],
  "todayDate": "2024-01-XX"
}
```

## Data Flow

1. **Leave Records**: Stored with Slack IDs in the `user` field
2. **Attendance Records**: Stored with Slack IDs in the `user` field
3. **User Records**: Contain both `username` and `slackId` fields
4. **API Processing**:
   - Extract unique Slack IDs from records
   - Query User collection for matching usernames
   - Create mapping: `slackId → username`
   - Return usernames instead of Slack IDs
5. **Frontend Display**: Shows readable usernames in MetricCard subtitles and dialog tables

## Error Handling

The frontend includes comprehensive error handling:

- Loading states while fetching data for all components
- Error messages if API calls fail
- Fallback to empty arrays if no data is returned
- Console logging for debugging
- Separate error states for each component
- Graceful handling of missing user mappings

## Features

✅ **Real-time Data**: All components now fetch live data from MongoDB  
✅ **Loading States**: Shows loading indicators while fetching data  
✅ **Error Handling**: Gracefully handles API errors and network issues  
✅ **Date-based Queries**: Properly filters leaves and attendance by date ranges  
✅ **Status Filtering**: Only includes approved leaves for today/next week, pending for approvals  
✅ **Independent Loading**: Each component loads independently  
✅ **Username Mapping**: Converts Slack IDs to readable usernames  
✅ **Data Integrity**: Handles missing user mappings gracefully  
✅ **Dialog Integration**: LeaveManagementDialog shows real-time data  
✅ **Summary Statistics**: Dialog shows actual counts for pending, approved, and today's approvals  
✅ **Attendance Tracking**: Real-time attendance statistics with percentage calculations  
✅ **Smart Calculations**: Attendance percentage based on available employees

## Future Enhancements

1. **Real-time Updates**: Implement WebSocket connections for live updates
2. **Caching**: Add client-side caching to reduce API calls
3. **Pagination**: Add pagination for large datasets
4. **Filtering**: Add date range filters for leave and attendance queries
5. **Authentication**: Add user authentication and authorization
6. **Optimization**: Combine API calls to reduce network requests
7. **User Management**: Add endpoints to manage user profiles and Slack ID mappings
8. **Leave Management**: Add endpoints to approve/reject leave requests
9. **Export Functionality**: Implement CSV/PDF export for leave and attendance data
10. **Advanced Filtering**: Add filters by leave type, date range, and status
11. **Attendance Analytics**: Add historical attendance trends and reports
12. **Leave Balance Integration**: Consider leave balances when calculating attendance

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check the MONGODB_URI in your .env file
   - Verify the database name is correct

2. **CORS Errors**

   - The server includes CORS middleware
   - Ensure the client is running on the correct port

3. **API Endpoint Not Found**

   - Verify the server is running on port 5000
   - Check that all routes are properly registered

4. **No Data Showing**

   - Run the seed script to populate the database
   - Check the browser console for API errors
   - Verify the API endpoints are working with the test script

5. **Date Filtering Issues**

   - The backend uses 12:00 AM as the start time for date calculations
   - Ensure leave dates are properly formatted in the database
   - Check that the date ranges are correctly set in the queries

6. **Username Mapping Issues**

   - Verify that User records exist for all Slack IDs in Leave and Attendance records
   - Check that the `slackId` field in User records matches the `user` field in other records
   - Ensure the mapping logic is working correctly in the backend

7. **Slack ID vs Username Confusion**

   - Leave and Attendance records store Slack IDs in the `user` field
   - API endpoints return usernames (not Slack IDs)
   - Check the console logs to see the mapping process

8. **Pending Leave Requests Issues**

   - Verify that pending leave requests have status "Pending"
   - Check that the username mapping works for pending requests
   - Ensure the frontend correctly displays the mapped usernames

9. **Dialog Loading Issues**

   - Check that the dialog fetches data when opened
   - Verify that loading states are properly displayed
   - Ensure error handling works correctly in the dialog

10. **Summary Statistics Issues**

    - Verify that the dialog calculates statistics correctly
    - Check that "Approved Today" counts are accurate
    - Ensure pending request counts match the actual data

11. **Attendance Calculation Issues**

    - Verify that attendance records exist for today
    - Check that the date format matches (YYYY-MM-DD)
    - Ensure the percentage calculation is based on total employees
    - Verify that checked-in users are properly mapped to usernames

12. **Attendance Percentage Issues**
    - Check that the percentage is calculated correctly (checkedInCount / availableEmployees \* 100)
    - Verify that the available employees count includes all users
    - Ensure the calculation handles edge cases (division by zero)

# MongoDB Integration for Dashboard

This document outlines the integration of MongoDB database with the dashboard application, replacing mock data with real data from the database.

## Overview

The dashboard has been updated to fetch real data from MongoDB for various metrics and components:

1. **On Leave Today** - Fetches employees on leave today from MongoDB
2. **On Leave Next Week** - Fetches employees on leave next week from MongoDB
3. **Leaves to Approve** - Fetches pending leave requests from MongoDB
4. **Checked-in Today** - Fetches attendance statistics from MongoDB
5. **Team Leave Calendar** - Shows all users from MongoDB with blank departments

## Backend API Endpoints

### 1. Get Employees on Leave Today

- **Endpoint**: `GET /api/leaves/today`
- **Description**: Returns employees who are on leave today with username mapping
- **Response**: Array of usernames

### 2. Get Employees on Leave Next Week

- **Endpoint**: `GET /api/leaves/next-week`
- **Description**: Returns employees who are on leave next week with username mapping
- **Response**: Array of usernames

### 3. Get Pending Leave Requests

- **Endpoint**: `GET /api/leaves/pending`
- **Description**: Returns pending leave requests with username mapping
- **Response**: Array of leave request objects with username field

### 4. Get Today's Attendance Statistics

- **Endpoint**: `GET /api/attendance/today-stats`
- **Description**: Returns attendance statistics for today with username mapping
- **Response**: Object with checkedInCount, availableEmployees, attendancePercentage, and checkedInUsers array

### 5. Get All Users

- **Endpoint**: `GET /api/users`
- **Description**: Returns all users for the Team Leave Calendar
- **Response**: Array of user objects with \_id, username, and slackId

## Frontend API Service

The `client/src/services/api.ts` file has been updated with new methods:

```typescript
// Leave-related API calls
async getEmployeesOnLeaveToday(): Promise<ApiResponse<string[]>>
async getEmployeesOnLeaveNextWeek(): Promise<ApiResponse<string[]>>
async getPendingLeaveRequests(): Promise<ApiResponse<any[]>>
async getTodayAttendanceStats(): Promise<ApiResponse<any>>

// User-related API calls
async getAllUsers(): Promise<ApiResponse<any[]>>
```

## Dashboard Updates

### Index.tsx Changes

- Added state management for loading and error states
- Implemented useEffect hooks to fetch data from MongoDB
- Updated MetricCard components to display real data
- Added proper error handling and loading states

### Team Leave Calendar Integration

- **Component**: `client/src/components/dashboard/TeamLeaveCalendar.tsx`
- **Grid Component**: `client/src/components/dashboard/team-leave/CalendarGrid.tsx`
- **Changes**:
  - Fetches all users from MongoDB instead of using mock data
  - Displays usernames from the database
  - Sets department field as blank (as requested)
  - Added loading state for user data
  - Updated filtering logic to work with user IDs from database

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  username: String,
  slackId: String
}
```

### Leaves Collection

```javascript
{
  _id: ObjectId,
  slackId: String,
  type: String,
  startDate: Date,
  endDate: Date,
  status: String,
  reason: String
}
```

### Attendance Collection

```javascript
{
  _id: ObjectId,
  slackId: String,
  date: Date,
  checkInTime: Date,
  checkOutTime: Date
}
```

## Slack ID to Username Mapping

All endpoints that return user data now include username mapping by joining with the Users collection using slackId. This ensures that:

- Leave data shows actual usernames instead of Slack IDs
- Attendance data includes readable usernames
- Team Leave Calendar displays proper user names

## Seed Data

The `server/seed-data.js` file includes:

- 20 sample users with usernames and Slack IDs
- Various leave records with different types and statuses
- Attendance records for testing the attendance statistics

## Testing

Use the `server/test-leaves-api.js` script to test all endpoints:

```bash
cd server
node test-leaves-api.js
```

This will test:

- Employees on leave today
- Employees on leave next week
- Pending leave requests
- Today's attendance statistics
- All users for Team Leave Calendar

## Error Handling

All components include proper error handling:

- Loading states while fetching data
- Error messages if API calls fail
- Fallback to empty arrays/objects if no data is returned
- Console logging for debugging

## Performance Considerations

- API calls are made once on component mount
- Loading states provide user feedback
- Error boundaries prevent application crashes
- Efficient data fetching with proper state management
