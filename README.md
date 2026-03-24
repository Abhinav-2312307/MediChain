# 🏥 MediChain - Telemedicine & EHR Platform

MediChain is a **full-stack, role-based healthcare web application** designed to seamlessly connect Patients, Doctors, and Hospitals. It provides a secure, robust environment for managing long-term medical records, scheduling, prescriptions, and healthcare diagnostics. 

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=flat&logo=redux&logoColor=white)

🚀 Live Demo links: 
- [MediChain Frontend](https://medichainreal.netlify.app/)
- [MediChain Backend](https://medichain.up.railway.app/)

---

## ✨ Features

- **🛡️ Role-Based Access Control** — Separate secure dashboards specifically tailored for **Patients**, **Doctors**, and **Hospitals**.  
- **🔐 Comprehensive Authentication** — Secure multi-provider JWT authentication including traditional Email/Password processing and **Firebase Google OAuth** integration cleanly mapped to MongoDB.  
- **📊 Modern Patient Portal** — A beautifully designed, Notion/Apple Health-inspired responsive dashboard focusing on stable long-term medical data (Medications, Conditions, Allergies).
- **📝 Complete Medical History** — Structured tracking of surgical procedures, vaccination records, and active treatment regimens.
- **📂 Cloud File Uploads** — Upload, manage, and view sensitive diagnostic lab reports natively using **Multer + Cloudinary**.  
- **💬 Secure Telemedicine Chat** — Live, scrollable chat interfaces storing doctor–patient interactions accurately within the database. 
- **🌐 Global State Management** — Highly optimized frontend data persistence utilizing **Redux Toolkit**.
- **🧠 AI Integration (Coming Soon)** — Planned **Google Gemini AI** integration to analyze lab reports and generate personalized medical insights.  

---

## 🛠️ Technologies Used

### Frontend
- **Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS, Lucide React (for icons)
- **State Management:** Redux Toolkit 
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js  
- **Database:** MongoDB Atlas (Mongoose ODM)  
- **Authentication:** JSON Web Tokens (JWT), bcrypt, Firebase Admin
- **File Uploads:** Multer + Cloudinary  

---

## 📂 Project Structure

```text
MediVault/
├── Backend/
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/     # Route logic (Auth, Patient, Doctor)
│   ├── middleware/      # JWT verification & Error handling
│   ├── models/          # Mongoose Schemas (Patient, Doctor)
│   ├── routes/          # Express API routes
│   └── server.js        # Entry point
│
└── Frontend/
    ├── src/
    │   ├── api/         # Axios API service instances
    │   ├── components/  # Reusable UI elements (Cards, Modals)
    │   ├── features/    # Redux slices and thunks (Auth, Patient)
    │   ├── layouts/     # Route wrappers (PatientLayout)
    │   ├── pages/       # Core application views (Dashboard, Chat, Profile)
    │   └── main.jsx     # CRA Entry point
    ├── vite.config.js
    └── package.json
```

---

## ⚡ Setup Instructions

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/theadarsh1m/MediChain.git
cd MediChain
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:
```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URI=your_mongodb_atlas_connection_string

# Authentication Strategy
JWT_SECRET=YourSuperSecretKey
JWT_EXPIRES_IN=7d

# File Upload Setup
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

# Frontend CORS config
Frontend_URL=http://localhost:5173
```
Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` directory:
```env
# Routing config for Vite
VITE_Backend_API_URL=http://localhost:5000

# Firebase Auth Configuration (Optional, for Google Login)
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
```
Start the frontend dev server:
```bash
npm run dev
```

---

## 📊 Screenshots

### Landing Page
<img width="1408" height="736" alt="medichain landing page" src="https://github.com/user-attachments/assets/652994c8-40af-45e0-8317-568fd2f08a15" />

### Patient Dashboard 
_(Fully implemented with Redux & Responsive Routing)_  
*Screenshots coming soon...*

---

## ⭐ Contribute

Want to improve **MediChain**? Follow these steps to safely contribute:

1. **Fork the repo**  
2. **Create a new branch (`feature-xyz`)**  
   create a new branch for each feature or bug fix. Replace `feature-xyz` with a descriptive name like `fix-login-bug` or `add-appointment-feature`.
3. **Commit changes**  
   save your progress using `git commit -m "Describe your change"`.
4. **Open a Pull Request 🚀**  
   open a Pull Request (PR) from your branch to the main repository.

## Developers

- [Adarsh Sachan](https://www.linkedin.com/in/adarshsachan01/) 🔗

---
