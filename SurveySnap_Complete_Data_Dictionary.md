# SurveySnap — Complete Data Dictionary
> Backend: Node.js + Express + MongoDB (Mongoose) | Frontend: React + Vite + Tailwind CSS

---

## DATABASE COLLECTIONS

### 1. Collection: `users`
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| _id | ObjectId | Auto | Auto | Primary Key | Unique user ID |
| firstName | String | Yes | — | — | First name (signup mein name split hota hai) |
| lastName | String | No | `""` | — | Last name (single word name ho to empty) |
| email | String | Yes | — | Unique | Login email |
| password | String | Yes | — | bcrypt hashed | Encrypted password |
| role | String | No | `"user"` | Enum: `user`, `admin` | Access level |
| profilePic | String | No | `""` | URL | Uploaded photo ya avatar URL |
| status | String | No | `"active"` | Enum: `active`, `inactive`, `deleted`, `blocked` | Account status |

---

### 2. Collection: `surveys`
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| _id | ObjectId | Auto | Auto | Primary Key | Survey ID — share link mein use hota hai |
| title | String | No | — | — | Survey ka naam |
| description | String | No | — | — | Survey description |
| creator | ObjectId | No | — | Ref: `users` | Survey banane wale user ka ID |
| isPublic | Boolean | No | `true` | — | Public link se accessible hai ya nahi |
| status | String | No | `"active"` | `active` / `closed` | Admin/creator toggle kar sakta hai |
| questions | [Object] | No | `[]` | — | Embedded questions array |
| questions.text | String | — | — | — | Question ka text |
| questions.type | String | — | — | Enum: `multiple_choice`, `rating`, `yes_no`, `text` | Question type |
| questions.options | [String] | — | — | — | MCQ ke options |
| createdAt | Date | Auto | Auto | — | Creation timestamp |
| updatedAt | Date | Auto | Auto | — | Last update timestamp |

---

### 3. Collection: `responses`
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| _id | ObjectId | Auto | Auto | Primary Key | Response ID |
| survey | ObjectId | Yes | — | Ref: `surveys` | Kis survey ka response hai |
| respondentEmail | String | No | `""` | — | Optional — confirmation email ke liye |
| answers | [Object] | No | `[]` | — | Answers array |
| answers.questionIndex | Number | — | — | — | Question ka index (0-based) |
| answers.answer | String | — | — | — | Respondent ka jawab |
| createdAt | Date | Auto | Auto | — | Submit timestamp |

---

### 4. Collection: `templates`
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| _id | ObjectId | Auto | Auto | Primary Key | Template ID |
| name | String | Yes | — | — | Template naam |
| category | String | No | — | — | Category (e.g. feedback, research) |
| questions | [Object] | No | `[]` | — | Pre-defined questions |
| questions.questionText | String | — | — | — | Question text |
| questions.questionType | String | — | — | — | Question type |
| questions.options | [String] | — | — | — | Options |
| imageUrl | String | No | `null` | — | Template preview image |
| createdAt | Date | Auto | Auto | — | — |

---

### 5. Collection: `emaillogs`
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| _id | ObjectId | Auto | Auto | Primary Key | Log ID |
| survey | ObjectId | No | — | Ref: `surveys` | Kis survey ke liye email gaya |
| email | String | No | — | — | Recipient email |
| status | String | No | — | Enum: `sent`, `failed` | Email delivery status |
| createdAt | Date | Auto | Auto | — | — |

---

## BACKEND API ENDPOINTS

### User Routes — `/api/users`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Signup — name split into firstName/lastName, password bcrypt hash |
| POST | `/api/users/login` | Login — returns user object with profilePic |
| GET | `/api/users/` | Sab users fetch (password exclude) — admin use |
| DELETE | `/api/users/:id` | User delete — admin ya self-delete |
| PUT | `/api/users/:id/profile-pic` | Profile pic file upload (multer) |
| PUT | `/api/users/:id/profile-pic-url` | Avatar URL save |

### Admin Routes — `/api/admin`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login — role `admin` check karta hai, 403 if not admin |
| GET | `/api/admin/stats` | Real-time stats — totalUsers, totalSurveys, totalResponses |

### Survey Routes — `/api/surveys`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/surveys/all` | Sab surveys (admin use) |
| POST | `/api/surveys/create` | Survey create — questions embedded |
| POST | `/api/surveys/response` | Response submit + optional confirmation email |
| GET | `/api/surveys/creator/:creatorId` | Creator ke surveys fetch |
| GET | `/api/surveys/:id/analytics` | Survey analytics — per question answer counts |
| PUT | `/api/surveys/:id/toggle-status` | Status toggle active ↔ closed |
| GET | `/api/surveys/:id` | Single survey by ID — public, no auth |
| DELETE | `/api/surveys/:id` | Survey delete |

---

## FRONTEND PAGES

### Auth Pages
| Page | Route | Description |
|------|-------|-------------|
| Login.jsx | `/login` | Email/password login, show/hide password, redirect to `/CreateSurvey` |
| Signup.jsx | `/signup` | Signup with confirm password, profile pic upload modal after signup |
| AdminLogin.jsx | `/admin/login` | Admin only login, saves `adminToken` + `adminUser` in localStorage |

### User Pages
| Page | Route | Description |
|------|-------|-------------|
| CreateSurvey.jsx | `/CreateSurvey` | Survey create — MCQ/Rating/Yes-No questions, backend save, shareable link + QR generate |
| Dashboard.jsx | `/dashboard` | User surveys list, delete account option |
| SurveyAnalytics.jsx | `/analytics` | Real-time charts (bar + pie) from backend, progress bars per question |

### Respondent Pages
| Page | Route | Description |
|------|-------|-------------|
| TakeSurvey.jsx | `/survey/:id` | Public — no login, progress bar, optional email, response save to backend |

### Admin Pages
| Page | Route | Description |
|------|-------|-------------|
| AdminDashboard.jsx | `/admin` | Real-time stats from backend |
| ManageUsers.jsx | `/admin/users` | Users list, delete (admin row pe delete nahi), profile pic upload |
| ManageSurveys.jsx | `/admin/surveys` | Surveys list, status toggle, delete |

---

## KEY FEATURES IMPLEMENTED

| Feature | Status | Details |
|---------|--------|---------|
| User Signup/Login | ✅ | bcrypt password, show/hide, confirm password |
| Admin Login | ✅ | Role check, adminToken localStorage |
| Profile Pic Upload | ✅ | Multer file upload, modal on signup |
| Survey Create | ✅ | MCQ, Rating, Yes/No, Text questions |
| Shareable Link | ✅ | `/survey/:id` — public, no login |
| QR Code Generate | ✅ | `qrcode.react` — scan to open survey |
| Response Save | ✅ | MongoDB mein save, anonymous ya email |
| Confirmation Email | ✅ | Nodemailer — optional, on response submit |
| Survey Analytics | ✅ | Bar + Pie charts, progress bars, real backend data |
| Survey Status Toggle | ✅ | active/closed — admin + creator |
| Admin Dashboard Stats | ✅ | Real-time users/surveys/responses count |
| Manage Users | ✅ | List, delete, profile pic — admin row protected |
| Manage Surveys | ✅ | List, toggle status, delete |
| Delete Account | ✅ | User dashboard se self-delete |
| Mobile Access | ✅ | Vite `host: true` — same WiFi pe mobile access |
| Progress Tracking | ✅ | TakeSurvey mein answered/total progress bar |

---

## RELATIONSHIPS

| From | Field | To | Type |
|------|-------|----|------|
| surveys | creator | users | Many-to-One |
| responses | survey | surveys | Many-to-One |
| emaillogs | survey | surveys | Many-to-One |

---

## TECH STACK

| Layer | Technology |
|-------|------------|
| Database | MongoDB (NoSQL) |
| ODM | Mongoose |
| Backend | Node.js + Express.js (port 5000) |
| Frontend | React.js + Vite (port 5173) |
| Styling | Tailwind CSS v4 |
| Password | bcryptjs |
| Email | Nodemailer (Gmail) |
| File Upload | Multer (local `/uploads` folder) |
| Charts | Recharts |
| QR Code | qrcode.react |
| Form | react-hook-form |
| HTTP | Axios |

---

## ENVIRONMENT VARIABLES (Backend/.env)
| Variable | Value | Use |
|----------|-------|-----|
| PORT | 5000 | Server port |
| MONGO_URL | mongodb://127.0.0.1:27017/surveysnap | MongoDB connection |
| EMAIL_USER | Gmail address | Nodemailer sender |
| EMAIL_PASSWORD | Gmail app password | Nodemailer auth |
