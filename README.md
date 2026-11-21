# FoodBridge
### Rescue Food. Reduce Waste. Feed Communities.

[![React](https://img.shields.io/badge/React-19.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

FoodBridge is a professional social-impact web application that bridges the divide between edible commercial surplus food and local communities in need. Rather than a basic donation directory, FoodBridge provides a real-time rescue workflow featuring **rule-based smart donor-to-NGO matching**, **priority triage scoring**, **QR-coded physical chain-of-custody verification**, **privacy-preserving live maps**, and **transparent impact analytics**.

---

## 🌟 Key Innovations

### 1. Smart Matching Engine
Calculates an auditable, transparent compatibility score out of **100 points** between donors and certified NGOs based on 5 configurable criteria:
- **Geographic Distance (25 pts)**: Haversine great-circle calculation between kitchen loading bay and charitable shelter.
- **Food Category Compatibility (20 pts)**: Matches dietary acceptance (Cooked meals, Bakery, Produce, Packaged food).
- **Quantity & Capacity Alignment (20 pts)**: Ensures batch portions align with daily community intake capacity.
- **Collection Timeline Feasibility (20 pts)**: Evaluates remaining safe window before perishable expiry.
- **NGO Demand Urgency (15 pts)**: Prioritizes shelters with elevated daily meal demands.

### 2. Food Rescue Priority Engine
Triages donations into dynamic urgency tiers with real-time countdown clocks:
- 🔴 **Critical Rescue**: Safe window < 2 hours (or hot-held cooked meals).
- 🟡 **High Urgency**: Window < 4 hours.
- 🟢 **Moderate / Standard**: Packaged or fresh produce with flexible transit timelines.
- ⚪ **Expired**: Automatically locks listings when safe collection deadline passes.

### 3. QR Code Chain-of-Custody Verification
Generates single-use cryptographic pickup and delivery tokens (`FB-PICK-XXXX` and `FB-DELV-XXXX`):
- **Pickup Handover**: Eco-courier scans donor QR code at the kitchen loading dock. The token is verified and permanently consumed to prevent replay attacks.
- **Delivery Handover**: NGO receiver scans or enters the delivery token at the shelter facility.
- **Physical Inspection**: Receiving non-profit confirms portion count and sanitary condition before awarding impact points.

### 4. Privacy-Preserving Live Donation Map
Built with **Leaflet** and **OpenStreetMap**:
- Public views display approximate neighborhood vicinities (300-500m radius) to safeguard private residential venues and commercial kitchens.
- Turn-by-turn routes and precise dock numbers unlock exclusively to authorized couriers and matched NGOs after task acceptance.

### 5. Verified Impact & Gamification
- Recharts visualizations: Weekly rescue volumes, nutritional category distributions, and delivery success rates.
- 3 Leaderboards: Commercial Food Donors, Verified NGO Shelters, and Eco-Courier Volunteers.
- Impact Badges: *First Rescue*, *100 Portions Rescued*, *Food Hero*, *Community Champion*, *Reliable Courier*, and *Zero-Waste Pioneer*. Points are earned **only** upon verified deliveries.

---

## 👥 Ecosystem User Roles

| Role | Responsibilities & Capabilities |
| :--- | :--- |
| **Donor** | Caterers, restaurants, and hotels. Create food listings with portions, preparation time, safe collection deadlines, storage temperatures, allergen disclosures, and safety certifications. Run smart matching and track deliveries. |
| **NGO / Receiver** | Verified soup kitchens, shelters, and food pantries. Set daily portion requirements, receive high-urgency notifications, accept matching donations, and confirm physical portion receipts. |
| **Volunteer Courier** | Independent civic couriers and cargo cyclists. Claim nearby transit tasks, access turn-by-turn routes, adhere to thermal cargo guidelines, and scan handover QR codes. |
| **Administrator** | Platform compliance trustees. Review NGO tax-exempt registrations, investigate reported safety flags, audit cryptographic QR ledgers, and export CSV reports. Users cannot self-register as admins. |

---

## 🚀 10-Step Interactive Hackathon Walkthrough

FoodBridge features a built-in **Hackathon Walkthrough Guide** accessible from the top navigation bar:

1. **Step 1**: Restaurant logs in as Donor (`donor@foodbridge.org` / Chef Marcus).
2. **Step 2**: Lists 100 portions of surplus vegetarian food with safe temperature declaration.
3. **Step 3**: Smart matching engine evaluates and recommends *Green Hope Foundation* (92% compatibility score).
4. **Step 4**: Switch to NGO (`ngo@foodbridge.org` / Elena Rostova) and accept the donation.
5. **Step 5**: Switch to Volunteer Courier (`volunteer@foodbridge.org` / David Kim) and claim the pickup task.
6. **Step 6**: Courier verifies pickup using the simulated QR scanner or token `FB-PICK-XXXX`.
7. **Step 7**: Courier transports food in insulated carrier and confirms arrival at destination.
8. **Step 8**: NGO inspects container integrity and confirms receipt of 100 verified portions.
9. **Step 9**: Public Impact Ledger and community charts update immediately.
10. **Step 10**: Donor and courier earn contribution points and unlock achievement badges.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19, Vite
- **Styling & UI**: Tailwind CSS (Forest green, Fresh mint, Warm orange), Lucide React Icons
- **Mapping**: Leaflet with OpenStreetMap
- **Data Visualization**: Recharts
- **QR Operations**: `qrcode.react` with simulated hardware laser viewfinder
- **State & Storage**: Dual-Mode Architecture:
  - *Demo Mode (Default)*: High-fidelity persistent storage with seed data and 1-click role switcher.
  - *Production Mode*: Google Cloud Firestore, Firebase Authentication, and Firebase Storage.
- **Security**: Firestore security rules (`firestore.rules`) enforcing role boundaries and preventing privilege escalation.

---

## 💻 Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/your-org/foodbridge.git
cd foodbridge
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🔐 Configuration & Firebase Setup

FoodBridge is pre-configured to run immediately in **Persistent Demo Mode** without requiring external credentials.

To connect to Google Firebase:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Populate your Firebase project credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
3. Deploy Firestore security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## 📜 Food Safety & Legal Framework
FoodBridge is designed to comply with Good Samaritan Food Donation legislation. The platform enforces donor hygiene checklists, temperature disclosures, and physical handoff audits, while clarifying that software tracking facilitates logistics rather than serving as an official health inspection certification.

---

## 📄 License
This project is licensed under the MIT License.
