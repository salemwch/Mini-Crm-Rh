# 🧠 Mini-Crm-Rh – HR & Job Management Platform

A full-stack, production-grade HR and recruitment platform built with **NestJS**, **MongoDB**, and **React 19**. Designed for secure user management, real-time collaboration, role-based access, and smart automation.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT Access + Refresh Tokens via **HttpOnly Cookies**
- **Google OAuth2** integration with email confirmation
- Custom **role-based access control (RBAC)**: 
  - Only one `Admin` account allowed during initial registration
  - Users default to `RH` role
  - Admins can create new admin accounts securely

### 🧠 Core Modules
- **Absence Management** with approval workflows & notifications
- **Enterprise & Job Offers** CRUD with search, filters & pagination
- **Live Group Chat** between users and admin (Socket.IO)
- **Online Presence System** to show who's online
- **Audit Logging** for every major action (CRUD, auth events)
- **Event System**: Admin events trigger dashboard notifications
- **Document Uploads & Feedback Forms** with tracking
- **Dashboard Analytics** for admins

### 🕒 Automation
- **Cron jobs** to auto-expire job offers based on end dates (runs daily at midnight)

---

## 🧱 Tech Stack

### ✅ Backend
- **NestJS 11 (TypeScript)**
- **MongoDB** via Mongoose
- **Passport.js + Google OAuth2**
- **Nodemailer**, **Argon2**, **Multer**, **Swagger**, **Schedule Module**
- REST API + **WebSockets (Socket.IO)**
- HttpOnly Cookie Auth Strategy + Interceptors for silent token refresh

### ✅ Frontend
- **React 19**, **Redux Toolkit**
- **Tailwind CSS**, **Framer Motion**, **React Icons**, **Lucide**
- **Socket.io-client**, **JWT Decode**, **JS Cookie**
- **React Big Calendar**, **Chart.js**, **Lottie Animations**
- Private Routes, Global AuthProvider, File Uploads, Drag & Drop

---

## 📂 Folder Structure

### Backend Modules (NestJS):
absence,auditlog,auth,common,contact,conversation,dashboard,document,enterprise,events,feedback,guards,hook,joboffer,mailtrap,user,
### frontend Modules (ReactJS):
assets,auth,componenets,pages(admin(contacts,CreateAdmin,dashboard,Documents,enterprise,events,feedback,health,hooks,jobOffer,notificationDropDown,profile,userInfo,UserTable),enterprise,rh(contacts,createjobOffer,dashboardCard,enterprise,enterpriseDocument,events,sectionProfile, rhDashboard), conversation)
