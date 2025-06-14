# Radix UI Dashboard

A modern, responsive dashboard template built with React, TypeScript, and Radix UI Themes. Features a complete authentication system, dark/light theme switching, and beautiful UI components.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The dashboard runs in **bypass mode** by default, so you can explore all features without setting up a database.

## ✨ Features

- 🎨 **Beautiful UI** with Radix UI Themes
- 🌓 **Dark/Light Mode** with system preference detection
- 🔐 **Complete Auth System** (Login, Register, Forgot Password, Profile)
- 📊 **Interactive Charts** with ApexCharts integration
- 📱 **Fully Responsive** design
- ⚡ **Fast Development** with Vite
- 🎯 **TypeScript** for type safety
- 🛡️ **Protected Routes** with auth guards
- 🎭 **Bypass Mode** for easy development

## 🏃‍♂️ Running in Development

By default, the dashboard runs in **bypass mode** for easy development:

- No login required - automatically logged in as "Demo User"
- All features work with mock data
- Perfect for UI development and testing

To see the authentication pages, you can:
1. Visit them directly: `/login`, `/register`, `/forgot-password`
2. Click "Logout" in the sidebar
3. Or disable bypass mode (see below)

## 🔧 Enabling Real Authentication

To connect a real database and enable user authentication:

1. Set `BYPASS_AUTH = false` in `src/lib/auth-context.tsx`
2. Follow the comprehensive guide: [Database Integration Guide](./docs/DATABASE_INTEGRATION.md)

The guide covers:
- Database options (Supabase, Firebase, PostgreSQL, MongoDB)
- API endpoint implementation
- Security best practices
- Testing strategies

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Chart.tsx       # Chart wrapper component
│   ├── DashboardLayout.tsx
│   └── PasswordStrengthIndicator.tsx
├── pages/              # Route pages
│   ├── auth/           # Auth pages (Login, Register, etc.)
│   └── dashboard/      # Dashboard pages
├── lib/                # Utilities and contexts
│   ├── auth-context.tsx    # Authentication state
│   ├── theme-context.tsx   # Theme management
│   └── validation.ts       # Form validation
└── App.tsx             # Main app with routing
```

## 🎨 Theme Customization

The theme is configured in `App.tsx`:

```typescript
<Theme 
  accentColor="blue"      // Primary color
  grayColor="gray"        // Gray scale
  radius="medium"         // Border radius
  scaling="100%"          // UI scaling
  appearance={theme}      // 'light' | 'dark'
>
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Radix UI Themes** - Component library
- **React Router v7** - Routing
- **ApexCharts** - Charts
- **@radix-ui/react-icons** - Icons

## 📝 Authentication Pages

### Login Page (`/login`)
- Email and password validation
- Show/hide password toggle
- "Forgot password" link
- Social login buttons (UI only)
- Loading states and error handling

### Register Page (`/register`)
- Full name, email, and password fields
- Password strength indicator
- Confirm password validation
- Terms and conditions checkbox
- Social signup buttons (UI only)

### Forgot Password (`/forgot-password`)
- Email submission form
- Success feedback
- Link back to login

### Reset Password (`/reset-password`)
- New password with strength requirements
- Confirm password field
- Success message with auto-redirect

### Profile Page (`/dashboard/profile`)
- Update profile information
- Change password
- Notification preferences
- Theme settings
- Account deletion

## 🔒 Security Features

- Password strength validation
- Form validation on all inputs
- Protected routes requiring authentication
- Session persistence with localStorage
- Secure password visibility toggles

## 🎯 Best Practices

- Component-based architecture
- Proper TypeScript typing
- Accessible form controls
- Responsive design patterns
- Clean code organization
- Reusable validation utilities

## 📄 License

MIT License - feel free to use this template for your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

Found a bug or have a feature request? Please open an issue on GitHub.

---

Built with ❤️ using [Radix UI](https://www.radix-ui.com/)