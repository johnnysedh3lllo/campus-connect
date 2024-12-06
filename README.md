# Campus Connect

Campus Connect is a web-based platform designed to connect landlords and students for rental opportunities. It provides a seamless way for landlords to list properties and for students to search, filter, and inquire about accommodations. The platform also includes administrative features for monitoring and managing user and content activities.

---

## Table of Contents

- [Campus Connect](#campus-connect)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features to be implemented](#features-to-be-implemented)
    - [MVP 1](#mvp-1)
    - [MVP 2](#mvp-2)
  - [Tech Stack](#tech-stack)
    - [Frontend:](#frontend)
    - [Backend:](#backend)
    - [Database:](#database)
    - [Deployment:](#deployment)
  - [Setup Instructions](#setup-instructions)
    - [Prerequisites:](#prerequisites)
    - [Steps:](#steps)
  - [Development Workflow](#development-workflow)
    - [Branching Strategy:](#branching-strategy)
    - [Scripts:](#scripts)

---

## Project Overview

Campus Connect simplifies the rental process by providing:

- A platform for landlords to list and manage rental properties.
- A tool for students to search and inquire about accommodations.
- Messaging capabilities between landlords, students, and administrators.
- Administrative features to ensure platform moderation.

---

## Features to be implemented

### MVP 1

- User authentication and authorization.
- Property listing creation and management (landlords).
- Property search and filtering (students).
- User dashboards for landlords, students, and admins.

### MVP 2

- Advanced filtering options (e.g., property amenities, availability).
- Integrated payment gateway for rental transactions.
- Enhanced messaging system.
- Reporting and analytics tools for admins.

---

## Tech Stack

### Frontend:

- React.js
- Next.js
- ShadCN (UI components and styling)
- Tailwind CSS

### Backend:

- Supabase (Backend as a Service)

### Database:

- PostgreSQL (via Supabase)

### Deployment:

- Vercel (Frontend)
- Supabase (Backend and database)

---

## Setup Instructions

### Prerequisites:

- Node.js v18+
- npm or yarn
- Git
- Supabase account

### Steps:

1. Clone the repository:

```bash
git clone https://github.com/johnnysedh3lllo/campus-connect.git
cd campus-connect
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

- Create a `.env.local` file in the root directory.
- Add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

4. Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000.

5. Deploy to Vercel:

- Link your repository to a Vercel account.
- Push changes to your main branch; Vercel will automatically deploy your app.

---

## Development Workflow

### Branching Strategy:

- `main`: Production-ready code.
- Feature branches: For individual features (e.g., `feature/auth`).

### Scripts:

- `npm run dev`: Start the development server.
- `npm run start`: Start the production server.
- `npm run build`: Build the application for production.
- `npm run lint`: Run linting.
