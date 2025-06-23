# 🧠 Therapy Session Management Platform

A modern, secure, and scalable platform for managing therapy sessions, patients, appointments, and professionals like therapists, doctors, and physiotherapists.

> Built with Node.js, Express, PostgreSQL (Prisma ORM), TypeScript, and Zod — fully customizable and production-ready.

---

## 🔍 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Folder Structure](#-folder-structure)
- [API Endpoints](#-api-endpoints)
- [Security Features](#-security-features)
- [Future Improvements](#-future-improvements)

---

## ✅ Features

- 👨‍⚕️ Multiple user roles: Patient, Doctor, Therapist, Admin, Receptionist
- 📅 Advanced Appointment Scheduling (daily, weekly, monthly, one-time, range)
- 📑 Patient Records & Session Notes
- 💳 Payment Integration with Status Tracking
- 🔒 JWT-based Authentication & Authorization
- 📧 Email-based Password Reset (secure token)
- 🌐 RESTful API architecture with versioning (`/api/v1`)
- 📊 Feedback & Review System
- 🔔 Notifications & Reminders (future-ready)
- 🛠️ Fully typed with TypeScript & validated with Zod

---

## 🚀 Tech Stack

| Technology      | Description                        |
|----------------|------------------------------------|
| **Node.js**     | JavaScript runtime                |
| **Express.js**  | Web framework                     |
| **Prisma ORM**  | Type-safe database access         |
| **PostgreSQL**  | Relational database               |
| **TypeScript**  | Static typing                     |
| **Zod**         | Schema validation                 |
| **JWT**         | Secure authentication             |
| **Nodemailer**  | Email system                      |

---

## ⚙️ Installation

```bash
# 1. Clone the project
git clone https://github.com/your-username/therapy-platform.git

# 2. Navigate into the project directory
cd therapy-platform

# 3. Install dependencies
npm install

# 4. Setup the database
npx prisma migrate dev --name init

# 5. Start the server
npm run dev
