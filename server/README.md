# Lovable Dashboard Server

A Node.js Express server with MongoDB database for managing attendance, leaves, and user data for the Lovable Dashboard application.

## Features

- **Attendance Management**: Daily check-in/check-out tracking
- **Leave Management**: Comprehensive leave request system with multiple leave types
- **User Management**: User profiles with leave balance tracking
- **Slack Integration**: Add employees directly from your Slack workspace
- **RESTful API**: Complete CRUD operations for all entities
- **MongoDB Integration**: Robust database with Mongoose ODM

## Slack Integration Setup

To enable the "Add Employee" functionality that fetches users from Slack:

1. **Create a Slack App**

   - Go to https://api.slack.com/apps
   - Click "Create New App" → "From scratch"
   - Give your app a name and select your workspace

2. **Add Required Scopes**

   - Go to "OAuth & Permissions" in your app settings
   - Add the following scopes:
     - `users:read` - To read user information
     - `users:read.email` - To read user email addresses

3. **Install the App**

   - Click "Install to Workspace" in the OAuth & Permissions section
   - Authorize the app for your workspace

4. **Get the Bot Token**

   - Copy the "Bot User OAuth Token" (starts with `xoxb-`)
   - Add it to your environment variables

5. **Environment Configuration**
   Create a `.env` file in the server directory:
   ```env
   SLACK_BOT_TOKEN=xoxb-your-bot-token-here
   MONGODB_URI=mongodb://localhost:27017/lovable
   PORT=5000
   ```

## Database Schemas

### Attendance Schema

```javascript
{
  user: String (required),
  checkinTime: String (required),
  checkoutTime: String,
  date: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Leave Schema

```javascript
{
  user: String,
  dates: [Date] (required),
  reason: String,
  status: String (default: "Pending"),
  leaveType: String (required),
  leaveDay: [String] (required),
  leaveTime: [String] (required),
  createdAt: Date,
  updatedAt: Date
}
```

### User Schema

```javascript
{
  username: String (required),
  slackId: String (required),
  sickLeave: Number (default: 0),
  restrictedHoliday: Number (default: 0),
  burnout: Number (default: 0),
  mensuralLeaves: Number (default: 0),
  casualLeave: Number (default: 0),
  maternityLeave: Number (default: 0),
  unpaidLeave: Number (default: 0),
  paternityLeave: Number (default: 0),
  bereavementLeave: Number (default: 0),
  wfhLeave: Number (default: 0),
  internshipLeave: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lovable-dashboard
   NODE_ENV=development
   ```

4. **Start MongoDB** (if using local MongoDB)

   ```bash
   # On Windows
   mongod

   # On macOS with Homebrew
   brew services start mongodb-community

   # On Linux
   sudo systemctl start mongod
   ```

5. **Run the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Attendance API (`/api/attendance`)

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| GET    | `/`             | Get all attendance records |
| GET    | `/user/:user`   | Get attendance by user     |
| GET    | `/date/:date`   | Get attendance by date     |
| POST   | `/checkin`      | Create check-in record     |
| PATCH  | `/checkout/:id` | Update check-out time      |
| PATCH  | `/:id`          | Update attendance record   |
| DELETE | `/:id`          | Delete attendance record   |

### Leave API (`/api/leaves`)

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/`                | Get all leave records |
| GET    | `/user/:user`      | Get leaves by user    |
| GET    | `/status/:status`  | Get leaves by status  |
| GET    | `/type/:leaveType` | Get leaves by type    |
| POST   | `/`                | Create leave request  |
| PATCH  | `/:id/status`      | Update leave status   |
| PATCH  | `/:id`             | Update leave record   |
| DELETE | `/:id`             | Delete leave record   |

### User API (`/api/users`)

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/`                   | Get all users           |
| GET    | `/:id`                | Get user by ID          |
| GET    | `/username/:username` | Get user by username    |
| GET    | `/slack/:slackId`     | Get user by Slack ID    |
| POST   | `/`                   | Create new user         |
| PATCH  | `/:id/leaves`         | Update leave balances   |
| PATCH  | `/:id`                | Update user information |
| DELETE | `/:id`                | Delete user             |

## Example API Usage

### Create a User

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "slackId": "U1234567890"
  }'
```

### Check-in Attendance

```bash
curl -X POST http://localhost:5000/api/attendance/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "user": "john_doe",
    "checkinTime": "09:00",
    "date": "2024-01-15"
  }'
```

### Request Leave

```bash
curl -X POST http://localhost:5000/api/leaves \
  -H "Content-Type: application/json" \
  -d '{
    "user": "john_doe",
    "dates": ["2024-01-20", "2024-01-21"],
    "reason": "Personal vacation",
    "leaveType": "casualLeave",
    "leaveDay": ["Monday", "Tuesday"],
    "leaveTime": ["Full Day", "Full Day"]
  }'
```

## Leave Types

The system supports the following leave types:

- `sickLeave` - Sick leave
- `casualLeave` - Casual leave
- `maternityLeave` - Maternity leave
- `paternityLeave` - Paternity leave
- `bereavementLeave` - Bereavement leave
- `wfhLeave` - Work from home leave
- `internshipLeave` - Internship leave
- `unpaidLeave` - Unpaid leave
- `restrictedHoliday` - Restricted holiday
- `burnout` - Burnout leave
- `mensuralLeaves` - Menstrual leave

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Project Structure

```
server/
├── config/
│   └── database.js          # Database configuration
├── models/
│   ├── Attendance.js        # Attendance schema
│   ├── Leave.js            # Leave schema
│   └── User.js             # User schema
├── routes/
│   ├── attendance.js       # Attendance routes
│   ├── leaves.js          # Leave routes
│   └── users.js           # User routes
├── index.js               # Main server file
├── package.json           # Dependencies
└── README.md             # Documentation
```

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
