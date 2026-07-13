# Penpot MCP and ANDIKA-Kost design sync

This project treats Penpot as a design reference and review surface. The frontend remains the source of truth for application behavior, responsive constraints, and accessible interaction states.

## Codex MCP configuration

Configure Penpot in the user's global Codex configuration (`~/.codex/config.toml`), not in this repository:

```toml
[mcp_servers.penpot]
url = "http://localhost:9001/mcp/stream?userToken=YOUR_MCP_KEY"
startup_timeout_sec = 20
tool_timeout_sec = 120
default_tools_approval_mode = "prompt"
```

After saving the configuration:

1. Restart the Codex client so the Penpot tools are loaded.
2. Open the intended Penpot design file.
3. In Penpot, choose **File → MCP Server → Connect**.
4. Keep that Penpot tab and its MCP plugin active while reading or editing the design.
5. Begin with read-only inspection before allowing design writes.

The MCP server operates on the page currently focused in the active Penpot tab. Only one Penpot tab can own the MCP connection at a time.

## Security

- Treat the MCP key as a password.
- Never commit the key, add it to `.env.example`, include it in screenshots, or paste it into issue/PR text.
- Regenerate the key in Penpot Integrations if it has been exposed. Regeneration revokes the previous key.
- Disconnect the Penpot plugin or disable the MCP integration when design access is not needed.

## ANDIKA-Kost visual contract

The implementation uses the logo's blue/red identity with a calm, operational interface:

- Brand blue is the primary navigation and action color; red is reserved for brand accents and destructive/error states.
- Manrope is used for body copy and Sora for display headings.
- Spacing follows a compact 4/8px rhythm, 44px minimum interactive targets, and 16–28px surface radii.
- Semantic surface, text, border, control, status, and focus tokens support both light and dark themes.
- Status colors are domain-based: success, attention, danger, informational, and neutral.
- Public pages are expressive and conversion-oriented; admin pages prioritize scanability; tenant pages prioritize clear mobile actions.

Responsive behavior is implementation-led:

- Mobile: horizontal workspace navigation and card-style data rows.
- Tablet: fluid content without a fixed sidebar consuming the viewport.
- Desktop (`lg` and above): persistent sidebar and wide operational layouts.

## Recommended Penpot review loop

1. Inspect the current frontend route and its real data states.
2. Read the corresponding Penpot page, components, and tokens.
3. Reconcile reusable tokens/components before page-specific styling.
4. Apply a small implementation change.
5. Verify mobile, tablet, desktop, light, dark, keyboard, loading, empty, and error states.
6. Sync intentionally useful design-system changes back to Penpot rather than mirroring implementation details mechanically.

Reference routes:

- Public: `/`, `/rooms`, `/login`
- Admin: `/admin/dashboard`, bookings, rooms, tenants, payments, complaints
- Tenant: `/tenant/dashboard`, room, bills, complaints
