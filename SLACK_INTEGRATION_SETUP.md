# Slack Integration Setup Guide

This guide will help you set up the Slack integration to add employees directly from your Slack workspace.

## ✅ What's Been Implemented

1. **Backend API Endpoint**: `/api/users/slack/users` - Fetches users from Slack
2. **Frontend Dialog**: `AddEmployeeDialog` component with search and multi-select
3. **API Service**: Updated to include Slack user fetching and user creation
4. **Integration**: Connected to the "Add Employee" button on the Employees page

## 🔧 Setup Instructions

### 1. Create a Slack App

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Give your app a name (e.g., "Lovable Dashboard")
4. Select your workspace

### 2. Configure App Permissions

1. In your app settings, go to "OAuth & Permissions"
2. Add the following scopes:
   - `users:read` - To read user information
   - `users:read.email` - To read user email addresses (optional)
3. Click "Install to Workspace" and authorize the app

### 3. Get Your Bot Token

1. In "OAuth & Permissions", copy the "Bot User OAuth Token" (starts with `xoxb-`)
2. This token will be used to authenticate API requests

### 4. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# Slack Bot Token (replace with your actual token)
SLACK_BOT_TOKEN=xoxb-your-actual-bot-token-here

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/lovable

# Server Port
PORT=5000
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod

# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 6. Start the Server

```bash
cd server
npm run dev
```

### 7. Test the Integration

```bash
cd server
node test-slack-api.js
```

## 🎯 How It Works

### Smart Filtering

The system automatically filters out users who are already in your database to prevent duplicates:

- **Slack ID Check**: Users with existing Slack IDs are excluded
- **Username Check**: Users with existing usernames are excluded
- **Real-time Updates**: The list updates as you add more users

### Backend Flow

1. **Slack API Call**: When the dialog opens, it calls `/api/users/slack/users`
2. **Database Check**: Fetches existing users from the database
3. **User Filtering**: Filters out bots, deleted users, Slackbot, and users already in the database
4. **Data Mapping**: Maps Slack user data to our format
5. **User Creation**: Selected users are added to the database

### Frontend Flow

1. **Dialog Opens**: Click "Add Employee" button
2. **Fetch Users**: Automatically fetches Slack users
3. **Search & Select**: Users can search and select multiple employees
4. **Add to System**: Selected users are added to the database
5. **Refresh**: Employee table refreshes to show new users

## 🔍 API Endpoints

### Get Slack Users

```
GET /api/users/slack/users
```

**Response:**

```json
{
  "users": [
    {
      "id": "U1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "username": "john_doe",
      "slackId": "U1234567890"
    }
  ]
}
```

### Create User

```
POST /api/users
```

**Request Body:**

```json
{
  "username": "john_doe",
  "slackId": "U1234567890"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch Slack users"**

   - Check your `SLACK_BOT_TOKEN` is correct
   - Verify the app has the required scopes
   - Ensure the app is installed to your workspace

2. **"Database connection error"**

   - Make sure MongoDB is running
   - Check your `MONGODB_URI` in the `.env` file

3. **"User already exists"**
   - The system prevents duplicate users
   - Check if the user is already in the database

### Testing

Run the test script to verify everything is working:

```bash
cd server
node test-slack-api.js
```

## 🎨 Frontend Features

The `AddEmployeeDialog` component includes:

- **Search functionality**: Filter users by name, email, or username
- **Multi-select**: Choose multiple employees at once
- **Loading states**: Shows loading indicators during API calls
- **Error handling**: Displays helpful error messages
- **Success feedback**: Toast notifications for successful operations
- **Avatar display**: Shows user initials for visual identification
- **Name formatting**: Automatically capitalizes the first letter of each word in names

## 🔒 Security Notes

- The Slack bot token should be kept secure
- Only users with the bot token can fetch Slack user data
- The system validates user data before adding to the database
- Duplicate users are prevented automatically

## 📝 Next Steps

After setup:

1. Test the "Add Employee" button on the Employees page
2. Verify new employees appear in the employee table
3. Check that the employee count updates correctly
4. Test the search and filtering functionality

## 🆘 Support

If you encounter issues:

1. Check the server console for error messages
2. Verify your Slack app configuration
3. Ensure MongoDB is running
4. Test the API endpoints manually using the test script
