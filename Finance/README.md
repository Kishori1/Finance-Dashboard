# Finance Dashboard

A modern personal finance dashboard built with **React 19** and designed for clear insights, smooth interactions, and responsive performance across desktop and mobile devices.

It includes transaction management, budget tracking, analytics dashboards, role-based access control, dark mode, and exportable financial data.

## Overview

This project helps users monitor their financial activity through a polished dashboard interface with interactive charts and actionable summaries. It is structured for scalability and maintainability, with reusable components, centralized state management, and a responsive design system.

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19 + Vite 8 | Fast development workflow and modern UI architecture |
| Styling | Tailwind CSS 4 | Utility-first styling with custom design tokens |
| State Management | Zustand 5 with `persist` | Lightweight global state with localStorage persistence |
| Charts | Recharts 3 | Responsive data visualization components |
| Animations | Framer Motion 12 | Smooth UI transitions and interaction feedback |
| Icons | Lucide React | Consistent iconography |
| Utilities | date-fns, clsx, tailwind-merge | Date handling and conditional styling |

## Features

### Dashboard
- Summary cards for total balance, monthly income, monthly expenses, and savings rate
- Balance trend visualization
- Spending breakdown donut chart
- Income vs. expenses comparison chart
- Transaction ledger with search, sorting, filtering, and grouping

### Transaction Management
- Add, edit, and delete transactions
- Search by description or category
- Filter by transaction type
- Sort by date, description, or amount
- Group transactions by category or type
- Paginated transaction views
- Export filtered data as CSV or JSON
- Transaction detail side panel
- Mobile-friendly card layout

### Insights
- Financial health score visualization
- Income vs. expenses trend analysis
- Spending velocity tracking
- Smart recommendation cards
- Savings milestone timeline
- Category deep-dive analysis
- Daily spending heatmap

### Budget Tracking
- Budget overview with progress indicator
- Category-level spending progress
- Real-time calculations based on transaction data

### Access Control
- Admin and Viewer roles
- Role-based restrictions for editing, deleting, and exporting data
- Persistent role switching across sessions
- Graceful access-denied state for restricted actions

### User Experience
- Dark mode support
- Glassmorphism-inspired UI
- Responsive layout for mobile, tablet, and desktop
- Motion-based interactions
- Notification center
- Custom scrollbar styling

## Project Structure

```text
src/
├── components/
│   ├── Header.jsx
│   ├── StatCard.jsx
│   ├── BalanceChart.jsx
│   ├── SpendingDonut.jsx
│   ├── ComparisonChart.jsx
│   ├── TransactionTable.jsx
│   ├── TransactionModal.jsx
│   ├── TransactionDetail.jsx
│   ├── NotificationCenter.jsx
│   ├── RoleSwitcher.jsx
│   └── PermissionDenied.jsx
├── pages/
│   ├── Insights.jsx
│   └── Budgets.jsx
├── store/
│   └── useFinanceStore.js
├── utils/
│   └── ExportUtils.js
├── App.jsx
├── main.jsx
└── index.css
```

## Getting Started

### Prerequisites
- Node.js 18 or later
- npm

### Installation

```bash
git clone https://github.com/Kishori1/Finance-Dashboard.git
cd Finance-Dashboard/Finance
npm install
npm run dev
```

Open the local development server in your browser:

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

## Role Permissions

| Feature | Admin | Viewer |
|---|---:|---:|
| View Dashboard | Yes | Yes |
| View Insights | Yes | Yes |
| View Budgets | Yes | Yes |
| Add Transaction | Yes | No |
| Edit Transaction | Yes | No |
| Delete Transaction | Yes | No |
| Export Data | Yes | No |
| Switch Roles | Yes | Yes |

## Responsive Behavior

| Breakpoint | Layout |
|---|---|
| Mobile (<768px) | Single-column layout with mobile navigation and card-based transactions |
| Tablet (768–1024px) | Two-column layout with expanded navigation |
| Desktop (1024px+) | Multi-column layout with full table views and wider analytics panels |

## State Management

The application uses a centralized Zustand store with persistence enabled through localStorage. This keeps key UI and finance data available across refreshes, including:
- transactions
- selected role
- dark mode preference

## Edge Cases Covered

- Empty transaction states
- Required field validation
- Safe handling of persisted localStorage data
- Auto-closing detail views after deletion
- Pagination reset after filter changes
- Category-aware defaults for transaction types
- Protection against duplicate form submission

## License

MIT © 2026
