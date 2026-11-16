# User Management System

A server-rendered user management web app built with **Node.js, Express and MongoDB**.
Users can sign up, log in, reset a forgotten password by email, and manage user records.
Regular users can edit only their own profile; admins can edit any user.

## Features

- **Authentication:** sign up and log in, with passwords hashed using bcrypt
- **Sessions:** login sessions stored in MongoDB (`express-session` + `connect-mongo`)
- **Password reset:** a one-hour reset token sent by email through SendGrid (Nodemailer)
- **Roles:** `user` and `admin`, checked on the server before an edit is allowed
- **User records:** list, edit and delete users
- **Profile images:** image upload with Multer
- **Security:** CSRF protection on forms (`csurf`) and server-side input validation (`express-validator`)
- **Error pages:** custom 404 and 500 pages

## Tech stack

| Layer | Tools |
| --- | --- |
| Server | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Views | EJS templates, CSS |
| Auth | bcryptjs, express-session, connect-mongo, connect-flash |
| Email | Nodemailer + SendGrid |
| Uploads | Multer |

## Project structure

```
server.js        App setup: middleware, sessions, CSRF, routes, error handling
router/          Route definitions (auths.js, user.js)
controller/      Request handlers (auths.js, user.js, error.js)
model/user.js    Mongoose user schema
views/           EJS pages (signup, login, reset, edit, index, 404, 500)
public/css/      Styles
uploads/         Uploaded images (not committed)
```

## Routes

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/` | Home page |
| GET, POST | `/signup` | Create an account |
| GET, POST | `/login` | Log in |
| POST | `/logout` | Log out |
| GET, POST | `/reset` | Request a password-reset email |
| GET | `/reset/:token` | Open the new-password form from the email link |
| POST | `/newPassword` | Save the new password |
| GET | `/index` | List all users |
| GET | `/edit/:id` | Edit form for one user |
| POST | `/edit` | Save user changes |
| POST | `/delete/:id` | Delete a user |

## Getting started

Requirements: **Node.js 20.12 or newer** and a MongoDB database (for example a free MongoDB Atlas cluster).

```bash
git clone https://github.com/m7ohMasri/user-management.git
cd user-management
npm install
cp .env.example .env   # then fill in your own values
npm start
```

The app runs at http://localhost:3000.

## Configuration

All secrets are read from environment variables (loaded from `.env`). See `.env.example`:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `SESSION_SECRET` | Secret used to sign session cookies |
| `SENDGRID_API_KEY` | SendGrid key for password-reset emails |
| `MAIL_FROM` | Sender address for those emails |
| `APP_URL` | Base URL used in the reset link |
| `PORT` | Port to listen on (default 3000) |
