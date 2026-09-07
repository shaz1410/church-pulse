# ChurchPulse

ChurchPulse is a modern church membership management system designed to help churches efficiently manage their congregation.

The application provides a secure platform where administrators can register new members, manage membership records, track church growth, and generate insightful reports through an intuitive dashboard.

## Features

- Secure administrator authentication
- Role-based access control
- Member registration and profile management
- Member search and filtering
- Soft deletion (deregistration with audit history)
- Dashboard with membership statistics
- Ministry management
- Export reports (PDF/Excel)
- Responsive design for desktop and mobile
- Secure REST API

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- JWT Authentication

### Database
- PostgreSQL

## Project Goals

The goal of ChurchPulse is to replace manual membership registers with a secure, scalable, and user-friendly digital solution that enables church leaders to make informed decisions using accurate membership data.

## Future Enhancements

- Attendance tracking
- QR code member cards
- Email notifications
- SMS integration
- Event registration
- Volunteer management
- Prayer request management
- Donations and contributions tracking
- Analytics dashboard


## HOW TO  RUN 
Terminal 1:

cd C:/Users/mthem/church-pulse/backend
dotnet run

Terminal 2:

cd C:/Users/mthem/church-pulse/frontend
npm run dev

## GUIDLINE TO RUN
1. Start PostgreSQL

Make sure your PostgreSQL service is running first.

2. Start the backend

Open Terminal 1:
cd C:/Users/mthem/church-pulse/backend

Then:
dotnet run

You should see:
Now listening on: http://localhost:5204

Application started.
Leave this terminal running.

Your API is now available at:
http://localhost:5204

Swagger should be available at:
http://localhost:5204/swagger

3. Start the frontend

Open Terminal 2 — don't stop the backend terminal.

Go to your frontend folder:
cd C:/Users/mthem/church-pulse/frontend

Then:
npm run dev

You should see something like:
Local: http://localhost:5173/

Open:
http://localhost:5173
