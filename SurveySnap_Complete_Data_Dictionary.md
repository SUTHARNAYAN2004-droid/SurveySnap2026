# SurveySnap — Complete Data Dictionary

---

## 1. Project Overview

**SurveySnap** is a full-stack MERN web application for creating, sharing, and analyzing surveys.

| Property | Value |
|----------|-------|
| Project Name | SurveySnap |
| Stack | MERN (MongoDB, Express, React, Node.js) |
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB (via Mongoose) |
| Email Service | Nodemailer (Gmail SMTP) |
| File Upload | Multer (local `/uploads` folder) |
| Charts | Recharts |
| Author | Nayan Suthar |

---

## 2. Database Collections (MongoDB)

---

### 2.1 `users` Collection

Stores all registered users including admins.

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `_id` | ObjectId | Auto | — | Unique | MongoDB auto-generated ID |
| `firstName` | String | Yes | — | — | User's first name (split from full name at signup) |
| `lastName` | String | No | `""` | — | User's last name |
| `email` | String | Yes | — | Unique | User's email address |
| `password` | String | Yes | — | Bcrypt hashed | Hashed password (bcryptjs, salt 10) |
| `role` | String | No | `"user"` | `enum: ["user", "admin"]` | User role |
| `profilePic` | String | No | `""` | — | URL or file path of profile picture |
| `status` | String | No | `"active"` | `enum: ["active", "inactive", "deleted", "blocked"]` | Account status |
| `resetOtp` | String | No | `""` | 6 digits | OTP for forgot password flow |
| `resetOtpExpiry` | Date | No | `null` | — | OTP expiry time (10 minutes from generation) |
| `createdAt` | Date | Auto | — | — | Auto timestamp |
| `updatedAt` | Date | Auto | — | — | Auto timestamp |

---

### 2.2 `surveys` Collection

Stores surveys created by users. Questions are embedded directly inside the survey document.

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `_id` | ObjectId | Auto | — | Unique | MongoDB auto-generated ID |
| `title` | String | No | — | — | Survey title |
| `description` | String | No | — | — | Survey description |
| `creator` | ObjectId | No | — | ref: `users` | Reference to the user who created the survey |
| `isPublic` | Boolean | No | `true` | — | Whether survey is publicly accessible via link |
| `status` | String | No | `"active"` | `"active"` or `"closed"` | Survey status (toggled by admin) |
| `questions` | Array | No | `[]` | — | Embedded array of question objects |
| `questions[].text` | String | No | — | — | The question text |
| `questions[].type` | String | No | — | `enum: ["multiple_choice", "rating", "yes_no", "text"]` | Question type |
| `questions[].options` | Array[String] | No | `[]` | — | Answer options (only for multiple_choice) |
| `createdAt` | Date | Auto | — | — | Auto timestamp |
| `updatedAt` | Date | Auto | — | — | Auto timestamp |

---

### 2.3 `responses` Collection

Stores survey responses submitted by respondents.

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `_id` | ObjectId | Auto | — | Unique | MongoDB auto-generated ID |
| `survey` | ObjectId | Yes | — | ref: `surveys` | Reference to the survey being answered |
| `respondentEmail` | String | No | `""` | — | Respondent's email (optional, anonymous allowed) |
| `answers` | Array | No | `[]` | — | Array of answer objects |
| `answers[].questionIndex` | Number | No | — | — | Index of the question in the survey's questions array |
| `answers[].answer` | String | No | — | — | The answer given (text, option, rating number, Yes/No) |
| `createdAt` | Date | Auto | — | — | Auto timestamp |
| `updatedAt` | Date | Auto | — | — | Auto timestamp |

---

### 2.4 `questions` Collection *(Legacy — not actively used)*

Standalone question model. Currently questions are embedded inside surveys, not stored here.

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `_id` | ObjectId | Auto | — | Unique | MongoDB auto-generated ID |
| `survey` | ObjectId | No | — | ref: `surveys` | Reference to parent survey |
| `questionText` | String | Yes | — | — | The question text |
| `questionType` | String | Yes | — | `enum: ["multiple", "text", "rating", "dropdown", "longtext"]` | Question type |
| `options` | Array[String] | No | `[]` | — | Answer options |
| `required` | Boolean | No | `false` | — | Whether question is mandatory |
| `createdAt` | Date | Auto | — | — | Auto timestamp |
| `updatedAt` | Date | Auto | — | — | Auto timestamp |

---

### 2.5 `templates` Collection *(Legacy — not actively used in backend)*

Pre-built survey templates. Currently templates are stored in frontend `data/templates.js` as static data.

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `_id` | ObjectId | Auto | — | Unique | MongoDB auto-generated ID |
| `name` | String | Yes | — | — | Template name |
| `category` | String | No | — | — | Template category (e.g., Feedback, HR, Education) |
| `questions` | Array | No | `[]` | — | Embedded question objects |
| `questions[].questionText` | String | No | — | — | Question text |
| `questions[].questionType` | String | No | — | — | Question type |
| `questions[].options` | Array[String] | No | `[]` | — | Options for MCQ |
| `imageUrl` | String | No | `null` | — | Template preview image URL |
| `createdAt` | Date | Auto | — | — | Auto timestamp |
| `updatedAt` | Date | Auto | — | — | Auto timestamp |

---

### 2.6 `emaillogs` Collection *(Legacy — not actively used)*

Tracks emails sent for survey sharing.

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `_id` | ObjectId | Auto | — | Unique | MongoDB auto-generated ID |
| `survey` | ObjectId | No | — | ref: `surveys` | Reference to the survey |
| `email` | String | No | — | — | Recipient email address |
| `status` | String | No | — | `enum: ["sent", "failed"]` | Email delivery status |
| `createdAt` | Date | Auto | — | — | Auto timestamp |
| `updatedAt` | Date | Auto | — | — | Auto timestamp |

---

## 3. API Routes Reference

### 3.1 Auth Routes — `/api/auth`

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|-------------|----------|-------------|
| POST | `/forgot-password` | `{ email }` | `{ message, otp }` | Generates 6-digit OTP, saves to DB, sends email with link. Also returns OTP in response (demo mode) |
| POST | `/verify-otp` | `{ email, otp }` | `{ message }` | Verifies OTP and checks expiry (10 min) |
| POST | `/reset-password` | `{ email, otp, newPassword }` | `{ message }` | Resets password. Validates OTP + checks new password is not same as old |

---

### 3.2 User Routes — `/api/users`

| Method | Endpoint | Request Body / Params | Response | Description |
|--------|----------|-----------------------|----------|-------------|
| POST | `/register` | `{ name, email, password }` | `{ message, data: user }` | Registers user. Splits name into firstName/lastName. Sends welcome email |
| POST | `/login` | `{ email, password }` | `{ message, user: { id, name, email, role, profilePic } }` | Logs in user. Returns role for redirect logic |
| GET | `/` | — | `[users]` (password excluded) | Fetches all users (admin use) |
| DELETE | `/:id` | params: `id` | `{ message }` | Deletes user by ID (admin or self-delete) |
| PUT | `/:id/profile-pic` | `FormData: profilePic (file)` | `{ message, profilePic }` | Uploads profile pic via Multer. Saves to `/uploads/` |
| PUT | `/:id/profile-pic-url` | `{ profilePic: url }` | `{ message, profilePic }` | Saves avatar URL directly (no file upload) |

---

### 3.3 Admin Routes — `/api/admin`

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|-------------|----------|-------------|
| POST | `/login` | `{ email, password }` | `{ message, user }` | Admin login. Checks `role === "admin"`, returns 403 for regular users |
| GET | `/stats` | — | `{ totalUsers, totalSurveys, totalResponses }` | Returns dashboard stats. `totalUsers` counts only `role: "user"` |

---

### 3.4 Survey Routes — `/api/surveys`

| Method | Endpoint | Request Body / Params | Response | Description |
|--------|----------|-----------------------|----------|-------------|
| GET | `/all` | — | `[surveys]` with creator populated | All surveys (admin). Creator's firstName, lastName, email populated |
| POST | `/create` | `{ title, description, creator, isPublic, status, questions }` | `savedSurvey` | Creates new survey |
| POST | `/response` | `{ surveyId, respondentEmail, answers }` | `{ message }` | Submits response. Sends confirmation email if email provided |
| GET | `/creator/:creatorId` | params: `creatorId` | `[surveys]` | Fetches all surveys by a specific user |
| GET | `/:id/analytics` | params: `id` | `{ survey, totalResponses, analytics[] }` | Returns per-question answer counts and breakdown |
| PUT | `/:id/toggle-status` | params: `id` | `{ message, status }` | Toggles survey status between `active` and `closed` |
| POST | `/share-email` | `{ email, surveyLink, surveyTitle }` | `{ message }` | Sends survey link to given email |
| GET | `/:id` | params: `id` | `survey` | Fetches single survey by ID (public, no auth) |
| DELETE | `/:id` | params: `id` | `{ message }` | Deletes survey by ID |

---

### 3.5 Contact Routes — `/api/contact`

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|-------------|----------|-------------|
| POST | `/` | `{ name, email, message }` | `{ message }` | Sends contact form message to admin email (`EMAIL_USER`) |

---

## 4. Frontend Pages

### 4.1 Public Pages (No Login Required)

| Page | File | Route | Description |
|------|------|-------|-------------|
| Home | `pages/Home.jsx` | `/` | Landing page with hero, features, stats, templates showcase, how-it-works, CTA, footer |
| Login | `pages/auth/Login.jsx` | `/login` | Email + password login. Show/hide password. Role-based redirect (admin → `/admin`, user → `/CreateSurvey`) |
| Signup | `pages/auth/Signup.jsx` | `/signup` | Registration form. Confirm password validation. Profile pic upload modal after signup |
| Forgot Password | `pages/auth/ForgotPassword.jsx` | `/forgot-password` | 3-step OTP flow: Email → OTP verify (with demo OTP box) → New password with real-time match indicator |
| Setup Profile | `pages/auth/SetupProfile.jsx` | `/setup-profile` | Profile picture setup page |
| Contact Us | `pages/ContactUs.jsx` | `/contact` | Contact form. Sends message to admin email |
| Templates | `pages/Templates.jsx` | `/templates` | Browse all 11 pre-built templates |
| Template Detail | `pages/TemplateDetails.jsx` | `/template/:name` | Preview template questions before using |
| Take Survey | `pages/respondent/TakeSurvey.jsx` | `/survey/:id` | Public survey form. Progress bar, all 4 question types, optional email, submit response |

---

### 4.2 User Pages (Protected — requires login)

| Page | File | Route | Layout | Description |
|------|------|-------|--------|-------------|
| Create Survey | `pages/user/CreateSurvey.jsx` | `/CreateSurvey` | None | Survey builder with 4 question types. QR code generation. Email sharing. Template pre-fill support |
| Dashboard | `pages/user/Dashboard.jsx` | `/dashboard` | UserLayout | Lists user's surveys with status badge, question count, delete and analytics buttons |
| Survey Analytics | `pages/user/SurveyAnalytics.jsx` | `/analytics` | UserLayout | Real-time analytics with bar chart + pie chart per question. Response completion rate progress bars |
| View Survey | `pages/user/ViewSurvey.jsx` | `/view-survey/:id` | UserLayout | Detailed view of a specific survey with all questions |

---

### 4.3 Admin Pages (Protected — requires adminToken)

| Page | File | Route | Layout | Description |
|------|------|-------|--------|-------------|
| Admin Login | `pages/admin/AdminLogin.jsx` | `/admin/login` | None | Admin-specific login page |
| Admin Dashboard | `pages/admin/AdminDashboard.jsx` | `/admin` | AdminLayout | Stats cards: Total Users, Total Surveys, Total Responses |
| Manage Users | `pages/admin/ManageUsers.jsx` | `/admin/users` | AdminLayout | User table with profile pic, name, email, role badge, status badge, upload pic, delete (admin row protected) |
| Manage Surveys | `pages/admin/ManageSurveys.jsx` | `/admin/surveys` | AdminLayout | Survey table with title, creator, question count, status badge, toggle status, delete |

---

## 5. Frontend Components

### 5.1 Layout Components

| Component | File | Description |
|-----------|------|-------------|
| UserLayout | `Component/layout/UserLayout.jsx` | Wraps user pages with UserNavbar |
| AdminLayout | `Component/layout/AdminLayout.jsx` | Wraps admin pages with AdminSidebar |

### 5.2 Common Components

| Component | File | Description |
|-----------|------|-------------|
| Logo | `Component/Common/Logo.jsx` | SurveySnap brand logo (SVG + text) |
| Button | `Component/Common/Button.jsx` | Reusable button component |
| Card | `Component/Common/Card.jsx` | Reusable card wrapper |
| InputField | `Component/Common/InputField.jsx` | Reusable input with label |

### 5.3 User Components

| Component | File | Description |
|-----------|------|-------------|
| UserNavbar | `Component/user/UserNavbar.jsx` | Top navigation bar with Create Survey, Analytics, Logout |
| SurveyCard | `Component/user/SurveyCard.jsx` | Survey card display component |
| ResponseChart | `Component/user/ResponseChart.jsx` | Chart visualization for responses |

### 5.4 Admin Components

| Component | File | Description |
|-----------|------|-------------|
| AdminGuard | `Component/admin/AdminGuard.jsx` | Route protection — checks `adminToken` in localStorage |
| AdminSidebar | `Component/admin/AdminSidebar.jsx` | Left sidebar with Dashboard, Users, Surveys navigation links |

---

## 6. Pre-built Survey Templates (Frontend Static Data)

Located in `src/data/templates.js`. 11 templates available:

| ID | Template Name | Questions |
|----|--------------|-----------|
| `customer-feedback` | Customer Feedback | 4 |
| `event-feedback` | Event Feedback | 4 |
| `employee-satisfaction` | Employee Satisfaction | 4 |
| `product-review` | Product Review | 4 |
| `website-feedback` | Website Feedback | 4 |
| `education-feedback` | Education Feedback | 4 |
| `restaurant-feedback` | Restaurant Feedback | 4 |
| `healthcare-feedback` | Healthcare Feedback | 4 |
| `travel-experience` | Travel Experience | 4 |
| `fitness-feedback` | Fitness & Gym Feedback | 4 |
| `college-feedback` | College Feedback | 4 |

Each template contains questions of types: `rating`, `yes_no`, `multiple_choice`

---

## 7. Question Types

| Type | Description | Input UI |
|------|-------------|----------|
| `multiple_choice` | Select one option from list | Radio buttons |
| `rating` | Rate from 1 to 5 | Circular number buttons |
| `yes_no` | Yes or No answer | Two circular buttons |
| `text` | Free text answer | Textarea |

---

## 8. Utility Files

### 8.1 Backend Utilities

| File | Description |
|------|-------------|
| `Utils/DBConnection.js` | Connects to MongoDB using `MONGO_URL` from `.env`. Exits process on failure |
| `Utils/MailUtil.js` | Nodemailer Gmail SMTP transporter. Accepts `to`, `subject`, `text` |
| `Utils/upload.js` | Multer config — saves to `/uploads/`, filename = `timestamp + extension`, max 2MB, allowed: JPEG/PNG/JPG/WebP |
| `Utils/sendEmail.js` | Additional email utility |

### 8.2 Frontend Utilities

| File | Description |
|------|-------------|
| `src/config.js` | Auto-detects backend URL using `window.location.hostname` — works on both localhost and network |
| `src/data/templates.js` | 11 static pre-built survey templates with questions |

---

## 9. Environment Variables

### 9.1 Backend (`Backend/.env`)

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `5000` | Express server port |
| `MONGO_URL` | `mongodb://127.0.0.1:27017/surveysnap` | MongoDB local connection string |
| `EMAIL_USER` | `sutharnayan642@gmail.com` | Gmail address for sending emails |
| `EMAIL_PASSWORD` | `gtea izka gqqe dono` | Gmail App Password (16-char) |
| `FRONTEND_URL` | `http://10.169.7.128:5173` | Frontend URL used in password reset email link |

### 9.2 Frontend (`Frontend/surveysnap-frontend/.env`)

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `http://localhost:5000` | Backend API base URL |

---

## 10. Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.19.2 | Web framework |
| `mongoose` | ^7.6.0 | MongoDB ODM |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `nodemailer` | ^6.9.13 | Email sending |
| `multer` | ^2.1.1 | File upload handling |
| `cors` | ^2.8.6 | Cross-origin requests |
| `dotenv` | ^17.3.1 | Environment variables |
| `jsonwebtoken` | ^9.0.3 | JWT (installed, not yet used) |
| `nodemon` | ^3.1.14 | Dev auto-restart |

---

## 11. Frontend Dependencies

| Package | Purpose |
|---------|---------|
| `react` + `react-dom` | UI framework |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP requests |
| `react-hook-form` | Form handling and validation |
| `recharts` | Bar charts and Pie charts for analytics |
| `qrcode.react` | QR code generation for survey links |
| `tailwindcss` | Utility-first CSS framework |
| `@tailwindcss/vite` | Tailwind Vite plugin |
| `vite` | Build tool and dev server |

---

## 12. Application Flow Summary

### User Registration Flow
1. User fills Signup form (name, email, password, confirmPassword)
2. Backend splits name → firstName + lastName
3. Password hashed with bcrypt (salt 10)
4. User saved to `users` collection
5. Welcome email sent via Nodemailer
6. Profile pic upload modal shown (optional, can skip)

### Login Flow
1. User submits email + password
2. Backend verifies password with bcrypt
3. Returns user object with `role`
4. Frontend checks role → admin goes to `/admin`, user goes to `/CreateSurvey`
5. User data stored in `localStorage`

### Forgot Password Flow
1. User enters email → OTP generated (6 digits, 10 min expiry)
2. OTP saved to `users.resetOtp` + `users.resetOtpExpiry`
3. Email sent with OTP + link to `/forgot-password`
4. OTP also returned in API response (demo mode — shown on screen)
5. User enters OTP → verified against DB
6. User sets new password → validated not same as old → hashed and saved
7. OTP cleared from DB

### Survey Creation Flow
1. User fills survey title, description, adds questions
2. Each question has type + options (for MCQ)
3. Survey saved to `surveys` collection with creator reference
4. Share link generated: `{origin}/survey/{surveyId}`
5. QR code generated from link (downloadable)
6. Email sharing available to any email address

### Survey Response Flow
1. Respondent opens `/survey/:id` (no login needed)
2. Survey loaded from backend
3. Progress bar shows answered/total
4. Respondent fills all questions + optional email
5. Response saved to `responses` collection
6. Confirmation email sent if email provided

### Analytics Flow
1. User selects survey from dropdown
2. Backend aggregates all responses per question
3. Returns answer counts per option
4. Frontend renders Bar chart + Pie chart per question
5. Progress bars show completion rate per question
  