Centered dialog over a dark scrim — surface body, cyan accent border, deep shadow. Click-scrim-to-close. Use `wide` for line-item forms (orders, invoices).

```jsx
<Modal
  open={show}
  title="Create customer"
  onClose={() => setShow(false)}
  footer={<><Button onClick={save}>Save</Button><Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button></>}
>
  <Field label="Name"><Input /></Field>
</Modal>
```
