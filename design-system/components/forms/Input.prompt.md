Form primitives: `Field` (stacked muted label above a control), `Input`, `Textarea`. Controls sit on the surface fill with a hairline border and a cyan focus ring.

```jsx
<Field label="Amount" hint="Excludes VAT">
  <Input placeholder="0.00" />
</Field>
<Field label="Billing address" error="Required">
  <Textarea rows={3} invalid />
</Field>
```

Pass `invalid` for the danger border. `Field` shows `error` (danger) in place of `hint` when present.
