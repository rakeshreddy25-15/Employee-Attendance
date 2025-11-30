# Employee Attendance System

A modern full-stack Employee Attendance System with real-time check-in/out, calendar tracking, detailed summaries, and manager dashboards. Built using **React, Vite, TypeScript, ShadCN UI, Zustand**, and powered by a **Node.js + Express + MongoDB backend**.

---

## 🚀 Features

### 👨‍💼 Employee Features
- Register / Login  
- Check In / Check Out  
- View attendance history (calendar + table)  
- Monthly summary (Present / Absent / Late / Half-Day)  
- Dashboard with recent stats  
- Profile management  

### 🧑‍💼 Manager Features
- Login  
- View all employees' attendance  
- View team calendar  
- Filter by employee, date, status  
- Team summary analytics  
- Export attendance reports (CSV)  
- Dashboard with insights (trends, department-wise attendance, late arrivals)  

---

## 🛠️ Tech Stack

### **Frontend**
- React 18  
- Vite  
- TypeScript  
- ShadCN UI (Radix + Tailwind)  
- Zustand (state management)  
- React Router  
- Axios  
- Recharts (analytics)  

### **Backend**
- Node.js  
- Express  
- MongoDB + Mongoose  
- JWT authentication  
- REST API architecture  

---

## 📁 Project Structure (Frontend)

/
├── public/
├── src/
│ ├── components/
│ ├── pages/
│ ├── hooks/
│ ├── store/ (Zustand)
│ ├── lib/
│ ├── routes/
│ ├── App.tsx
│ └── main.tsx
├── package.json
├── index.html
└── README.md

yaml
Copy code

---
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── logger.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── attendance.controller.js
│   │   ├── dashboard.controller.js
│   │   └── user.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── models/
│   │   ├── User.model.js
│   │   └── Attendance.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── attendance.routes.js
│   │   ├── dashboard.routes.js
│   │   └── user.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── attendance.service.js
│   │   ├── dashboard.service.js
│   │   └── user.service.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── response.js
│   │   └── csvExporter.js
│   │
│   ├── seed/
│   │   ├── seedUsers.js
│   │   └── seedAttendance.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── package.json
└── README.md

## 🔧 Environment Variables

Create an `.env` file in your **backend** (not frontend):

PORT=4000
NODE_ENV=development
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secure-secret
API_KEY=your-api-key

markdown
Copy code

Also create a **frontend** `.env` if needed:

VITE_API_URL=http://localhost:4000

yaml
Copy code

---

## 🏗️ Installation & Setup

### **1. Clone the Project**
```sh
git clone <your-repo-url>
cd employee-attendance-system
▶️ Frontend Setup
Install dependencies
sh
Copy code
cd client
npm install
Run development server
sh
Copy code
npm run dev
🗄️ Backend Setup
sh
Copy code
cd server
npm install
npm run dev
Backend runs on:

arduino
Copy code
http://localhost:4000
📡 API Endpoints
🔐 Auth
bash
Copy code
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
👨‍💼 Employee Attendance
bash
Copy code
POST /api/attendance/checkin
POST /api/attendance/checkout
GET  /api/attendance/my-history
GET  /api/attendance/my-summary
GET  /api/attendance/today
🧑‍💼 Manager Attendance
pgsql
Copy code
GET /api/attendance/all
GET /api/attendance/employee/:id
GET /api/attendance/summary
GET /api/attendance/export (CSV)
GET /api/attendance/today-status
📊 Dashboards
bash
Copy code
GET /api/dashboard/employee
GET /api/dashboard/manager
All API details based on project specification 
Task-2 Employee Attendance Syst…


📅 Core Screens
Employee
Dashboard

Mark Attendance (Check In/Out)

Attendance History (Calendar + Table)

Profile

Manager
Dashboard

Team Attendance

Reports & CSV Export

Calendar View

📸 Screenshots (Add your images)
markdown
Copy code
/assets/screenshots/
  - employee-dashboard.png
  - manager-dashboard.png
  - attendance-history.png
Add them here and reference them like:

md
Copy code
![Employee Dashboard](./assets/screenshots/employee-dashboard.png)
🧪 Seed Data (Optional)
Insert sample users:

pgsql
Copy code
Employee Login: employee@example.com / password
Manager Login : manager@example.com / password
