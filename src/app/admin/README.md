# Admin Dashboard

This is the admin dashboard for managing volunteers and suggestions.

## Access

The admin dashboard is protected with HTTP Basic Authentication.

**URL:** `/admin`

**Authentication:**
- Username: `admin` (or any username)
- Password: Set via `ADMIN_PASSWORD` environment variable

## Setup

1. Add `ADMIN_PASSWORD` to your `.env.local` file:
   ```
   ADMIN_PASSWORD=your_secure_password_here
   ```

2. Access the dashboard at `http://localhost:3000/admin`

3. When prompted, enter any username and the password you set

## Features

### Volunteers Tab
- View all volunteer submissions
- See contact details (name, phone, email)
- Check their city and interest (food drives, teaching, or both)
- View availability information
- Sort by submission date

### Suggestions Tab
- View all suggestions submitted
- See submitter name and email (if provided)
- Read full suggestion messages
- Sort by submission date

## Security

- Protected by HTTP Basic Authentication
- Only accessible with correct admin password
- All API routes under `/api/admin/*` are also protected
- Password is stored securely in environment variables

## API Endpoints

- `GET /api/admin/volunteers` - Fetch all volunteers
- `GET /api/admin/suggestions` - Fetch all suggestions

Both endpoints are protected by the same authentication middleware.
