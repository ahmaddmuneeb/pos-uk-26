Segmented pill tab bar — hairline-bordered tabs, the active one tinted cyan. Used to switch between report/register views.

```jsx
const [tab, setTab] = React.useState("sale");
<Tabs
  value={tab}
  onChange={setTab}
  tabs={[{ value: "sale", label: "Sale register" }, { value: "return", label: "Return register" }]}
/>
```

`tabs` accepts plain strings or `{ value, label }`.
