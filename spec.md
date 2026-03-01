# PDF Tools

## Current State
Admin settings (theme color, dark mode, header logo, footer branding, footer links, hidden services, sponsor posts, and tool control settings) are stored entirely in `localStorage` inside `AdminSettingsContext.tsx` and `ToolControlTab`. This means changes made in the admin panel are device-specific and not visible to other users or on other devices.

The backend (`main.mo`) has user profiles, history entries, tool usage stats, and authorization, but no admin settings storage.

## Requested Changes (Diff)

### Add
- Backend: `AdminSettings` type with all settings fields (hiddenServices, themeColor, darkMode, headerLogoText, headerLogoUrl, footerBrandName, footerLinks, footerCopyright, sponsorPosts, toolControl)
- Backend: `getAdminSettings` public query -- returns current global admin settings (no auth required so all users can read theme/visibility)
- Backend: `saveAdminSettings` shared func -- only admins can call this; persists settings to stable canister state
- Frontend: On app load, fetch admin settings from backend and seed the context
- Frontend: On every `updateSettings` call in `AdminSettingsContext`, also call `saveAdminSettings` on the backend (debounced)
- Frontend: Tool control settings also migrated to backend

### Modify
- `AdminSettingsContext.tsx` -- replace `localStorage` read/write with backend canister read/write; keep local React state as cache for instant UI updates
- `AdminPage.tsx` `ToolControlTab` -- replace `localStorage` with the same backend-persisted settings
- `main.mo` -- add `AdminSettings` type and `getAdminSettings`/`saveAdminSettings` functions

### Remove
- `localStorage.getItem/setItem` calls for admin settings in `AdminSettingsContext.tsx`
- `localStorage.getItem/setItem` calls for tool control in `ToolControlTab`

## Implementation Plan
1. Add `AdminSettings` stable record and getter/setter functions to `main.mo`
2. Regenerate `backend.d.ts` with new types
3. Update `AdminSettingsContext.tsx` to load settings from backend on mount and save to backend on change
4. Update `ToolControlTab` in `AdminPage.tsx` to read/write via backend
5. Add loading state to context so app waits for backend settings before rendering
