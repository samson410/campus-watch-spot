# Campus Watch

Build a modern, responsive web application called CampusSafe – Security Incident Mapping System.

Project Overview

CampusSafe is a security incident reporting and mapping platform designed for university campuses, hostels, and student residential areas. The platform allows students, hostel residents, and villa mates to report security incidents, view incidents on an interactive map, and help campus security identify crime hotspots and respond faster.

The UI should be clean, professional, mobile-friendly, and suitable for a university environment.

User Roles

1. Student/User

Register and login securely.

Report security incidents.

View incidents on a campus map.

View recent incidents.

Track the status of their reports.

Choose to submit reports anonymously.

2. Security Officer

View all submitted incidents.

Verify or reject reports.

Update incident status.

View hotspot analytics.

Manage incident responses.

3. Administrator

Manage users and security officers.

View platform analytics.

Monitor reports.

Generate incident summaries.

Core Features

Authentication

User registration and login.

Role-based access control (Student, Security Officer, Admin).

Password reset functionality.

Incident Reporting

Create a report form with:

Incident Title

Incident Type Dropdown:

Theft

Assault

Harassment

Vandalism

Suspicious Activity

Missing Item

Emergency

Other

Description

Date and Time

Location Selection

GPS Coordinates

Image Upload

Anonymous Reporting Toggle

When a report is submitted:

Save it to the database.

Display it on the map immediately.

Assign default status = "Pending Verification".

Interactive Security Map

Use OpenStreetMap with Leaflet.

Features:

Display all incidents as markers.

Marker colors:

Red = High Severity

Orange = Medium Severity

Green = Resolved

Blue = Verified

Click marker to view incident details.

Filter by:

Incident Type

Date

Status

Severity

Search locations.

Campus Hotspot Analysis

Create a heatmap layer showing incident concentrations.

Display:

Most dangerous areas.

Incident frequency by location.

Weekly and monthly trends.

Top reported incident categories.

Incident Feed

Create a dashboard showing:

Latest incidents.

Verified incidents.

Resolved incidents.

Emergency reports.

Each incident card should display:

Title

Type

Location

Time reported

Status

Severity level

Security Dashboard

Provide a dedicated dashboard for security officers.

Widgets:

Total Incidents

Verified Incidents

Pending Reports

Resolved Incidents

Emergency Alerts

Charts:

Incidents by category

Incidents by month

Incidents by location

Resolution rate

Admin Dashboard

Provide:

User management

Incident management

Analytics

Report export functionality

Security activity logs

Emergency Alert System

Create a high-priority alert feature.

If a user submits an Emergency report:

Highlight it immediately.

Display alert banner.

Show alert on dashboard.

Send notifications to security officers.

Notification System

Include:

New report notifications

Status update notifications

Emergency alerts

Use real-time updates where possible.

Database Structure

Users:

id

fullName

email

role

hostel

password

createdAt

Incidents:

id

userId

title

category

description

severity

latitude

longitude

locationName

imageUrl

status

isAnonymous

verifiedBy

createdAt

Comments:

id

incidentId

userId

comment

createdAt

Design Requirements

Modern university security theme.

Clean dashboard layout.

Mobile-first responsive design.

Dark mode and light mode support.

Accessible UI.

Professional color palette using blue, white, gray, and security-alert accent colors.

Interactive charts and maps.

Recommended Tech Stack

Frontend:

React

TypeScript

Tailwind CSS

shadcn/ui

Leaflet Maps

Backend:

Supabase

Database:

PostgreSQL (via Supabase)

Authentication:

Supabase Auth

Storage:

Supabase Storage for incident images

Charts:

Recharts

Additional Requirements

Seed the application with sample incidents.

Create realistic demo data.

Include role-based route protection.

Include loading states and error handling.

Include a landing page explaining the platform.

Include a contact page.

Include an about page.

Ensure the application is production-ready and visually polished.

Generate all pages, components, database schema, Supabase configuration, responsive layouts, and sample data necessary for a fully functional MVP.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://campus-watch-spot.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7a3807db-2667-4cee-8029-f7572e215921).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
