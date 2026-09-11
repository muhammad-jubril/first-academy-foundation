First Academy Foundation

A responsive school website with a Supabase-powered administrative portal for presenting school information and managing dynamic content such as news and gallery media.

The project combines a public-facing school experience with an authenticated content-management workflow, creating a more complete digital platform than a traditional static school website.

✨ Overview

First Academy Foundation was designed to provide parents, students, and visitors with a clear way to explore the school, its academic structure, facilities, admissions process, news, and other information.

Behind the public website is an administrative dashboard that allows authorized users to manage selected school content without editing the frontend directly.

The project combines:

Public Website → Authentication → Admin Dashboard → Content Management

🚀 Features

🏫 Public School Website

- Responsive homepage
- School introduction and mission
- Nursery, Primary, and Secondary information
- Academic information
- Admissions information
- Facilities presentation
- School values
- School statistics
- Gallery
- News section
- FAQ
- Contact information
- Responsive navigation

🛠️ Admin Portal

The project includes an authenticated administrative dashboard with tools for managing website content.

Administrators can work with:

- News posts
- Gallery media
- Section-specific school photographs
- Account settings
- Logout functionality

🔐 Authentication

Authentication is handled through Supabase.

The project includes:

- Email/password authentication
- Authenticated dashboard access
- Password recovery
- Session-aware navigation
- Logout functionality

🎨 User Experience

- Responsive layouts
- Mobile navigation
- Scroll-triggered reveal animations
- Interactive interface states
- Reduced-motion support
- Structured content hierarchy
- Image-focused school presentation

🧭 Experience Architecture

The platform is divided into two primary experiences:

                    First Academy
                         │
              ┌──────────┴──────────┐
              │                     │
        Public Website         Admin Portal
              │                     │
      Explore School          Authentication
              │                     │
      Academics / News       Content Management
      Admissions / Gallery    News / Gallery
              │                     │
           Contact              Logout

This separation allows visitors to consume school information while authenticated administrators manage selected dynamic content.

🗄️ Supabase Integration

Supabase provides the backend services used by the application.

The project uses Supabase for:

- Authentication
- Database-backed content
- News management
- Gallery management
- Administrative workflows

The frontend communicates with Supabase through its client library and authenticated sessions.

🎨 Design Direction

The website was designed to feel like a modern educational institution rather than a generic school template.

The interface prioritizes:

- Clear information hierarchy
- Strong photography
- Responsive layouts
- Accessible navigation
- Structured content sections
- Friendly but professional presentation
- Subtle motion
- Clear calls to action

The design balances institutional credibility with a modern web experience for parents and prospective students.

🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Supabase
- Supabase Auth
- Responsive Web Design
- Intersection Observer API
- Vercel

⚙️ Interactive Features

JavaScript powers several parts of the experience, including:

- Responsive navigation
- Mobile menu interactions
- Scroll-triggered animations
- Dynamic content interactions
- Authentication states
- Dashboard interactions
- News management
- Gallery management
- Account actions

♿ Accessibility & UX

Accessibility and user preferences were considered throughout the implementation.

The project includes:

- Responsive navigation controls
- Accessible navigation states
- Reduced-motion support
- Semantic content structure
- Responsive layouts
- Clear interactive controls

Motion is designed as a visual enhancement rather than a requirement for understanding the website.

📱 Responsive Design

The website was designed to work across:

- Mobile phones
- Tablets
- Laptops
- Desktop displays

The public website and administrative interface both adapt to smaller screens instead of relying exclusively on desktop layouts.

📂 Project Structure

First-Academy-Foundation/
│
├── css/
├── images/
├── js/
├── sql/
│
├── index.html
├── about.html
├── academics.html
├── admissions.html
├── gallery.html
├── news.html
├── contact.html
│
├── admin-login.html
├── admin-dashboard.html
├── admin-reset-password.html
│
├── script.js
└── styles.css

🔐 Security Considerations

The project uses Supabase authentication and database access controls.

The Supabase client configuration uses a public client key as intended for browser-based applications. Database security therefore depends on correctly configured Row Level Security policies and authorization rules.

The current project is a portfolio/development implementation and should undergo additional authorization hardening before being used as a production administrative system.

In particular, administrative database permissions should be restricted so that authenticated users cannot automatically gain management access to content intended only for administrators.

🎯 Project Goals

First Academy Foundation was built to explore how a school website can evolve beyond a static collection of pages into a lightweight content-managed platform.

The project demonstrates:

- Responsive frontend development
- Supabase integration
- Authentication workflows
- Dashboard development
- Content management
- Database-backed website content
- Responsive UI systems
- Accessibility-aware interaction design
- Deployment using modern hosting infrastructure

⚠️ Scope & Limitations

The project currently focuses on the school's public website and selected administrative content-management workflows.

It does not currently implement a complete school management system.

It does not include:

- Student accounts
- Teacher accounts
- Student portals
- Attendance management
- Results management
- Fees/payment processing
- Online examinations
- Timetabling
- Parent accounts
- Full school ERP functionality

The administrative portal is focused on website content management rather than academic administration.

🚀 Running Locally

Clone the repository:

git clone https://github.com/muhammad-jubril/first-academy-foundation.git

Open the project directory:

cd first-academy-foundation

Because the frontend uses standard HTML, CSS, and JavaScript, it can be served using a local development server.

Supabase Configuration

To use the authenticated/admin functionality locally, configure the project with the required Supabase project credentials and database schema.

The repository includes SQL resources used to configure the application's database structure.

For production deployments, database Row Level Security and administrative authorization should be reviewed carefully before exposing the admin functionality publicly.

🌐 Deployment

The project is deployed using Vercel.

The deployment demonstrates the use of a modern static/frontend hosting workflow combined with Supabase backend services.

📌 What This Project Demonstrates

First Academy Foundation demonstrates my ability to build:

- Responsive institutional websites
- Multi-page frontend experiences
- Authentication workflows
- Admin dashboards
- Content-management interfaces
- Supabase-backed applications
- Database-connected frontend systems
- Responsive navigation
- Motion-enhanced interfaces
- Accessibility-aware experiences

👤 About

Built by Muhammad Jubril — Web Developer & Digital Designer focused on creating modern web experiences, applications, and digital products.

I enjoy combining frontend engineering with visual design, interaction, typography, and product thinking to create interfaces that are both functional and memorable.

---

First Academy Foundation is a school website and content-management project created to explore the intersection of institutional web design, frontend engineering, and backend-powered content management.
