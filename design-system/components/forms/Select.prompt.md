Native `<select>` styled to match the input family — surface fill, hairline border, custom slate chevron, cyan focus ring. Wrap in `Field` for a label.

```jsx
<Field label="Mode">
  <Select defaultValue="CASH">
    <option value="CASH">Cash</option>
    <option value="BANK_TRANSFER">Bank transfer</option>
    <option value="CHEQUE">Cheque</option>
  </Select>
</Field>
```
