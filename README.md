# Smart Ammunition Tracking System – Frontend

A modern single-page web application (SPA) designed to securely track ammunition inventory, movements, and inspections.
This repository contains the frontend-only implementation, built using vanilla HTML, CSS, and JavaScript, with client-side data persistence for demonstration and academic purposes.

# Features

Secure Login (Demo)
Simple authentication using demo credentials, presented with a full-screen themed login page.

Dashboard Overview
Displays total ammunition count, low-stock alerts, and recent activity using a clean, card-based layout.

Inventory Management
Create, edit, and delete ammunition records including:

Category
Weapon
Caliber / Type
Quantity
Storage Location
Last Inspection Date

Transaction Handling (Issue / Return)
Manages ammunition issues and returns, automatically updating stock levels and generating audit records.

Audit Log
Maintains a detailed, read-only log of all actions with timestamps, quantities, actions performed, and user details.

Analytics Visualization
Interactive and responsive charts to visualize ammunition distribution by category.

Feedback Module
Allows users to submit feedback about the system, stored locally for review.

Light / Dark Mode
Toggle between themes with preferences saved and restored automatically.

Client-Side Persistence
Inventory data, audit logs, feedback, session state, and theme preferences are stored using localStorage and sessionStorage.

# Tech Stack

HTML5 – Single-page application layout (index.html)

CSS3 – Responsive UI, cards, CSS variables, and light/dark themes (style.css)

JavaScript (ES6) – DOM manipulation, state management, CRUD operations, audit logic, charts, and theming (script.js)

Chart.js (CDN) – Inventory analytics visualization

Web Storage APIs – localStorage and sessionStorage for client-side persistence

# Project Structure
├── index.html        # Main SPA layout and section markup
├── style.css         # Global styles, layout, themes, and UI components
├── script.js         # Application logic and state management
├── background1.jpg   # Login page background image
├── chakra.jpg        # Branding / logo image

# Getting Started
1. Clone the Repository
git clone https://github.com/lakshmi-sreya/Smart-Ammunition-Tracking-System---frontend.git
cd Smart-Ammunition-Tracking-System---frontend

2. Run the Application

Option 1: Open directly

Open index.html in any modern browser.

Option 2: Use a local server (recommended)

python -m http.server 8000


Then open: http://localhost:8000

# Login Credentials (Demo)

Username: admin

Password: 1234

Credentials can be modified in script.js.

Upon successful login, the login screen is hidden and the main application interface is displayed.

# Application Usage

Dashboard

View total ammunition count.
Monitor low-stock items (default threshold: 100).
Track recent transactions in chronological order.

Inventory Management

Add or update ammunition records via a form.
Edit or delete records using table action buttons.

Transactions

Perform Issue or Return operations.
Stock validation prevents negative quantities.
All actions are automatically logged.

Audit Log

Displays a detailed history of all inventory actions.
Ensures transparency and accountability.

Analytics

Visualizes ammunition distribution by category.
Charts update dynamically when inventory data changes.

Feedback & Ethics

Users can submit feedback through a form.
An Ethics/Info section explains system purpose and responsible usage.

Theme Toggle

Switch between light and dark modes.

Theme preference persists across sessions.

# Data Storage
localStorage

ammoRecords – Inventory data

auditLog – Action history

feedbackList – User feedback

themePref – Theme preference

sessionStorage

sats_user – Current logged-in user

All data is stored locally in the browser and intended only for demonstration or academic use.

# Academic Disclaimer

This project is an academic demonstration of a frontend-only tracking dashboard.
Authentication, authorization, and data storage are simplified and not suitable for real-world or defense-grade deployment.

# Future Improvements

Integrate a secure backend API and database to replace client-side storage.

Implement role-based access control (RBAC) for Admin, Auditor, and Operator roles.

Add export and import functionality for records and logs (CSV / JSON).

Introduce advanced analytics and filtering by date range, location, and weapon type.

Implement automated testing and a CI/CD pipeline for improved reliability and deployment.
