Square, icon-only button for row actions (delete, close) and compact toolbars.

```jsx
<IconButton label="Remove line">✕</IconButton>
<IconButton label="Search" variant="accent"><img src="assets/icons/search.svg" width="16" /></IconButton>
```

Variants: `ghost` (bordered), `bare` (borderless), `accent` (cyan tint). Always pass `label` for accessibility — it doubles as the tooltip.
