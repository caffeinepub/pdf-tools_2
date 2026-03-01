# PDF Tools

## Current State

- 11 PDF tools: merge, split, compress, rotate, watermark, protect, unlock, PDF to JPG, JPG to PDF, page numbers, organize.
- Backend already supports `getHistory()`, `addHistoryEntry()`, `getToolUsage()`, `incrementToolUsage()`.
- OrganizePDF already uses `motion/react` Reorder for drag-and-drop page reordering -- this feature is already implemented.
- History hooks (`useHistory`, `useAddHistory`) already exist in `hooks/useQueries.ts`.
- All tool pages call `addHistory` and `incrementUsage` on success.
- No dedicated History page exists in the app.
- Header has links to All Tools, Merge, Compress, PDF to JPG (desktop) and a full list on mobile.

## Requested Changes (Diff)

### Add
- `/history` route and `HistoryPage` component that:
  - Shows a list of all past processed files fetched via `useHistory()`.
  - Each entry shows: tool name (with icon + color matching the home page tools), original filename, result filename, and timestamp (human-readable relative time like "2 hours ago").
  - Shows an empty state when history is empty.
  - Shows a loading skeleton while fetching.
- "History" nav link in the Header (desktop nav and mobile menu).

### Modify
- `App.tsx`: add `/history` route.
- `Header.tsx`: add "History" link to both desktop nav and mobile menu.

### Remove
- Nothing.

## Implementation Plan

1. Create `src/pages/HistoryPage.tsx`:
   - Use `useHistory()` hook to fetch entries.
   - Display entries in reverse chronological order (newest first).
   - Each card: tool icon + color, tool display name, original file, result file, formatted timestamp.
   - Loading skeleton (3-4 placeholder cards) while `isLoading`.
   - Empty state illustration/message when no history.
2. Update `App.tsx`: import `HistoryPage`, add `historyRoute` at `/history`, include in `routeTree`.
3. Update `Header.tsx`: add "History" link with `History` icon or text in both desktop nav and mobile menu list.
