# Finance Dashboard

A modern personal finance dashboard built with **React 19** and designed for clear insights, smooth interactions, and premium visuals across desktop and mobile devices.

It features advanced transaction management, a comprehensive 6-section budget analytics engine, smart financial insights, role-based access control, and a persistent dark mode.

## 🚀 Overview

This project helps users master their finances through a professional-grade interface. It combines real-time data visualization with actionable summaries, structured for high performance and maintainability.

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + Vite 8 | Modern UI architecture with ultra-fast HMR |
| **Styling** | Tailwind CSS 4 | Utility-first styling with a custom gradient design system |
| **State** | Zustand 5 + Persist | Lightweight global state with localStorage synchronization |
| **Charts** | Recharts 3 | Responsive, interactive SVG data visualizations |
| **Motion** | Framer Motion 12 | Smooth UI transitions and micro-interactions |
| **Icons** | Lucide React | Consistent, high-quality iconography |

## ✨ Features

### 📊 Dashboard
- **Financial Snapshot**: Real-time summary cards for Balance, Income, Expenses, and Savings.
- **Trend Analysis**: 6-month balance area charts with gradient fills.
- **Spending Distribution**: Interactive donut charts for categorical breakdown.
- **Master Ledger**: Power-user table with fuzzy search, multi-sort, and category grouping.

### 🔍 Transaction Management
- **Full CRUD**: Add, edit, and delete transactions with instant state updates.
- **Smart Filtering**: Filter by type (Income/Expense) or search by description/category.
- **Detail Side-panel**: Slide-over view for deep-dives into single transactions.
- **Data Portability**: Export filtered transaction views to **CSV** or **JSON**.

### 💡 Smart Insights
- **Financial Health Score**: Dynamic gauge (0-100) calculated from spending habits.
- **Cash Flow Trend**: Optimized "Income vs Expenses" area charts (mobile-tuned layout).
- **Spending Velocity**: Real-time "burn rate" tracker compared to monthly budget.
- **Milestone Timeline**: Visual tracking of savings goals and upcoming targets.

### 🎯 Advanced Budget Tracking
- **Budget Hero KPI**: 4-card overview (Total, Spent, Available, Alerts) with status gauges.
- **Budget vs Actual Comparison**: Bar chart analysis per category.
- **Health Triage**: Automatic classification into *Over Budget*, *Near Limit*, or *On Track*.
- **Category Deep-dive**: Detailed cards showing **Daily Burn Rate (₹/day)** and % usage.

### 🔐 Access Control
- **RBAC Engine**: Native support for **Admin** and **Viewer** roles.
- **Permission Guards**: Restricted actions (Add/Edit/Delete/Export) for Viewers.
- **Graceful States**: Custom "Access Denied" screens with interactive role switching.

## 🎨 Design System

- **Premium Gradients**: A curated palette (Blue, Violet, Emerald, Amber) used for card backgrounds to enhance visual hierarchy.
- **Glassmorphism**: Frosted-glass UI components with backdrop-blur effects.
- **Micro-animations**: Staggered list entries, smooth page transitions, and hover-lift effects.
- **Responsive Layout**: Mobile-first architecture with a dedicated bottom navigation bar and raised Home FAB.

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI components (Charts, Tables, Modals)
├── pages/               # Main view containers (Dashboard, Insights, Budgets)
├── store/               # Zustand state definitions and persistence logic
├── utils/               # Export utilities and formatting helpers
├── App.jsx              # Main routing and RBAC layout
├── main.jsx             # React entry point with Error Boundary
└── index.css            # Global styles and design tokens
```

## 🏁 Getting Started

### Prerequisites
- **Node.js 18+**
- **npm / yarn**

### Installation

```bash
# 1. Clone & Navigate
git clone https://github.com/Kishori1/Finance-Dashboard.git
cd Finance-Dashboard/Finance

# 2. Install & Start
npm install
npm run dev
```

## 🛡️ Role Permissions

| Feature | Admin | Viewer |
|---|---:|---:|
| View Dashboard | ✅ | ✅ |
| View Insights | ✅ | ✅ |
| View Budgets | ✅ | ✅ |
| Add/Edit/Delete | ✅ | ❌ |
| Export Data | ✅ | ❌ |
| Switch Roles | ✅ | ✅ |

## 🧪 Edge Case Handling

- **Error Boundaries**: Prevents app crashes from breaking the UI.
- **Empty States**: Custom illustrations and text for zero-result views.
- **Pagination Sync**: Automatic reset to page 1 during search/filter changes.
- **Safe Persistence**: Validates localStorage data integrity on load.

## 📜 License

MIT © 2026
