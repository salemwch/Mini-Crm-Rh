# 📦 Mini CRM RH — Backend
A secure, modular, and scalable backend for managing HR–enterprise relationships, built using **NestJS** with role-based access control, audit logs, email verification, and more.
 # Tech Stack : 
 RuntTime: Nodejs,
 Language: typescript,
 FrameWork: NestJs,
 Database: MongoDB + mongoose,
 Auth: JWT (access + refresh ) + HttpOnly cookies
 authorization: role based access control 
 email:  mailtrap + nodemailer,
 Docs: Swagger (auto generated) 
 validation: DTO + class-validator
 File Upload: Multer 

#  Key Features : 
**Secure Authentication** : 
 Email/password-based login
JWT with HttpOnly cookies
Refresh token system
Session expiration logic
**Email Verification Flow**:
A user **must verify their email** before they can log in.
If not verified, the backend blocks login and returns a message to verify his email.
 Email contains a **JWT-based secure token**
 Token expires in **10 minutes** by default


 **RBAC - Role-Based Access Control**:
 Roles: `admin`, `rh`
Protected routes using `@Roles()` + custom Guards
Only admins can:
  Create other admin users
  Access audit logs and global stats

  **Audit Logs**
  Every sensitive action (create, update, delete) is logged
Tracks:
  **Who** performed the action
  **What** resource was touched
  **When** it happened
Useful for internal monitoring and debugging
**Search, Filter, and Pagination**:
 All major lists (enterprises, contacts, feedbacks):
  Full-text search
  Filtering by parameters (e.g., by name, status, dates)
  Paginated responses with:
    `page`
    `limit`
    `total`
    `totalPages`
    **Admin Dashboard & Statistics** : 
    Admins can access a dashboard with key CRM stats:
 
 Number of Enterprises,Number of Contacts,Number of Feedbacks,Number of Uploaded Documents
    **folders**: auth,user,enterprise,contact,feedback,audit-log,document,mailtrap,guards,common,dashboard
**API Documentation**
Swagger auto-generated docs available at:
http://localhost:3000/api



