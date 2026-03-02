# PDF Tools – Multi-Role Dashboard Upgrade

## Current State
The app has:
- `/dashboard` → UserDashboard: basic usage stats, history, plan card
- `/creator-dashboard` → CreatorDashboard: localStorage-based creator profile + product management
- `/sponsor-dashboard` → SponsorDashboard: ad creation form wired to backend actor
- `/admin` → AdminPage: admin login + 6 tabs (Services, Theme, Header, Footer, Users, Sponsors)

All existing pages function correctly and must not be changed.

## Requested Changes (Diff)

### Add
- **Normal User Dashboard** (`/dashboard`) – enhanced with left collapsible sidebar, glassmorphism stat cards, recently viewed projects, trending creators, ads banner, follow/unfollow toggle, share/QR buttons, like/comment/star rating UI. All static demo data.
- **Creator Advanced Dashboard** (`/creator-dashboard`) – enhanced with left collapsible sidebar, analytics cards (revenue, followers growth, avg rating), monthly sales chart (CSS-based), service management panel (upload PDF/PPT/Resume, set price, coupon, GitHub link), earnings/tips section, reviews section. All static demo data, existing localStorage product logic preserved.
- **Business Owner Ads Panel** (`/sponsor-dashboard`) – enhanced with left collapsible sidebar, stats (clicks, impressions, CTR, likes, comments, star rating, conversion), ads creation form (banner, link, CTA, targeting filters, budget, boost), charts (clicks/day, engagement), product section. All static demo data, existing ad creation logic preserved.
- **Admin Super Dashboard** (`/admin`) – the existing admin page already exists; add a new standalone route `/super-admin` for the full super admin panel with dark theme, multi-level sidebar (All Users > Normal/Creator/Business), suspension control, reports, revenue, subscription control, feature toggle, logs, broadcast. All static demo data layered on top.

### Modify
- `/dashboard` – replace UserDashboard with the new enhanced version that includes the collapsible left sidebar while keeping existing localStorage history/plan logic intact.
- `/creator-dashboard` – replace CreatorDashboard with new version adding collapsible sidebar while keeping localStorage product/profile logic.
- `/sponsor-dashboard` – replace SponsorDashboard with new version adding collapsible sidebar while keeping existing ad logic.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `NormalUserDashboard.tsx` with left toggle sidebar, static widgets (downloads, followers, recent projects, trending creators, ad banners), like/star/share/QR UI. Keep history/plan from localStorage.
2. Create enhanced `CreatorDashboard.tsx` with left sidebar, static analytics charts (CSS bars), service management, earnings, tips, reviews panels – preserve existing product/profile localStorage logic.
3. Create enhanced `SponsorDashboard.tsx` with left sidebar, full stats cards, ad creation with targeting filters, static charts, product table – preserve existing actor ad logic.
4. Create `SuperAdminDashboard.tsx` at `/super-admin` with dark theme, multi-level sidebar, user management table, ads moderation, revenue charts, broadcast, logs – all static data.
5. Wire new `/super-admin` route in App.tsx.
6. Update App.tsx imports to use new dashboard components.
