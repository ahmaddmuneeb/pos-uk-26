Dashboard KPI tile: small uppercase muted label over a large value, on a faint cyan-tinted surface. Lay several out in an auto-fill grid.

```jsx
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: "1rem" }}>
  <StatCard label="Invoices total" value="£48,210" meta="128 documents" />
  <StatCard label="Customers with AR" value="37" accent />
</div>
```
