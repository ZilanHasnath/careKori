# careKori — Caregiver Hiring & Patient Progress Platform

[Live Demo](https://carekori.vercel.app) | [GitHub Repository](https://github.com/ZilanHasnath/careKori.git)

**careKori** is a full-stack, role-based platform that connects patients, caregivers, and family members. Patients can hire caregivers, caregivers log daily progress updates, family members track patient care using a unique identifier, and administrators manage platform operations.

---

## Key Features

* **Patient Portal:** Search caregivers, send hiring requests, link family members, and view daily health updates.
* **Caregiver Portal:** Manage incoming job requests, view patient history, and submit daily progress logs.
* **Family Member Portal:** Link to a patient using a unique ID to view real-time progress reports.
* **Admin Dashboard:** Oversee user profiles, monitor job statuses, and manage system administrators.

---

## Application Structure

Built with **Next.js 16 (App Router)** and **TypeScript**, organized into role-based routes and internal API handlers:

```text
app/
├── admin/          -> System oversight, admin management, profiles
├── auth/           -> Login & multi-role registration flows
├── caregiver/      -> Job requests, active roster, progress logging
├── familymember/   -> Patient linking and health monitoring
└── patient/        -> Caregiver search, request management, progress tracking

api/
├── admin/          -> Administrative actions and data access
├── auth/           -> Authentication handlers
├── caregiver/      -> Job acceptance, history, and log updates
├── family/         -> Patient verification and log retrieval
└── patient/        -> Search filters, booking requests, and profiles

Tech Stack
Frontend & Framework: Next.js 16 (Turbopack), React, Tailwind CSS, TypeScript

Deployment: Vercel

Local Setup
# Clone repository
git clone [https://github.com/ZilanHasnath/careKori.git](https://github.com/ZilanHasnath/careKori.git)
cd careKori

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

## Author
Zilan Hasnath Lithon
Computer Science & Engineering Graduate, Bangladesh University
Full-Stack Web Developer (4+ years experience)

GitHub: github.com/ZilanHasnath

LinkedIn: linkedin.com/in/zilanhasnath

X: x.com/ZilanHasnath