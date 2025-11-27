# EventHub – MERN Event Management System (Local MongoDB)

## Overview
Minimal production-ready MERN scaffold (local MongoDB) implementing:
- User registration/login (JWT)
- Roles: organizer, attendee
- Event CRUD (organizers)
- Event browsing, search, filter
- Booking and booking history

## Run locally
### Backend
1. `cd server`
2. Copy `.env.example` to `.env` and set values (default MONGO_URI uses local mongodb://localhost:27017/eventhub)
3. `npm install`
4. `npm run seed` (optional - seeds sample users/events)
5. `npm run dev` (starts server on PORT)

### Frontend
1. `cd client`
2. `npm install`
3. `npm start`

Default API base URL used by client: http://localhost:5000

