# Quick Start Guide

## 🚀 Immediate Access to Dashboard

The dashboard is configured to run in **bypass mode** by default, which means:

1. **No login required** - You're automatically logged in as "Demo User"
2. **Full access** to all dashboard features
3. **No database setup** needed

Just run:
```bash
npm install
npm run dev
```

Then open http://localhost:5173 and you'll be redirected straight to the dashboard!

## 🔍 Viewing Authentication Pages

Even in bypass mode, you can still view the authentication pages:

- **Login**: http://localhost:5173/login
- **Register**: http://localhost:5173/register  
- **Forgot Password**: http://localhost:5173/forgot-password
- **Profile**: http://localhost:5173/dashboard/profile

Or click "Logout" in the sidebar to see the login page.

## 🔐 Enabling Real Authentication

To require actual login:

1. Open `src/lib/auth-context.tsx`
2. Change `const BYPASS_AUTH = true` to `false`
3. Follow the [Database Integration Guide](./docs/DATABASE_INTEGRATION.md)

## 🎨 Features You Can Explore

- **Theme Toggle**: Click the sun/moon icon in the header
- **Profile Page**: Click your avatar in the top-right
- **Charts**: Interactive charts on the dashboard
- **Responsive Design**: Try resizing your browser
- **Dark Mode**: System preference aware

## 🛠️ Customization Tips

- **Colors**: Edit theme settings in `src/App.tsx`
- **Sidebar Items**: Modify `src/components/DashboardLayout.tsx`
- **Dashboard Content**: Edit `src/pages/dashboard/Dashboard.tsx`
- **Add New Pages**: Create in `src/pages/` and add routes in `App.tsx`

Enjoy exploring the dashboard! 🎉