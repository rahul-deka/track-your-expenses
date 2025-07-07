# Expense Tracker

Track your income, monitor expenses, analyze trends, and stay in control of your finances — all from a clean, modern dashboard.

---

## Features

- Firebase Authentication (Signup/Login)
- Persistent Login using Firebase Auth state
- Add income or expense with category, date, and note
- Filter transactions by date or category
- Responsive design (mobile + desktop)
- Dashboard with:
  - Total Income
  - Total Expense
  - Current Balance
- Interactive charts with [Recharts](https://recharts.org/):
  - Pie chart: Expense breakdown by category
  - Bar chart: Monthly income vs expense
  - Line chart: Daily expense trend
- Context menu for each transaction (Edit/Delete)
- Clean, modern UI with [MUI](https://mui.com/)

---

## Tech Stack

| Tech            | Usage                        |
|-----------------|------------------------------|
| React + Vite    | Frontend framework            |
| Firebase        | Auth + Firestore database     |
| MUI (Material UI)| UI components & styling      |
| Recharts        | Data visualization            |
| React Router    | Navigation & routing          |

---

## Installation

```bash
git clone https://github.com/iamRahul21/track-your-expenses.git
cd track-your-expenses
npm install
```

## Firebase Setup
1. Go to Firebase Console
2. Create a new project
3. Enable Authentication > Email/Password
4. Enable Cloud Firestore and set up a database
5. Get your Firebase config from Project Settings > Web App
   
Create a `.env` file in your project root and add:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id_here
```

## Running the App
```
npm run dev
```
Visit: [http://localhost:5173](http://localhost:5173)

## Folder Structure
```
src/
├── components/
│   ├── DashboardCards.jsx
│   ├── DashboardCharts.jsx
│   └── FilteredTransactions.jsx
├── backend/
│   └── firebaseConfig.js
├── AuthContext.jsx
├── Dashboard.jsx
├── Login.jsx
├── Signup.jsx
├── Home.jsx
└── main.jsx
```

## Live Demo

Try it here: [https://hisap.vercel.app](https://hisap.vercel.app)