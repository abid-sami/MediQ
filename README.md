# MediQ Connect

MediQ Healthcare Platform: Homepage Development Prompt

Build a modern, premium, full responsive homepage for MediQ, an advanced hybrid digital healthcare and hospital management platform.

MediQ should feel like a combination of a modern healthcare platform, hospital management system, emergency response platform, and patient service portal. The design must be professional, trustworthy, futuristic, clean, and visually impressive without becoming complicated or cluttered.

The homepage must be fully responsive across desktop, tablet, and mobile.

1. Design Direction

Create a unique healthcare interface with:

Modern premium UI

Clean visual hierarchy

Professional healthcare aesthetic

Dark Mode and Light Mode

Smooth animations and micro interactions

Glassmorphism used selectively

Soft gradients

Rounded cards

Elegant shadows

Interactive elements

Animated statistics

Smooth scrolling

Responsive layouts

Accessible typography

Excellent spacing

Clear CTA buttons

Mobile-first design

Do not make it look like a generic hospital template.

The overall visual identity should feel like a next-generation healthcare technology platform.

Use a sophisticated medical color palette such as white, deep navy, blue, cyan/teal, and carefully controlled red only for emergency elements.

Use red primarily for SOS and critical emergency states. Do not overuse it.

2. Header / Navigation

Create a sticky responsive header.

Left:

MediQ Logo

Use a clean medical-inspired logo with a subtle healthcare symbol.

Navigation:

Home

Hospitals

Doctors

Diagnostics

Pharmacy

Blood Bank

Right side:

Dark/Light Mode toggle

Login

Register

Emergency SOS button

On desktop, keep the navigation elegant and spacious.

On mobile, collapse navigation into a modern animated hamburger menu.

The header should have a subtle backdrop blur while scrolling.

Add smooth transitions when the active navigation item changes.

3. Hero Section

Create a visually impressive hero section immediately below the header.

Main headline:

Healthcare, Connected in One Place.

Supporting text:

Find doctors, book appointments, locate available hospital beds, explore diagnostics, access pharmacy services, and find blood availability through one connected healthcare platform.

Add two primary CTA buttons side by side:

🚨 SOS Emergency

Subtext:

Request an Ambulance

👨‍⚕️ Book Appointment

Subtext:

Find & Book a Doctor

The SOS button should visually stand out but remain professional.

Add a subtle emergency pulse animation around the SOS icon.

The appointment button should use a contrasting premium healthcare accent.

4. Hero Visual

Create a unique animated healthcare visual on the opposite side of the hero text.

Do not use a generic stock hospital image.

Instead create an abstract interactive healthcare ecosystem visualization containing elements such as:

Hospital

Ambulance

Doctor

Patient

Medical cross

Location marker

Heart/health indicator

Blood drop

Pharmacy

Diagnostic report

Connect these elements using subtle animated lines or glowing paths.

The animation should be elegant and lightweight.

On mobile, move the visual below the hero CTA buttons.

5. SOS Emergency Modal

When the user clicks SOS Emergency, open a premium modal.

Title:

Emergency SOS

Subtitle:

Request the nearest available ambulance.

Fields:

Full Name

Phone Number

Current Location

Emergency Type

Emergency Type options:

Accident

Cardiac Emergency

Breathing Problem

Injury

Medical Emergency

Other

Location should have:

Detect My Location

button.

Show a location permission friendly interface.

Primary button:

REQUEST AMBULANCE

After submission, display an animated confirmation state:

Ambulance Request Sent

Show:

Request ID

Ambulance status

Estimated arrival time

Assigned ambulance

Live tracking button

For this frontend prototype, use realistic mock data and simulate the status transition.

Do not claim that the prototype provides real emergency response unless a real backend/service is connected.

6. Appointment Modal

When the user clicks Book Appointment, open an animated appointment booking modal.

Fields:

Name

Phone Number

Category

Dropdown categories:

Cardiology

Neurology

Orthopedics

Dermatology

Pediatrics

General Medicine

Dentistry

Gynecology

ENT

Other

Then:

Doctor

Doctor selection should dynamically update according to the selected category.

Then:

Select Date

Use a modern date picker.

Then:

Select Time

Display available time slots as interactive buttons.

Example:

09:00 AM
09:30 AM
10:00 AM
10:30 AM
11:00 AM

Primary CTA:

CONFIRM APPOINTMENT

After confirmation, show a beautiful appointment success screen containing:

Doctor

Department

Date

Time

Appointment ID

7. Quick Healthcare Services

Immediately after the hero, create a horizontal responsive service section.

Cards:

Hospitals

Find hospitals and healthcare facilities.

Doctors

Search doctors and specialists.

Diagnostics

Explore diagnostic and laboratory services.

Pharmacy

Find medicines and healthcare products.

Blood Bank

Check live blood availability.

Each card should have:

Unique icon

Short description

Hover animation

Arrow indicator

Cards should slightly lift and glow on hover.

8. Hospital Overview

Create a premium section titled:

Healthcare Infrastructure at a Glance

Subtitle:

Explore hospital capacity, facilities, wards, and diagnostic services.

Display animated statistics.

Example:

120+ Beds

24 Wards

18 Diagnostic Services

32 Emergency Beds

150+ Healthcare Professionals

24/7 Emergency Support

Use animated number counters when the section enters the viewport.

Do not use fake statistics in production. Clearly structure these as dynamic values that can later come from the backend.

9. Live Bed Availability

Create a large interactive section titled:

Live Bed Availability

Subtitle:

Know hospital capacity before you arrive.

Show a hospital capacity dashboard.

Example:

General Ward

🟢 18 Available

ICU

🟢 04 Available

CCU

🟡 02 Available

Private Cabin

🟢 06 Available

Emergency

🟢 02 Available

Use three status states:

Green = Available

Yellow = Limited

Red = Full

Add:

● LIVE DATA

with a subtle pulsing animation.

Include a circular occupancy visualization or progress ring.

Example:

74% Occupied

Button:

View All Beds →

The data must be structured so that it can later connect to a real hospital management backend.

10. Interactive Hospital Ward Map

Create a visually impressive section titled:

Find Your Way Around

Subtitle:

Explore hospital floors, wards, departments, and facilities through an interactive map.

Provide controls:

Building

Dropdown

Floor

Dropdown

Then show a stylized interactive hospital floor map.

Example areas:

ICU

General Ward

Cabin

Nurse Station

Pharmacy

Laboratory

Emergency

Elevator

Reception

Rooms should have different status indicators.

Allow users to hover or click rooms.

On clicking a ward, show:

Ward name

Department

Number of beds

Available beds

Floor

Nearby facilities

Use subtle map animations and hover effects.

The map must remain usable on mobile.

11. Blood Bank Section

Create a visually distinctive Blood Bank section.

Heading:

Live Blood Availability

Subtitle:

Find available blood units when they matter most.

Display all major blood groups:

A+
A-
B+
B-
AB+
AB-
O+
O-

Each blood group should have:

Blood icon

Current units

Availability status

Progress indicator

Example:

A+
18 Units
Available

O-
0 Units
Critical

Use:

Green = Good availability

Yellow = Low

Red = Critical/Unavailable

Display:

● Updated Just Now

Add CTA buttons:

Request Blood

Become a Donor

View Blood Bank

Create animated blood-drop visuals in the background, but keep them subtle and professional.

12. Pharmacy Section

Create a modern pharmacy section titled:

MediQ Pharmacy

Subtitle:

Find medicines and healthcare essentials from one place.

Add a large search bar:

Search medicines, healthcare products...

Add category cards:

Prescription Medicines

OTC Medicines

First Aid

Vitamins

Diabetes Care

Personal Care

Show a few sample medicine cards.

Each card should contain:

Medicine name

Strength

Price

Availability

Add button

Add:

Browse Pharmacy →

and

Upload Prescription

For prescription-required medicines, clearly indicate that prescription verification is required.

Use mock products for the prototype.

13. Healthcare Network Section

Create a modern section showing how MediQ connects the healthcare ecosystem.

Display:

Patient

↓

MediQ

↓

Doctor

Hospital

Laboratory

Pharmacy

Blood Bank

Ambulance

Use animated connection lines.

This section should visually communicate that MediQ is not simply a hospital website.

It is a connected healthcare ecosystem.

14. Emergency CTA Section

Near the bottom of the homepage, create a powerful emergency CTA.

Heading:

Need Emergency Assistance?

Subtitle:

Get connected with emergency ambulance services quickly.

Large button:

🚨 REQUEST AMBULANCE

Use a subtle emergency pulse animation.

Do not make this section overly aggressive or frightening.

15. Footer

Create a professional multi-column footer.

MediQ

Connected Healthcare. Simplified Care.

Short description about the platform.

Platform

Hospitals

Doctors

Appointments

Diagnostics

Pharmacy

Blood Bank

Emergency

SOS

Ambulance

Emergency Hospitals

Blood Requests

Account

Login

Register

Patient Dashboard

Appointments

Medical Records

Support

Help Center

Contact

Privacy Policy

Terms & Conditions

Bottom section:

© 2026 MediQ. All rights reserved.

Add social media icons.

Add a small:

Made for better connected healthcare.

16. Dark / Light Mode

Implement a complete theme system.

Light mode:

White background

Soft gray sections

Navy/blue typography

Teal/blue accents

Clean cards

Dark mode:

Deep navy/charcoal background

Soft white typography

Blue/teal accents

Dark glass cards

Subtle glowing elements

The user's selected theme must persist after page reload using localStorage.

Do not simply invert colors.

Every component must be properly designed for both themes.

17. Animation System

Use Framer Motion for animations.

Include:

Hero entrance animation

Text reveal

Button hover animation

Card hover animation

Animated counters

Scroll reveal

Modal transitions

Map interactions

Blood availability animation

Live status pulse

Smooth page transitions

Navbar scroll transition

Keep animations smooth and professional.

Avoid excessive animation that could make the website feel like a gaming website.

Use approximately 200–600ms transitions depending on the interaction.

Respect prefers-reduced-motion.

18. Responsive Design

The website must work perfectly on:

Desktop

Laptop

Tablet

Mobile

Mobile homepage should prioritize:

SOS

Appointment

Hospitals

Bed Availability

Blood Bank

Pharmacy

Use responsive cards and horizontal scrolling where appropriate.

Never allow text or cards to overflow the screen.

The SOS button should remain easy to access on mobile.

19. UX Requirements

The interface must be:

Simple

Fast

Accessible

Trustworthy

Clear

Modern

A first-time visitor should understand MediQ within 5 seconds.

Primary actions should always be obvious.

Use meaningful empty states, loading states, error states, success states, and confirmation messages.

Use toast notifications for small actions.

Use confirmation dialogs for important actions.

20. Technical Requirements

Use:

React.js + Vite

Tailwind CSS

Framer Motion

React Router

Use reusable components.

Suggested structure:

src/
├── components/
│   ├── Header
│   ├── Footer
│   ├── SOSModal
│   ├── AppointmentModal
│   ├── ServiceCard
│   ├── HospitalStats
│   ├── BedAvailability
│   ├── WardMap
│   ├── BloodBank
│   ├── Pharmacy
│   └── EmergencyCTA
│
├── pages/
│   └── Home
│
├── data/
│   ├── doctors
│   ├── hospitals
│   ├── beds
│   ├── blood
│   └── pharmacy
│
├── hooks/
├── utils/
├── assets/
└── App.jsx


Keep the architecture ready for future backend integration.

Do not hardcode the UI in one huge component.

Use reusable data-driven components.

21. Important Final Requirement

The finished homepage should feel like a real production healthcare platform, not an AI-generated template.

Prioritize:

Premium UI + excellent UX + strong visual hierarchy + realistic healthcare workflows + responsive design + smooth animation.

Every section should have a clear purpose.

Avoid unnecessary sections, excessive gradients, excessive glassmorphism, oversized text, random animations, and generic stock imagery.

The final result should be:

Modern + Professional + Unique + Trustworthy + Animated + Responsive + Eye-catching + Healthcare-focused.

Build the homepage as the foundation of the complete MediQ ecosystem so that future modules such as patient dashboard, doctor dashboard, hospital management, ambulance tracking, digital prescriptions, diagnostics, pharmacy, blood bank, and billing can be integrated without redesigning the core UI.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/87a6f14b-ab4d-4b56-9e67-2249a8085731).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
