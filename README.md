# Elevate

*The skills economy, reimagined.*

Elevate (formerly SkillSwap) is a peer-to-peer skill exchange platform where users trade knowledge instead of money — teach what you know, learn what you don't. Built for SDC Round 2 submission and as an IDP college project.

> 🚧 **Live deployment in progress.** Links below will be added once Vercel and Render deployments are complete.

- **Live App:** _coming soon_
- **Backend API:** _coming soon_
- **Frontend Repo:** https://github.com/mdsufiyan04/skillswap-frontend (this repo)
- **Backend Repo:** https://github.com/mdsufiyan04/skillswap-backend

---

## What is Elevate?

Most people have skills worth teaching and skills they want to learn. Elevate connects them directly — no payment, no middleman. Find someone who wants to learn what you teach and teaches what you want to learn, send a request, and once accepted you get a full shared workspace to run the exchange: scheduling, video calls, resources, chat, and reviews.

Beyond 1:1 exchanges, Elevate also has a **Projects** module — post a project idea, define roles you need filled, let people apply, and run the whole collaboration (team chat, Kanban tasks, project wall) inside the platform.

## Screenshots

| Landing Page | Dashboard | Browse Skills |
|---|---|---|
| _[add screenshot]_ | _[add screenshot]_ | _[add screenshot]_ |

| Exchange Workspace | Chat | Projects |
|---|---|---|
| _[add screenshot]_ | _[add screenshot]_ | _[add screenshot]_ |

> Demo GIF: _[add link or embed here]_

---

## Features

### Authentication
- Register with name, email, password, username, and college
- JWT-based login (7-day token expiry)
- Protected routes that redirect to login if unauthenticated
- Logout clears local session

### Skills
- Add skills you **offer** (highlighted green) or **want** (highlighted blue)
- Categorize by name, category, level, and description
- Delete skills you've added

### Browse
- Search by skill name
- Filter by category and type (offer/want)
- View any user's real profile
- Send a request directly from a skill card

### Requests
- Send a request with a custom message
- Incoming and Outgoing tabs to track both directions
- Accept a request → automatically creates an Exchange
- Decline requests you're not interested in

### Exchange Workspace
- Full collaborative workspace per exchange, organized into tabs:
  - **Overview** — progress tracking, session count, next session scheduling
  - Auto-generated Google Meet link for sessions
  - **Resources** — shared links between both users
  - **Chat** — real-time-feeling chat (3-second polling) pulled from the backend
  - **Reviews** — leave a rating and review after completion
- Mark sessions complete and end the exchange when finished

### Chat
- Real messages persisted via the backend, refreshed every 3 seconds
- Auto-scrolls to the latest message
- Sidebar lists all active exchanges
- Visually distinct bubbles for sent (black) vs received (white) messages

### Profiles
- **Public profile** — real user data, skills offered/wanted, reviews, and rating, with a "Request Exchange" button
- **My Profile** — separate add buttons for Offer vs Want skills, inline editable profile fields, a profile-completion progress bar, and real skills/reviews pulled from the database

### Projects
- Browse projects with search and category/stage filters
- Post a project with defined roles and skills needed
- Project detail page with four tabs: Overview, Team, Workspace, Resources
- Apply to a role with a contribution-level and message
- Project admin can accept or decline applications
- Group chat for the project team (3-second polling)
- Kanban-style task board (To Do / In Progress / Done)
- Project Wall for posting updates
- **My Projects** page split into Created, Contributing, and Applied

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Animations | Framer Motion |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| ORM | Prisma |
| Database | PostgreSQL (Supabase) |
| Auth | JWT + bcryptjs |
| Deployment | Vercel (frontend) + Render (backend) |

## Design System

Elevate's UI follows a deliberately minimal, high-contrast aesthetic inspired by Apple, Linear, and Vercel:

- **Background:** `#FFFFFF` and `#F5F5F7`
- **Text:** `#1D1D1F` (primary) and `#6E6E73` (secondary)
- **Buttons:** Black pill-shaped buttons only
- **Cards:** White with a 1px `#D2D2D7` border, no shadows
- **Typography:** Inter, tight letter-tracking
- **Motion:** Framer Motion fade-up and stagger animations, with floating animated cards on the hero section

---

## Project Structure

```
peer/
├── skillswap-frontend/     → React frontend (this repo)
└── skillswap-backend/      → Node.js + Express backend
```

**Frontend**
```
skillswap-frontend/
├── src/
│   ├── pages/            # Landing, Auth, Dashboard, Browse, Profile, Exchange, Projects, etc.
│   ├── components/       # navbar, cards, ui, chat
│   ├── context/          # AuthContext, ThemeContext
│   ├── api/               # axios instance + service functions
│   └── data/              # dummy data (dev/testing)
```

**Backend**
```
skillswap-backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── routes/            # auth, users, skills, requests, exchanges, projects
│   ├── middleware/         # authMiddleware
│   └── app.js
```

---

## Database Schema

PostgreSQL via Supabase, modeled with Prisma. 13 models across two domains:

**Core**
- `User` — profile, college, rating, completed exchange count
- `Skill` — name, category, level, type (offer/want)
- `Request` — connects two users over a skill, with status (pending/accepted/rejected)
- `Exchange` — created when a request is accepted; tracks progress, sessions, status
- `Message` — chat messages scoped to an exchange
- `Review` — post-exchange rating and feedback

**Projects**
- `Project` — title, tagline, description, category, stage, links (GitHub/Figma/demo/site)
- `ProjectRole` — open roles with required skills
- `ProjectApplication` — application to a role with message and contribution level
- `ProjectMember` — confirmed team members
- `ProjectMessage` — team group chat
- `ProjectPost` — project wall updates
- `ProjectTask` — Kanban task tracking

---

## API Reference

**Auth**
```
POST   /api/auth/register
POST   /api/auth/login
```

**Users**
```
GET    /api/users/me
PUT    /api/users/me
GET    /api/users/:id
GET    /api/users
```

**Skills**
```
GET    /api/skills
POST   /api/skills
DELETE /api/skills/:id
```

**Requests**
```
POST   /api/requests
GET    /api/requests
PUT    /api/requests/:id
```

**Exchanges**
```
GET    /api/exchanges
GET    /api/exchanges/:id
PUT    /api/exchanges/:id/progress
POST   /api/exchanges/:id/messages
GET    /api/exchanges/:id/messages
POST   /api/exchanges/:id/reviews
```

**Projects**
```
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/apply
GET    /api/projects/:id/applications
PUT    /api/projects/:id/applications/:appId
GET    /api/projects/:id/messages
POST   /api/projects/:id/messages
POST   /api/projects/:id/posts
GET    /api/projects/:id/tasks
POST   /api/projects/:id/tasks
PUT    /api/projects/:id/tasks/:taskId
GET    /api/projects/my/projects
```

---

## Running Locally

**Prerequisites:** Node.js, a PostgreSQL database (or Supabase project), npm

**1. Clone both repos**
```bash
git clone https://github.com/mdsufiyan04/skillswap-frontend.git
git clone https://github.com/mdsufiyan04/skillswap-backend.git
```

**2. Backend setup**
```bash
cd skillswap-backend
npm install
```
Create a `.env` file:
```
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secret-key"
PORT=5000
```
```bash
npx prisma generate
npx prisma migrate deploy
npm run dev
```

**3. Frontend setup**
```bash
cd skillswap-frontend
npm install
```
Create a `.env` file:
```
VITE_API_URL="http://localhost:5000"
```
```bash
npm run dev
```

---

## Author

**Mohammed Sufiyan**
 USN: 1MJ25IS029

---

## Roadmap

- [x] Core skill exchange flow (skills, requests, exchanges, chat, reviews)
- [x] Projects module (roles, applications, team chat, tasks, wall)
- [x] Elevate UI redesign (black/white premium design system)
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Render
- [ ] Live deployment testing
- [ ] SDC submission