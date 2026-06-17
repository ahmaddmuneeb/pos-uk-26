The product's list table: uppercase muted column heads, hairline row separators, muted cell text. Drives Customers, Invoices, Receipts, registers, ledgers.

```jsx
<DataTable
  columns={[
    { key: "code", header: "Code" },
    { key: "name", header: "Customer" },
    { key: "due", header: "Due", align: "right" },
    { key: "status", header: "Status", render: (r) => <Badge tone={r.tone}>{r.status}</Badge> },
  ]}
  rows={customers}
  rowKey={(r) => r.id}
/>
```

Use `render` for badges, action buttons, formatted amounts. Shows a centered empty state when `rows` is empty.
