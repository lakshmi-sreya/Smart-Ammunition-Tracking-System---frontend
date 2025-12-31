Smart Ammunition Tracking System – Frontend
A modern, single‑page web application for securely tracking ammunition inventory, movements, and inspections.
This repository contains the frontend-only implementation built with vanilla HTML, CSS, and JavaScript.

Features
Secure login screen with simple demo credentials and a full‑screen thematic background.

Dashboard overview showing total ammunition, low‑stock alerts, and recent activity in a clean card layout.

Inventory management section to add, edit, and delete ammunition records (category, weapon, caliber, quantity, location, last inspection).

Transaction handling for issues/returns that automatically update stock and create audit records.

Audit log that records all changes with timestamp, action, quantity, and user for accountability.

Analytics chart to visualize ammunition distribution by category using a responsive canvas chart.

Feedback section where users can submit comments about the system; feedback is stored locally.

Light / dark mode toggle with theme preference saved in localStorage.

Local persistence of all data (ammo records, audit log, feedback, and theme) using localStorage and sessionStorage.

Tech Stack
HTML5 – single‑page layout (index.html)

CSS3 – modern responsive design with CSS variables, cards, and light/dark themes (style.css)

JavaScript (ES6) – DOM manipulation, state management, CRUD logic, charts, and theme handling (script.js)

Chart.js (via CDN) – for inventory analytics visualization (if you add or already include the script tag)

LocalStorage / SessionStorage – client‑side data and session persistence

Project Structure
index.html – main single‑page application layout, sections (Dashboard, Inventory, Transactions, Audit, Ethics/Info, Feedback), and login page markup.

style.css – global styles, layout grid, cards, tables, login page background and glassmorphism card, plus light/dark theme variables.

script.js – login handling, navigation between sections, CRUD operations for ammunition records, transaction logic, audit logging, chart rendering, feedback handling, and theme toggle.

background1.jpg – background image for the login page.

chakra.jpg – image used as part of the branding/logo.

Getting Started
Clone the repository

bash
git clone https://github.com/lakshmi-sreya/Smart-Ammunition-Tracking-System---frontend.git
cd Smart-Ammunition-Tracking-System---frontend
Open the app

Open index.html directly in a browser, or

Use a simple static server (recommended for consistent behavior):

bash
# Using Python 3
python -m http.server 8000
# then open http://localhost:8000 in your browser
Log in

Default demo credentials (you can change them in script.js):

Username: admin

Password: 1234

On successful login the login page hides and the main application is displayed.

Usage
Dashboard

View total ammunition quantity and number of low‑stock items (threshold 100 by default).

See the most recent transactions listed in chronological order.

Inventory / Records

Fill in the form for Category, Weapon, Caliber / Type, Quantity, Storage Location, and Last Inspection date.

Click Add / Save to create new records; use the table action buttons to edit or delete existing ones.

Transactions

Choose Issue or Return, select a weapon from the dropdown, enter the quantity, and submit.

Quantities are validated so stock cannot go negative; successful operations are logged.

Audit Log

Displays a read‑only table of all actions with timestamp, action type, category, weapon, quantity, and user.

Useful for transparency and accountability in ammunition handling.

Analytics

Shows a chart summarizing ammunition by category or other aggregate, updated whenever records change.

Feedback / Ethics

Feedback form lets users submit comments; entries are stored in localStorage and shown in a compact list.

Ethics/Info section describes the purpose of the system and emphasizes responsible usage and data integrity.

Theme Toggle

Click the sun/moon icon to switch between light and dark mode.

The preference is saved in localStorage and restored on next visit.

Data Storage
localStorage keys

ammoRecords – main inventory records array.

auditLog – chronological list of all actions.

feedbackList – stored user feedback.

themePref – "light" or "dark".

sessionStorage

sats_user – current logged‑in user for the session.

All data is stored only in the browser and is meant for demonstration / academic use, not production‑level security.

Academic / Disclaimer Notice
This project is designed as an academic demonstration of a tracking dashboard with client‑side persistence, not as a real defense‑grade system.
Authentication, authorization, and storage are simplified and should not be used as‑is in operational or sensitive environments.

Future Improvements
Connect to a secure backend API and database instead of localStorage.

Role‑based access control (admin, auditor, operator).

Export/import of records and logs (CSV or JSON).

More advanced analytics and filters (by date range, location, weapon type).

Automated tests and CI/CD pipeline.
