# UI Overhaul (Responsive + Admin A11y + Sleek Public)

This document summarizes the UI/layout overhaul in branch `codex/ui-overhaul-responsive`.

## Goals

- **Admin side:** mobile-compatible, readable for older users (larger type, clearer navigation, bigger touch targets, strong focus states).
- **Public/user side:** modern/sleek look, still responsive and accessible.

## What Changed (Frontend)

### 1) “UX modes” via typography variables

Typography is now driven by CSS variables and applied per layout mode:

- Admin pages use an `.admin-surface` wrapper (bigger default font sizes).
- Tenant pages use a `.tenant-surface` wrapper (slightly larger than public).

Files:

- `AndikaKost-Frontend/src/styles.css`
- `AndikaKost-Frontend/tailwind.config.js`
- `AndikaKost-Frontend/src/components/layout/AdminLayout.tsx`
- `AndikaKost-Frontend/src/components/layout/TenantLayout.tsx`

### 2) Theme handling moved into a provider

Theme state (light/dark) is now managed by a provider and toggled from headers.

Files:

- `AndikaKost-Frontend/src/components/theme/ThemeProvider.tsx`
- `AndikaKost-Frontend/src/components/theme/ThemeContext.ts`
- `AndikaKost-Frontend/src/components/theme/useTheme.ts`
- `AndikaKost-Frontend/src/main.tsx`

### 3) Header + navigation improvements

- Admin/Tenant header is now sticky with a theme toggle and logout grouped together.
- Sidebar links have larger tap targets, stronger active state, and better mobile layout.
- Public pages use a shared sticky header component.

Files:

- `AndikaKost-Frontend/src/components/layout/Navbar.tsx`
- `AndikaKost-Frontend/src/components/layout/Sidebar.tsx`
- `AndikaKost-Frontend/src/components/layout/PublicHeader.tsx`

### 4) UI primitives updated for accessibility & mobile

Across the UI components:

- Larger minimum touch sizes (`min-h-11`)
- Stronger `:focus-visible` rings
- Modal can be closed via **Esc** or clicking the overlay
- Table padding increased for readability

Files:

- `AndikaKost-Frontend/src/components/ui/Button.tsx`
- `AndikaKost-Frontend/src/components/ui/Input.tsx`
- `AndikaKost-Frontend/src/components/ui/Modal.tsx`
- `AndikaKost-Frontend/src/components/ui/Table.tsx`
- `AndikaKost-Frontend/src/components/ui/Card.tsx`

### 5) Public pages refreshed (smoother, more modern)

The public home/rooms pages now use the shared header and updated layout spacing.

Files:

- `AndikaKost-Frontend/src/pages/public/PublicHomePage.tsx`
- `AndikaKost-Frontend/src/pages/public/PublicRoomsPage.tsx`

## How To Verify

From `AndikaKost-Frontend/`:

```bash
npm install
npm run lint
npm run build
npm run dev
```

Check:

- Public pages: `/` and `/rooms` scale well on mobile.
- Admin/Tenant: navigation remains usable on small screens and text is comfortably readable.
- Keyboard navigation: tab through buttons/links and confirm visible focus rings.
- Modals: **Esc** closes; clicking outside closes.

## Notes / Follow-ups (Optional)

- If we want the public side to be even more “sleek”, we can introduce a dedicated public layout wrapper (same header, but with different token values for spacing/typography).
- Consider adding a “High contrast” mode for admin if your user base needs it.

