# Workshop Management Software

A fully responsive, role-based SaaS application for workshop management built with React 18, Tailwind CSS, and React Router v6.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/layout/     # Sidebar, Navbar, DashboardLayout
├── context/              # AuthContext
├── hooks/                # useAuth hook
├── pages/                # All page components (isolated)
├── routes/               # AppRoutes
└── utils/                # roleGuard
```

## 🔐 Roles

- **admin**: Full access to all modules
- **technician**: Job Cards, Testing Records, Reports (limited)
- **storekeeper**: Inventory, Reports (inventory-only), Settings (view-only)

## 🎨 Design Rules

- **No shared components** - Each page has its own modals, tables, forms
- **Tailwind CSS only** - No external UI libraries
- **3D-style UI** - Buttons with shadows and hover effects
- **React Icons** - For all icons
- **Mobile-first** - Fully responsive design

## 📝 Development Rules

- All API logic inside each component file
- Use `useState` and `useEffect` only
- No Redux, no shared Context (except auth)
- Each page is fully isolated

