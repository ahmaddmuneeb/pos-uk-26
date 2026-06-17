The workhorse container — solid `#1a2438` surface, hairline border, 12px radius, soft deep shadow. Frames nearly every screen section.

```jsx
<Card title="Sale invoices" actions={<Button variant="ghost" size="sm">Refresh</Button>}>
  …table…
</Card>
<Card title="Dashboard" subtitle="Summary for the selected branch and date range.">…</Card>
```

`title` renders an h2; `subtitle` a muted line; `actions` are right-aligned in the header.
