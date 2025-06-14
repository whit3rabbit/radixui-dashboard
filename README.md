<div align="center">
  <img src="https://raw.githubusercontent.com/whit3rabbit/radixui-dashboard/main/screenshots/dashboard.png" alt="RadixUI Dashboard" width="700"/>
  <h1>Radixui Dashboard</h1>
</div>

## 🌟 Overview

The RadixUI Dashboard is a modern, responsive, and feature-rich dashboard template built with React, TypeScript, and Radix UI. It provides a solid foundation for building powerful web applications with a focus on accessibility and developer experience. This dashboard showcases various UI components, theming capabilities (including dark mode), and a clean, intuitive user interface.

## 📸 Screenshots

<p align="center">
  <a href="https://raw.githubusercontent.com/whit3rabbit/radixui-dashboard/main/screenshots/forms.png">
    <img src="https://raw.githubusercontent.com/whit3rabbit/radixui-dashboard/main/screenshots/forms.png" alt="Forms Page" width="300" style="margin: 5px;"/>
  </a>
  <a href="https://raw.githubusercontent.com/whit3rabbit/radixui-dashboard/main/screenshots/tracking.png">
    <img src="https://raw.githubusercontent.com/whit3rabbit/radixui-dashboard/main/screenshots/tracking.png" alt="Tracking Page" width="300" style="margin: 5px;"/>
  </a>
  <a href="https://raw.githubusercontent.com/whit3rabbit/radixui-dashboard/main/screenshots/users.png">
    <img src="https://raw.githubusercontent.com/whit3rabbit/radixui-dashboard/main/screenshots/users.png" alt="Users Page" width="300" style="margin: 5px;"/>
  </a>
</p>

## 🚀 Getting Started

### Immediate Access to Dashboard

The dashboard is configured to run in **bypass mode** by default, which means:

1.  **No login required** - You're automatically logged in as "Demo User"
2.  **Full access** to all dashboard features
3.  **No database setup** needed

Just run:
```bash
npm install
npm run dev
```

Then open http://localhost:5173 and you'll be redirected straight to the dashboard!

### 🔍 Viewing Authentication Pages

Even in bypass mode, you can still view the authentication pages:

-   **Login**: http://localhost:5173/login
-   **Register**: http://localhost:5173/register
-   **Forgot Password**: http://localhost:5173/forgot-password
-   **Profile**: http://localhost:5173/dashboard/profile

Or click "Logout" in the sidebar to see the login page.

### 🔐 Enabling Real Authentication

To require actual login:

1.  Open `src/lib/auth-context.tsx`
2.  Change `const BYPASS_AUTH = true` to `false`
3.  Follow the [Database Integration Guide](./docs/DATABASE_INTEGRATION.md)

### 🎨 Features You Can Explore

-   **Theme Toggle**: Click the sun/moon icon in the header
-   **Profile Page**: Click your avatar in the top-right
-   **Charts**: Interactive charts on the dashboard
-   **Responsive Design**: Try resizing your browser
-   **Dark Mode**: System preference aware

### 🛠️ Customization Tips

-   **Colors**: Edit theme settings in `src/App.tsx`
-   **Sidebar Items**: Modify `src/components/DashboardLayout.tsx`
-   **Dashboard Content**: Edit `src/pages/dashboard/Dashboard.tsx`
-   **Add New Pages**: Create in `src/pages/` and add routes in `App.tsx`

Enjoy exploring the dashboard! 🎉

## 📚 Further Documentation

For more detailed information, please refer to the following documents in the `docs` folder:

-   [Database Integration Guide](./docs/DATABASE_INTEGRATION.md)
-   [RadixUI Cheatsheet](./docs/RADIXUI_CHEATSHEET.md)
