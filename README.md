# ParaPlan
A modern React-based web application built with Vite, TailwindCSS, and modular component architecture. This project includes pages for income/expense tracking, dashboards, and voice reminders.

---

## 📂 Project Structure

    public/
    ├─ assets/ # Static assets (images, icons, etc.)
    ├─ favicon.ico
    ├─ manifest.json
    ├─ robots.txt
    
    src/
    ├─ components/ # Reusable React components
    │ ├─ ui/ # UI elements
    │ │ ├─ AppIcon.jsx
    │ │ ├─ AppImage.jsx
    │ │ ├─ ErrorBoundary.jsx
    │ │ └─ ScrollToTop.jsx
    │ ├─ pages/ # Page-level components
    │ │ ├─ expense-tracking-interface/
    │ │ ├─ home-dashboard/
    │ │ ├─ income-tracking-interface/
    │ │ ├─ voice-reminder-creation/
    │ │ └─ NotFound.jsx
    ├─ styles/
    │ ├─ index.css
    │ └─ tailwind.css
    ├─ utils/
    │ └─ cn.js # Utility functions (e.g., classNames)
    ├─ App.jsx
    ├─ index.jsx
    └─ Routes.jsx
    
.env # Environment variables
.gitignore
favicon.ico
index.html
jsconfig.json
package.json
package-lock.json
postcss.config.js
README.md
tailwind.config.js
vite.config.mjs

---

## ⚙️ Technologies Used

- **React 18** – Modern, concurrent React version.
- **Vite** – Fast build tool and development server.
- **TailwindCSS** – Utility-first CSS framework.
- **PostCSS** – CSS processing tool.
- **JavaScript (ES6+)** – Modern JS syntax.

---

## 🚀 Getting Started

### 1. Clone the repository


git clone https://github.com/arda-irdep/ParaPlan.git
cd your-repo

2. Install dependencies

npm install

3. Run development server

npm run dev

The app will run on http://localhost:5173 (default Vite port).
4. Build for production

npm run build

The production-ready files will be in the dist/ folder.
5. Preview production build

npm run preview

📌 Features

    Expense & Income Tracking Interfaces – Keep track of financial transactions.

    Home Dashboard – Overview of key metrics.

    Voice Reminder Creation – Create reminders using voice input.

    Reusable UI Components – Easily maintainable component-based architecture.

    Error Handling – With ErrorBoundary.jsx.

📝 Notes

    TailwindCSS is included via tailwind.css and configured in tailwind.config.js.

    Routes are managed in Routes.jsx.

    .env can be used for environment-specific variables.
