/* @ds-bundle: {"format":3,"namespace":"POSUKDesignSystem_85bb4f","components":[{"name":"BrandMark","sourcePath":"components/core/BrandMark.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"DataTable","sourcePath":"components/data-display/DataTable.jsx"},{"name":"StatCard","sourcePath":"components/data-display/StatCard.jsx"},{"name":"Tabs","sourcePath":"components/data-display/Tabs.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"Field","sourcePath":"components/forms/Input.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Textarea","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"NavItem","sourcePath":"components/navigation/NavItem.jsx"},{"name":"NavSection","sourcePath":"components/navigation/NavItem.jsx"}],"sourceHashes":{"components/core/BrandMark.jsx":"a163248b896f","components/core/Button.jsx":"4730b4d4c350","components/core/IconButton.jsx":"91de68df393f","components/data-display/Badge.jsx":"7a8f6e9a0cf8","components/data-display/Card.jsx":"94c48f2988a2","components/data-display/DataTable.jsx":"c43b10744143","components/data-display/StatCard.jsx":"edeb33607790","components/data-display/Tabs.jsx":"a04e3c36699d","components/feedback/Modal.jsx":"5320a7c868cf","components/forms/Input.jsx":"1fdeaa29fd85","components/forms/Select.jsx":"3ff54b07507e","components/navigation/NavItem.jsx":"c2f7d95f2412","ui_kits/pos-web/data.js":"6ac71078d5d6","ui_kits/pos-web/kit.jsx":"7740177443da","ui_kits/pos-web/screens-admin.jsx":"3e6ae4be6695","ui_kits/pos-web/screens-company.jsx":"f727207d0948","ui_kits/pos-web/screens-core.jsx":"8c5319659fbc","ui_kits/pos-web/screens-product.jsx":"fcc32c636436","ui_kits/pos-web/screens-sales.jsx":"f6227990bf5a","ui_kits/pos-web/shell.jsx":"4811bca2fa9f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.POSUKDesignSystem_85bb4f = window.POSUKDesignSystem_85bb4f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/BrandMark.jsx
try { (() => {
/**
 * The POS UK brand mark: a cyan→blue rounded square with a letter,
 * optionally paired with the product wordmark. Mirrors `.sidebar-brand`.
 */
function BrandMark({
  size = 36,
  letter = "P",
  title = "POS / ERP",
  subtitle = "Operations",
  showWordmark = false,
  style
}) {
  const radius = Math.round(size * 0.28);
  const mark = /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: radius,
      background: "var(--primary)",
      display: "grid",
      placeItems: "center",
      fontWeight: "var(--fw-extrabold)",
      fontSize: size * 0.42,
      color: "#fff",
      letterSpacing: "-0.02em",
      boxShadow: "var(--glow-accent)",
      flexShrink: 0
    }
  }, letter);
  if (!showWordmark) return /*#__PURE__*/React.createElement("div", {
    style: style
  }, mark);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.65rem",
      ...style
    }
  }, mark, /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.15
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-md)",
      fontWeight: "var(--fw-bold)",
      color: "var(--text)",
      letterSpacing: "var(--tracking-snug)"
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-sm)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-muted)",
      marginTop: "0.1rem"
    }
  }, subtitle)));
}
Object.assign(__ds_scope, { BrandMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/BrandMark.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * POS UK button. Cyan→blue gradient for primary actions, hairline-bordered
 * ghost for everything else. Matches the product's `button.primary` / `.ghost`.
 */
function Button({
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  type = "button",
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "0.4rem 0.7rem",
      fontSize: "var(--fs-sm)"
    },
    md: {
      padding: "0.55rem 1rem",
      fontSize: "var(--fs-base)"
    },
    lg: {
      padding: "0.7rem 1.25rem",
      fontSize: "var(--fs-md)"
    }
  };
  const base = {
    font: "inherit",
    fontWeight: "var(--fw-semibold)",
    lineHeight: 1,
    display: block ? "block" : "inline-flex",
    width: block ? "100%" : undefined,
    alignItems: "center",
    justifyContent: "center",
    gap: "0.45rem",
    borderRadius: "var(--radius-sm)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "transform var(--dur-fast) var(--ease), filter var(--dur) var(--ease), box-shadow var(--dur) var(--ease), background var(--dur) var(--ease), color var(--dur) var(--ease)",
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: "var(--primary)",
      color: "#fff",
      border: "none",
      boxShadow: "var(--glow-primary)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-muted)",
      borderColor: "var(--border)"
    },
    danger: {
      background: "transparent",
      color: "var(--danger)",
      borderColor: "var(--danger-bg)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => {
      if (disabled) return;
      if (variant === "primary") e.currentTarget.style.boxShadow = "var(--glow-primary-hover)";else e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      if (variant !== "primary") e.currentTarget.style.color = "var(--text)";
    },
    onMouseLeave: e => {
      const v = variants[variant];
      e.currentTarget.style.boxShadow = v.boxShadow || "none";
      e.currentTarget.style.background = v.background;
      e.currentTarget.style.color = v.color;
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Square icon-only button. Used for the row-action "✕" / close affordances.
 * Pass any node (an icon glyph, an <img> of an SVG icon, or text) as children.
 */
function IconButton({
  size = "md",
  variant = "ghost",
  label,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const dim = size === "sm" ? "1.85rem" : size === "lg" ? "2.5rem" : "2.15rem";
  const variants = {
    ghost: {
      background: "transparent",
      color: "var(--text-muted)",
      border: "1px solid var(--border)"
    },
    bare: {
      background: "transparent",
      color: "var(--text-subtle)",
      border: "1px solid transparent"
    },
    accent: {
      background: "var(--accent-glow)",
      color: "var(--accent)",
      border: "1px solid var(--border-strong)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    style: {
      width: dim,
      height: dim,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-sm)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.55 : 1,
      font: "inherit",
      fontSize: "var(--fs-md)",
      transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)",
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => {
      if (disabled || variant === "accent") return;
      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      e.currentTarget.style.color = "var(--text)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = variants[variant].background;
      e.currentTarget.style.color = variants[variant].color;
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
/**
 * Status badge / tag. Semantic tones map to the product's status palette
 * (success / warning / danger / info / neutral). Used for payment status,
 * sale-person status, document state, etc.
 */
function Badge({
  tone = "neutral",
  subtle = true,
  children,
  style
}) {
  const tones = {
    success: {
      fg: "var(--success)",
      bg: "var(--success-bg)"
    },
    warning: {
      fg: "var(--warning)",
      bg: "var(--warning-bg)"
    },
    danger: {
      fg: "var(--danger)",
      bg: "var(--danger-bg)"
    },
    info: {
      fg: "var(--accent)",
      bg: "var(--info-bg)"
    },
    neutral: {
      fg: "var(--text-muted)",
      bg: "rgba(148,163,184,0.10)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.35rem",
      padding: "0.2rem 0.55rem",
      borderRadius: "var(--radius-pill)",
      fontSize: "var(--fs-xs)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "0.02em",
      color: t.fg,
      background: subtle ? t.bg : "transparent",
      border: `1px solid ${subtle ? "transparent" : t.fg}`,
      whiteSpace: "nowrap",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: t.fg,
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
/**
 * The product's primary container: solid elevated surface, hairline border,
 * 12px radius, soft deep shadow. Optional title (h2) + subtitle.
 */
function Card({
  title,
  subtitle,
  actions,
  padding = "1.25rem",
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--bg-card-solid)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding,
      boxShadow: "var(--shadow)",
      color: "var(--text)",
      ...style
    }
  }, (title || actions) && /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "1rem",
      marginBottom: subtitle ? "0.25rem" : "0.75rem"
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--fs-lg)",
      fontWeight: "var(--fw-bold)",
      letterSpacing: "var(--tracking-snug)",
      color: "var(--text)"
    }
  }, title), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.5rem",
      flexShrink: 0
    }
  }, actions)), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 0.75rem",
      color: "var(--text-muted)",
      fontSize: "var(--fs-base)"
    }
  }, subtitle), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/DataTable.jsx
try { (() => {
/**
 * Data table matching the product's table styling: uppercase muted column
 * heads, hairline row separators, muted cell text. Columns are
 * { key, header, render?, align?, width? }; rows are arbitrary objects.
 */
function DataTable({
  columns = [],
  rows = [],
  rowKey,
  empty = "No records",
  style
}) {
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "var(--fs-base)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      textAlign: c.align || "left",
      fontSize: "var(--fs-xs)",
      fontWeight: "var(--fw-semibold)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--text-subtle)",
      padding: "0.65rem 0.5rem",
      borderBottom: "1px solid var(--border)",
      width: c.width,
      whiteSpace: "nowrap"
    }
  }, c.header)))), /*#__PURE__*/React.createElement("tbody", null, rows.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: columns.length,
    style: {
      padding: "1.5rem 0.5rem",
      textAlign: "center",
      color: "var(--text-subtle)"
    }
  }, empty)) : rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: rowKey ? rowKey(r, i) : i
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      textAlign: c.align || "left",
      padding: "0.55rem 0.5rem",
      borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--border)",
      color: "var(--text-muted)"
    }
  }, c.render ? c.render(r, i) : r[c.key]))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data-display/StatCard.jsx
try { (() => {
/**
 * Dashboard KPI chip. Uppercase muted label over a large value, on a faint
 * cyan-tinted surface. Mirrors the product's `.stat`.
 */
function StatCard({
  label,
  value,
  meta,
  accent = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1rem",
      borderRadius: "var(--radius-sm)",
      background: accent ? "var(--accent-glow)" : "rgba(34, 211, 238, 0.06)",
      border: `1px solid ${accent ? "var(--border-strong)" : "var(--border)"}`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-xs)",
      fontWeight: "var(--fw-semibold)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--text-subtle)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-xl)",
      fontWeight: "var(--fw-bold)",
      color: "var(--text)",
      marginTop: "0.25rem",
      letterSpacing: "var(--tracking-snug)"
    }
  }, value), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-muted)",
      marginTop: "0.15rem"
    }
  }, meta));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Tabs.jsx
try { (() => {
/**
 * Segmented tab bar. Pill tabs with a hairline border; the active tab gets
 * the cyan accent + tint. Mirrors the product's `.tab-bar` / `.tab`.
 */
function Tabs({
  tabs = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.35rem",
      ...style
    }
  }, tabs.map(t => {
    const key = typeof t === "string" ? t : t.value;
    const label = typeof t === "string" ? t : t.label;
    const active = key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      role: "tab",
      type: "button",
      "aria-selected": active,
      onClick: () => onChange && onChange(key),
      style: {
        font: "inherit",
        fontSize: "var(--fs-base)",
        padding: "0.35rem 0.75rem",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        background: active ? "var(--accent-glow)" : "transparent",
        color: active ? "var(--accent)" : "var(--text-muted)",
        border: `1px solid ${active ? "var(--border-strong)" : "var(--border)"}`,
        transition: "color var(--dur) var(--ease), border-color var(--dur) var(--ease), background var(--dur) var(--ease)"
      },
      onMouseEnter: e => {
        if (active) return;
        e.currentTarget.style.color = "var(--text)";
        e.currentTarget.style.borderColor = "var(--border-strong)";
      },
      onMouseLeave: e => {
        if (active) return;
        e.currentTarget.style.color = "var(--text-muted)";
        e.currentTarget.style.borderColor = "var(--border)";
      }
    }, label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
/**
 * Modal dialog over a dark scrim. Surface body, accent border, deep shadow.
 * Mirrors the product's `.modal-overlay` / `.modal` (use `wide` for forms).
 */
function Modal({
  open = true,
  title,
  onClose,
  wide = false,
  footer,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "presentation",
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "2rem 1rem",
      zIndex: 50,
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      background: "var(--bg-surface)",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius)",
      padding: "1.25rem",
      width: "100%",
      maxWidth: wide ? "48rem" : "32rem",
      boxShadow: "var(--shadow-lg)",
      color: "var(--text)"
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 1rem",
      fontSize: "var(--fs-lg)",
      fontWeight: "var(--fw-bold)",
      letterSpacing: "var(--tracking-snug)"
    }
  }, title), children, footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.75rem",
      marginTop: "1rem"
    }
  }, footer)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const fieldStyle = {
  base: {
    color: "var(--text)"
  }
};

/** Shared input visual: surface fill, hairline border, cyan focus ring. */
function controlStyle(invalid) {
  return {
    font: "inherit",
    fontSize: "var(--fs-base)",
    width: "100%",
    padding: "0.55rem 0.75rem",
    borderRadius: "var(--radius-sm)",
    border: `1px solid ${invalid ? "var(--danger)" : "var(--border)"}`,
    background: "var(--bg-surface)",
    color: "var(--text)",
    minWidth: 0,
    transition: "border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)"
  };
}
function focusOn(e) {
  e.currentTarget.style.borderColor = "var(--accent-dim)";
  e.currentTarget.style.boxShadow = "var(--ring)";
}
function focusOff(e, invalid) {
  e.currentTarget.style.borderColor = invalid ? "var(--danger)" : "var(--border)";
  e.currentTarget.style.boxShadow = "none";
}

/**
 * Labelled field wrapper. POS UK stacks a small uppercase-ish muted label
 * above each control (the product's `<label>` flex-column pattern).
 */
function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.35rem",
      fontSize: "0.78rem",
      fontWeight: "var(--fw-semibold)",
      color: "var(--text-muted)",
      ...style
    }
  }, label, children, error ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--danger)",
      fontWeight: "var(--fw-medium)"
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-subtle)",
      fontWeight: "var(--fw-medium)"
    }
  }, hint) : null);
}

/** Text input. */
function Input({
  invalid = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    style: {
      ...controlStyle(invalid),
      ...style
    },
    onFocus: focusOn,
    onBlur: e => focusOff(e, invalid)
  }, rest));
}

/** Multi-line input. */
function Textarea({
  invalid = false,
  rows = 3,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    style: {
      ...controlStyle(invalid),
      resize: "vertical",
      lineHeight: 1.45,
      ...style
    },
    onFocus: focusOn,
    onBlur: e => focusOff(e, invalid)
  }, rest));
}
Object.assign(__ds_scope, { Field, Input, Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Select dropdown matching the product's native `<select>` styling:
 * surface fill, hairline border, cyan focus ring, custom chevron.
 */
function Select({
  invalid = false,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("select", _extends({
    style: {
      font: "inherit",
      fontSize: "var(--fs-base)",
      width: "100%",
      padding: "0.55rem 2rem 0.55rem 0.75rem",
      borderRadius: "var(--radius-sm)",
      border: `1px solid ${invalid ? "var(--danger)" : "var(--border)"}`,
      background: "var(--bg-surface) url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='%2394a3b8' stroke-width='1.5'><path d='M2.5 4.5L6 8l3.5-3.5'/></svg>\") no-repeat right 0.7rem center",
      color: "var(--text)",
      appearance: "none",
      WebkitAppearance: "none",
      cursor: "pointer",
      minWidth: 0,
      transition: "border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)",
      ...style
    },
    onFocus: e => {
      e.currentTarget.style.borderColor = "var(--accent-dim)";
      e.currentTarget.style.boxShadow = "var(--ring)";
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = invalid ? "var(--danger)" : "var(--border)";
      e.currentTarget.style.boxShadow = "none";
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Sidebar nav link. Muted by default; active state gets the cyan accent,
 * a faint tint, and an inset accent ring. Mirrors `.nav a` / `.nav a.active`.
 */
function NavItem({
  active = false,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("a", _extends({
    style: {
      display: "block",
      padding: "0.5rem 0.65rem",
      borderRadius: "var(--radius-sm)",
      fontSize: "var(--fs-base)",
      fontWeight: "var(--fw-medium)",
      textDecoration: "none",
      cursor: "pointer",
      color: active ? "var(--accent)" : "var(--text-muted)",
      background: active ? "rgba(34,211,238,0.10)" : "transparent",
      boxShadow: active ? "inset 0 0 0 1px var(--border-strong)" : "none",
      transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)",
      ...style
    },
    onMouseEnter: e => {
      if (active) return;
      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      e.currentTarget.style.color = "var(--text)";
    },
    onMouseLeave: e => {
      if (active) return;
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "var(--text-muted)";
    }
  }, rest), children);
}

/** Uppercase overline that groups nav items (Overview / Administration / …). */
function NavSection({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "1rem",
      fontSize: "var(--fs-2xs)",
      fontWeight: "var(--fw-semibold)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wider)",
      color: "var(--text-subtle)",
      padding: "0.35rem 0.5rem",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { NavItem, NavSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavItem.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pos-web/data.js
try { (() => {
/* Seed data for the POS UK web app (fake, in-memory). Mirrors PRD entities. */
window.POSDATA = {
  user: {
    fullName: "Imran Khalid",
    initials: "IK",
    role: "System Administrator"
  },
  branch: "Birmingham — Central",
  branches: [{
    id: "b1",
    code: "BR-01",
    name: "Birmingham — Central",
    phone: "0121 496 0011",
    vat: "GB 432 8891 02",
    head: true,
    active: true
  }, {
    id: "b2",
    code: "BR-02",
    name: "Manchester — Trafford",
    phone: "0161 882 4420",
    vat: "GB 432 8891 02",
    head: false,
    active: true
  }, {
    id: "b3",
    code: "BR-03",
    name: "London — Stratford",
    phone: "0208 553 9001",
    vat: "GB 432 8891 02",
    head: false,
    active: true
  }],
  stats: {
    invoicesTotal: "£48,210.00",
    invoicesCount: 128,
    receiptsTotal: "£39,540.00",
    receiptsCount: 96,
    receivables: 37,
    lowStock: 8
  },
  customerTypes: [{
    id: "ct1",
    name: "Retail",
    customers: 41
  }, {
    id: "ct2",
    name: "Wholesale",
    customers: 58
  }, {
    id: "ct3",
    name: "Corporate",
    customers: 12
  }],
  customers: [{
    id: "c1",
    code: "CUST-0001",
    name: "Acme Trading Ltd",
    contact: "John Mason",
    type: "Wholesale",
    phone: "0121 496 0011",
    email: "ap@acmetrading.co.uk",
    vat: "GB 712 3345 01",
    balance: "£1,240.00",
    active: true
  }, {
    id: "c2",
    code: "CUST-0002",
    name: "Brightwell & Co",
    contact: "Sara Hughes",
    type: "Wholesale",
    phone: "0161 882 4420",
    email: "accounts@brightwell.co.uk",
    vat: "GB 998 1120 77",
    balance: "£460.50",
    active: true
  }, {
    id: "c3",
    code: "CUST-0003",
    name: "Corner Shop Express",
    contact: "Amir Patel",
    type: "Retail",
    phone: "0121 770 1188",
    email: "amir@cornershop.uk",
    vat: "—",
    balance: "£312.00",
    active: true
  }, {
    id: "c4",
    code: "CUST-0004",
    name: "Halal Meats Wholesale",
    contact: "Bilal Khan",
    type: "Wholesale",
    phone: "0208 553 9001",
    email: "orders@halalmeats.uk",
    vat: "GB 451 2290 18",
    balance: "£0.00",
    active: true
  }, {
    id: "c5",
    code: "CUST-0005",
    name: "Riverside Cafe",
    contact: "Ella Wood",
    type: "Retail",
    phone: "0161 224 7766",
    email: "hello@riversidecafe.uk",
    vat: "—",
    balance: "£88.20",
    active: false
  }, {
    id: "c6",
    code: "CUST-0006",
    name: "Northgate Pharmacy",
    contact: "Dr. R. Singh",
    type: "Corporate",
    phone: "0113 245 8890",
    email: "stock@northgatepharm.uk",
    vat: "GB 220 7781 44",
    balance: "£927.40",
    active: true
  }],
  customerHistory: [{
    type: "Invoice",
    doc: "INV-1042",
    date: "2026-06-10",
    amount: "£1,240.00",
    balance: "£1,240.00",
    status: "Unpaid",
    tone: "danger"
  }, {
    type: "Receipt",
    doc: "RCP-0501",
    date: "2026-06-10",
    amount: "£1,240.00",
    balance: "£0.00",
    status: "Paid",
    tone: "success"
  }, {
    type: "Invoice",
    doc: "INV-1051",
    date: "2026-06-12",
    amount: "£860.50",
    balance: "£860.50",
    status: "Partially Paid",
    tone: "warning"
  }, {
    type: "Receipt",
    doc: "RCP-0509",
    date: "2026-06-13",
    amount: "£400.00",
    balance: "£460.50",
    status: "Partially Paid",
    tone: "warning"
  }],
  salePersons: [{
    id: "sp1",
    name: "Daniel Carter",
    designation: "Senior Sales Exec",
    region: "Midlands",
    commission: "2.5%",
    status: "Active"
  }, {
    id: "sp2",
    name: "Priya Sharma",
    designation: "Sales Executive",
    region: "North West",
    commission: "2.0%",
    status: "Active"
  }, {
    id: "sp3",
    name: "Tom Fielding",
    designation: "Sales Executive",
    region: "London",
    commission: "2.0%",
    status: "Inactive"
  }],
  receipts: [{
    id: "r1",
    code: "RCP-0501",
    customer: "Acme Trading Ltd",
    amount: "£1,240.00",
    mode: "BANK_TRANSFER",
    ref: "FT-22119",
    date: "2026-06-10"
  }, {
    id: "r2",
    code: "RCP-0502",
    customer: "Brightwell & Co",
    amount: "£400.00",
    mode: "CASH",
    ref: "—",
    date: "2026-06-11"
  }, {
    id: "r3",
    code: "RCP-0503",
    customer: "Halal Meats Wholesale",
    amount: "£4,180.75",
    mode: "CHEQUE",
    ref: "CHQ-00841",
    date: "2026-06-12"
  }],
  categories: [{
    id: "cat1",
    code: "CAT-01",
    name: "Grocery",
    items: 142,
    active: true
  }, {
    id: "cat2",
    code: "CAT-02",
    name: "Beverages",
    items: 64,
    active: true
  }, {
    id: "cat3",
    code: "CAT-03",
    name: "Packaging",
    items: 28,
    active: true
  }, {
    id: "cat4",
    code: "CAT-04",
    name: "Household",
    items: 51,
    active: false
  }],
  subCategories: [{
    id: "sc1",
    code: "SUB-01",
    parent: "Grocery",
    name: "Rice & Grains",
    items: 38
  }, {
    id: "sc2",
    code: "SUB-02",
    parent: "Grocery",
    name: "Oils & Ghee",
    items: 22
  }, {
    id: "sc3",
    code: "SUB-03",
    parent: "Beverages",
    name: "Soft Drinks",
    items: 31
  }, {
    id: "sc4",
    code: "SUB-04",
    parent: "Packaging",
    name: "Bags & Wrap",
    items: 14
  }],
  uoms: [{
    id: "u1",
    code: "UOM-01",
    name: "Pieces"
  }, {
    id: "u2",
    code: "UOM-02",
    name: "Kilogram"
  }, {
    id: "u3",
    code: "UOM-03",
    name: "Litre"
  }, {
    id: "u4",
    code: "UOM-04",
    name: "Box"
  }, {
    id: "u5",
    code: "UOM-05",
    name: "Case"
  }],
  locations: [{
    id: "l1",
    code: "LOC-01",
    name: "Main Warehouse"
  }, {
    id: "l2",
    code: "LOC-02",
    name: "Showroom"
  }, {
    id: "l3",
    code: "LOC-03",
    name: "Shop Floor"
  }],
  products: [{
    id: "p1",
    sku: "SKU-1001",
    name: "Basmati Rice 20kg",
    type: "Finished",
    category: "Grocery",
    sub: "Rice & Grains",
    uom: "Box",
    purchase: "26.00",
    wholesale: "29.50",
    retail: "32.50",
    location: "Main Warehouse",
    qty: 240,
    reorder: 60,
    barcode: "5012345678900",
    active: true
  }, {
    id: "p2",
    sku: "SKU-1002",
    name: "Sunflower Oil 5L",
    type: "Finished",
    category: "Grocery",
    sub: "Oils & Ghee",
    uom: "Case",
    purchase: "7.40",
    wholesale: "8.90",
    retail: "9.80",
    location: "Main Warehouse",
    qty: 48,
    reorder: 60,
    barcode: "5012345678917",
    active: true
  }, {
    id: "p3",
    sku: "SKU-1003",
    name: "Chopped Tomatoes 2.5kg",
    type: "Finished",
    category: "Grocery",
    sub: "Rice & Grains",
    uom: "Case",
    purchase: "2.60",
    wholesale: "3.10",
    retail: "3.40",
    location: "Showroom",
    qty: 12,
    reorder: 40,
    barcode: "5012345678924",
    active: true
  }, {
    id: "p4",
    sku: "SKU-1004",
    name: "Chickpeas 3kg",
    type: "Finished",
    category: "Grocery",
    sub: "Rice & Grains",
    uom: "Box",
    purchase: "3.80",
    wholesale: "4.40",
    retail: "4.95",
    location: "Main Warehouse",
    qty: 96,
    reorder: 30,
    barcode: "5012345678931",
    active: true
  }, {
    id: "p5",
    sku: "SKU-1005",
    name: "Paper Bags 500ct",
    type: "Finished",
    category: "Packaging",
    sub: "Bags & Wrap",
    uom: "Box",
    purchase: "9.50",
    wholesale: "10.80",
    retail: "12.00",
    location: "Shop Floor",
    qty: 8,
    reorder: 25,
    barcode: "5012345678948",
    active: true
  }, {
    id: "p6",
    sku: "SKU-1006",
    name: "Cola 330ml 24pk",
    type: "Finished",
    category: "Beverages",
    sub: "Soft Drinks",
    uom: "Case",
    purchase: "5.20",
    wholesale: "6.10",
    retail: "6.95",
    location: "Showroom",
    qty: 180,
    reorder: 48,
    barcode: "5012345678955",
    active: true
  }],
  orders: [{
    id: "o1",
    no: "SO-2087",
    date: "2026-06-09",
    customer: "Acme Trading Ltd",
    person: "Daniel Carter",
    total: "£1,240.00",
    vat: true
  }, {
    id: "o2",
    no: "SO-2088",
    date: "2026-06-10",
    customer: "Halal Meats Wholesale",
    person: "Daniel Carter",
    total: "£4,180.75",
    vat: true
  }, {
    id: "o3",
    no: "SO-2089",
    date: "2026-06-11",
    customer: "Corner Shop Express",
    person: "Priya Sharma",
    total: "£312.00",
    vat: false
  }],
  invoices: [{
    id: "i1",
    no: "INV-1042",
    date: "2026-06-10",
    due: "2026-06-24",
    customer: "Acme Trading Ltd",
    net: "£1,240.00",
    paid: "£1,240.00",
    outstanding: "£0.00",
    status: "Paid",
    tone: "success",
    vat: true
  }, {
    id: "i2",
    no: "INV-1043",
    date: "2026-06-11",
    due: "2026-06-25",
    customer: "Brightwell & Co",
    net: "£860.50",
    paid: "£400.00",
    outstanding: "£460.50",
    status: "Partial",
    tone: "warning",
    vat: true
  }, {
    id: "i3",
    no: "INV-1044",
    date: "2026-06-11",
    due: "2026-06-18",
    customer: "Corner Shop Express",
    net: "£312.00",
    paid: "£0.00",
    outstanding: "£312.00",
    status: "Overdue",
    tone: "danger",
    vat: false
  }, {
    id: "i4",
    no: "INV-1045",
    date: "2026-06-12",
    due: "2026-06-26",
    customer: "Halal Meats Wholesale",
    net: "£4,180.75",
    paid: "£4,180.75",
    outstanding: "£0.00",
    status: "Paid",
    tone: "success",
    vat: true
  }, {
    id: "i5",
    no: "INV-1046",
    date: "2026-06-13",
    due: "2026-06-27",
    customer: "Northgate Pharmacy",
    net: "£927.40",
    paid: "£0.00",
    outstanding: "£927.40",
    status: "Draft",
    tone: "info",
    vat: true
  }],
  returns: [{
    id: "sr1",
    no: "SR-0312",
    date: "2026-06-12",
    saleNo: "INV-1042",
    customer: "Acme Trading Ltd",
    person: "Daniel Carter",
    subtotal: "£120.00",
    vat: "£24.00",
    total: "£144.00"
  }, {
    id: "sr2",
    no: "SR-0313",
    date: "2026-06-13",
    saleNo: "INV-1043",
    customer: "Brightwell & Co",
    person: "Priya Sharma",
    subtotal: "£60.00",
    vat: "£12.00",
    total: "£72.00"
  }],
  users: [{
    id: "us1",
    username: "admin",
    fullName: "Imran Khalid",
    role: "System Administrator",
    branch: "Birmingham — Central",
    isAdmin: true,
    status: "Active",
    lastLogin: "2026-06-14 08:42"
  }, {
    id: "us2",
    username: "dcarter",
    fullName: "Daniel Carter",
    role: "Sales Staff",
    branch: "Birmingham — Central",
    isAdmin: false,
    status: "Active",
    lastLogin: "2026-06-14 08:05"
  }, {
    id: "us3",
    username: "psharma",
    fullName: "Priya Sharma",
    role: "Sales Staff",
    branch: "Manchester — Trafford",
    isAdmin: false,
    status: "Active",
    lastLogin: "2026-06-13 17:20"
  }, {
    id: "us4",
    username: "afinance",
    fullName: "Aisha Noor",
    role: "Finance / Accounts",
    branch: "Birmingham — Central",
    isAdmin: false,
    status: "Active",
    lastLogin: "2026-06-14 09:11"
  }, {
    id: "us5",
    username: "tfielding",
    fullName: "Tom Fielding",
    role: "Sales Staff",
    branch: "London — Stratford",
    isAdmin: false,
    status: "Inactive",
    lastLogin: "2026-05-30 14:02"
  }],
  activity: [{
    docNo: "INV-1046",
    docType: "Sale Invoice",
    action: "Created",
    user: "Daniel Carter",
    at: "2026-06-13 16:40",
    tone: "success"
  }, {
    docNo: "CUST-0006",
    docType: "Customer",
    action: "Updated",
    user: "Aisha Noor",
    at: "2026-06-13 15:02",
    tone: "info"
  }, {
    docNo: "SR-0313",
    docType: "Sale Return",
    action: "Created",
    user: "Priya Sharma",
    at: "2026-06-13 11:55",
    tone: "success"
  }, {
    docNo: "SO-2089",
    docType: "Sale Order",
    action: "Deleted",
    user: "Daniel Carter",
    at: "2026-06-12 18:21",
    tone: "danger"
  }, {
    docNo: "RCP-0503",
    docType: "Receipt",
    action: "Created",
    user: "Aisha Noor",
    at: "2026-06-12 10:08",
    tone: "success"
  }],
  // RBAC matrix scaffold
  rightsModules: [{
    module: "Company",
    screens: ["Customers", "Customer Types", "Receipts", "Sale Persons", "Company Reports"]
  }, {
    module: "Product",
    screens: ["Categories", "Sub Categories", "Products", "Stock Locations", "UOM", "Stock Reports"]
  }, {
    module: "Sale",
    screens: ["Sale Orders", "Sale Invoices", "Sale Returns", "Sales Registers"]
  }, {
    module: "Administration",
    screens: ["Branches", "Users", "User Rights", "Preferences", "Bulk Import", "Admin Reports"]
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pos-web/data.js", error: String((e && e.message) || e) }); }

// ui_kits/pos-web/kit.jsx
try { (() => {
/* POS UK web — shared screen helpers built on the design system. */
const K = window.POSUKDesignSystem_85bb4f;
function Toolbar({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-end",
      gap: "0.75rem",
      margin: "0 0 1rem",
      ...style
    }
  }, children);
}
function DateField({
  label,
  defaultValue
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.3rem",
      fontSize: "var(--fs-sm)",
      fontWeight: 600,
      color: "var(--text-muted)"
    }
  }, label, /*#__PURE__*/React.createElement(K.Input, {
    type: "date",
    defaultValue: defaultValue,
    style: {
      width: "auto"
    }
  }));
}
function BranchSelect({
  width = "14rem"
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.3rem",
      fontSize: "var(--fs-sm)",
      fontWeight: 600,
      color: "var(--text-muted)"
    }
  }, "Branch", /*#__PURE__*/React.createElement(K.Select, {
    defaultValue: window.POSDATA.branch,
    style: {
      width: "auto",
      minWidth: width
    }
  }, window.POSDATA.branches.map(b => /*#__PURE__*/React.createElement("option", {
    key: b.id
  }, b.name))));
}

/* Section sub-heading inside a card */
function SubHead({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 0.6rem",
      fontSize: "var(--fs-base)",
      fontWeight: 700,
      color: "var(--text)",
      ...style
    }
  }, children);
}

/* Read-only key/value grid (detail panels, summaries) */
function KeyValue({
  items,
  cols = 3,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
      gap: "0.9rem 1.5rem",
      ...style
    }
  }, items.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-2xs)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--text-subtle)",
      fontWeight: 600,
      marginBottom: 3
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-base)",
      color: "var(--text)",
      fontWeight: 500
    }
  }, v))));
}

/* Totals strip used on document forms */
function TotalsBar({
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "2rem",
      padding: "0.9rem 1rem",
      marginTop: "0.75rem",
      background: "rgba(34,211,238,0.05)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)"
    }
  }, items.map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-2xs)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--text-subtle)",
      fontWeight: 600
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: i === items.length - 1 ? "var(--fs-lg)" : "var(--fs-md)",
      fontWeight: 700,
      color: i === items.length - 1 ? "var(--accent)" : "var(--text)",
      marginTop: 2
    }
  }, v))));
}

/* Report screen: optional tabs + filter bar + result table + export */
function ReportScreen({
  title,
  subtitle,
  tabs,
  columns,
  rows,
  note
}) {
  const [tab, setTab] = React.useState(tabs ? tabs[0].value : null);
  const data = typeof rows === "function" ? rows(tab) : rows;
  const cols = typeof columns === "function" ? columns(tab) : columns;
  return /*#__PURE__*/React.createElement(K.Card, {
    title: title,
    subtitle: subtitle,
    actions: /*#__PURE__*/React.createElement(K.Button, {
      variant: "ghost"
    }, "Export CSV")
  }, /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement(BranchSelect, null), /*#__PURE__*/React.createElement(DateField, {
    label: "From",
    defaultValue: "2026-06-01"
  }), /*#__PURE__*/React.createElement(DateField, {
    label: "To",
    defaultValue: "2026-06-14"
  }), /*#__PURE__*/React.createElement(K.Button, {
    variant: "ghost"
  }, "Apply"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(K.Button, {
    variant: "ghost",
    size: "sm"
  }, "Print"), /*#__PURE__*/React.createElement(K.Button, {
    variant: "ghost",
    size: "sm"
  }, "Email")), tabs && /*#__PURE__*/React.createElement(K.Tabs, {
    value: tab,
    onChange: setTab,
    tabs: tabs,
    style: {
      marginBottom: "0.9rem"
    }
  }), note && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-subtle)",
      margin: "0 0 0.75rem"
    }
  }, note), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement(K.DataTable, {
    columns: cols,
    rows: data,
    rowKey: (r, i) => i
  })));
}

/* Generic reference-list screen with an inline "add" modal */
function ListScreen({
  title,
  addLabel,
  columns,
  rows: initial,
  formFields,
  toBuild,
  toolbar
}) {
  const [rows, setRows] = React.useState(initial);
  const [show, setShow] = React.useState(false);
  const [form, setForm] = React.useState(() => Object.fromEntries(formFields.map(f => [f.key, f.default || ""])));
  const save = () => {
    const required = formFields.find(f => f.required && !String(form[f.key]).trim());
    if (required) return;
    setRows([toBuild(form, rows), ...rows]);
    setForm(Object.fromEntries(formFields.map(f => [f.key, f.default || ""])));
    setShow(false);
  };
  return /*#__PURE__*/React.createElement(K.Card, {
    title: title,
    actions: /*#__PURE__*/React.createElement(K.Button, {
      onClick: () => setShow(true)
    }, addLabel)
  }, toolbar && /*#__PURE__*/React.createElement(Toolbar, null, toolbar), /*#__PURE__*/React.createElement(K.DataTable, {
    columns: columns,
    rows: rows,
    rowKey: (r, i) => r.id || i
  }), /*#__PURE__*/React.createElement(K.Modal, {
    open: show,
    title: addLabel,
    onClose: () => setShow(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(K.Button, {
      onClick: save
    }, "Save"), /*#__PURE__*/React.createElement(K.Button, {
      variant: "ghost",
      onClick: () => setShow(false)
    }, "Cancel"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, formFields.map(f => /*#__PURE__*/React.createElement(K.Field, {
    key: f.key,
    label: f.label,
    style: {
      gridColumn: f.full ? "1 / -1" : undefined
    }
  }, f.options ? /*#__PURE__*/React.createElement(K.Select, {
    value: form[f.key],
    onChange: e => setForm({
      ...form,
      [f.key]: e.target.value
    })
  }, f.options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o))) : /*#__PURE__*/React.createElement(K.Input, {
    value: form[f.key],
    onChange: e => setForm({
      ...form,
      [f.key]: e.target.value
    }),
    placeholder: f.placeholder
  }))))));
}
Object.assign(window, {
  Toolbar,
  DateField,
  BranchSelect,
  SubHead,
  KeyValue,
  TotalsBar,
  ReportScreen,
  ListScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pos-web/kit.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pos-web/screens-admin.jsx
try { (() => {
/* POS UK web — Administration module. */
const AD = window.POSUKDesignSystem_85bb4f;
function BranchesScreen() {
  const d = window.POSDATA;
  const {
    Badge
  } = AD;
  return window.ListScreen({
    title: "Branches",
    addLabel: "Add branch",
    columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "name",
      header: "Branch name"
    }, {
      key: "phone",
      header: "Phone"
    }, {
      key: "vat",
      header: "VAT No."
    }, {
      key: "head",
      header: "Type",
      render: r => r.head ? /*#__PURE__*/React.createElement(Badge, {
        tone: "info"
      }, "Head office") : /*#__PURE__*/React.createElement(Badge, {
        tone: "neutral"
      }, "Branch")
    }, {
      key: "active",
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.active ? "success" : "neutral"
      }, r.active ? "Active" : "Inactive")
    }],
    rows: d.branches,
    formFields: [{
      key: "name",
      label: "Branch name",
      required: true,
      full: true
    }, {
      key: "code",
      label: "Code",
      placeholder: "BR-04"
    }, {
      key: "phone",
      label: "Phone"
    }, {
      key: "vat",
      label: "VAT No.",
      placeholder: "GB 000 0000 00"
    }, {
      key: "address",
      label: "Address",
      full: true
    }],
    toBuild: f => ({
      id: "b" + Date.now(),
      code: f.code || "BR-NEW",
      name: f.name,
      phone: f.phone || "—",
      vat: f.vat || "—",
      head: false,
      active: true
    })
  });
}
function UsersScreen() {
  const {
    Card,
    Button,
    DataTable,
    Badge,
    Modal,
    Field,
    Input,
    Select,
    IconButton
  } = AD;
  const {
    Toolbar
  } = window;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.users);
  const [show, setShow] = React.useState(false);
  const blank = {
    username: "",
    fullName: "",
    role: "Sales Staff",
    branch: d.branch,
    password: ""
  };
  const [form, setForm] = React.useState(blank);
  const roles = ["System Administrator", "Sales Staff", "Finance / Accounts", "Stock Controller", "Read-only"];
  const save = () => {
    if (!form.username.trim() || !form.fullName.trim()) return;
    setRows([{
      id: "us" + Date.now(),
      username: form.username,
      fullName: form.fullName,
      role: form.role,
      branch: form.branch,
      isAdmin: form.role === "System Administrator",
      status: "Active",
      lastLogin: "—"
    }, ...rows]);
    setForm(blank);
    setShow(false);
  };
  return /*#__PURE__*/React.createElement(Card, {
    title: "Users",
    actions: /*#__PURE__*/React.createElement(Button, {
      onClick: () => setShow(true)
    }, "Add user")
  }, /*#__PURE__*/React.createElement(DataTable, {
    rowKey: r => r.id,
    columns: [{
      key: "username",
      header: "Username",
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "var(--font-mono)",
          color: "var(--accent)"
        }
      }, r.username)
    }, {
      key: "fullName",
      header: "Full name"
    }, {
      key: "role",
      header: "Role",
      render: r => r.isAdmin ? /*#__PURE__*/React.createElement(Badge, {
        tone: "info"
      }, r.role) : r.role
    }, {
      key: "branch",
      header: "Branch"
    }, {
      key: "lastLogin",
      header: "Last login"
    }, {
      key: "status",
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.status === "Active" ? "success" : "neutral"
      }, r.status)
    }, {
      key: "act",
      header: "",
      align: "right",
      render: () => /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          gap: 4,
          justifyContent: "flex-end"
        }
      }, /*#__PURE__*/React.createElement(IconButton, {
        label: "Reset password",
        size: "sm"
      }, "\u27F3"), /*#__PURE__*/React.createElement(IconButton, {
        label: "Edit",
        size: "sm"
      }, "\u270E"))
    }],
    rows: rows
  }), /*#__PURE__*/React.createElement(Modal, {
    open: show,
    wide: true,
    title: "Add user",
    onClose: () => setShow(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      onClick: save
    }, "Create user"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setShow(false)
    }, "Cancel"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Username"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.username,
    onChange: e => setForm({
      ...form,
      username: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Full name"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.fullName,
    onChange: e => setForm({
      ...form,
      fullName: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Role"
  }, /*#__PURE__*/React.createElement(Select, {
    value: form.role,
    onChange: e => setForm({
      ...form,
      role: e.target.value
    })
  }, roles.map(r => /*#__PURE__*/React.createElement("option", {
    key: r
  }, r)))), /*#__PURE__*/React.createElement(Field, {
    label: "Branch"
  }, /*#__PURE__*/React.createElement(Select, {
    value: form.branch,
    onChange: e => setForm({
      ...form,
      branch: e.target.value
    })
  }, d.branches.map(b => /*#__PURE__*/React.createElement("option", {
    key: b.id
  }, b.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Temporary password",
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    type: "password",
    value: form.password,
    onChange: e => setForm({
      ...form,
      password: e.target.value
    }),
    placeholder: "User must change on first login"
  })))));
}
function UserRightsScreen() {
  const {
    Card,
    Button,
    Select,
    Switch
  } = AD;
  const d = window.POSDATA;
  const actions = ["View", "Create", "Edit", "Delete", "Print"];
  const [user, setUser] = React.useState("dcarter");
  const [grid, setGrid] = React.useState(() => {
    const g = {};
    d.rightsModules.forEach(m => m.screens.forEach(s => {
      g[s] = {
        View: true,
        Create: true,
        Edit: s !== "Users",
        Delete: false,
        Print: true
      };
    }));
    return g;
  });
  const toggle = (screen, action) => setGrid(g => ({
    ...g,
    [screen]: {
      ...g[screen],
      [action]: !g[screen][action]
    }
  }));
  return /*#__PURE__*/React.createElement(Card, {
    title: "User Rights",
    subtitle: "Per-screen access control. Toggle the actions each role may perform.",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost"
    }, "Copy from role\u2026"), /*#__PURE__*/React.createElement(Button, null, "Save rights"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-end",
      marginBottom: "1.25rem"
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-muted)",
      fontWeight: 600,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, "User", /*#__PURE__*/React.createElement(Select, {
    value: user,
    onChange: e => setUser(e.target.value),
    style: {
      width: "auto",
      minWidth: "16rem"
    }
  }, d.users.map(u => /*#__PURE__*/React.createElement("option", {
    key: u.id,
    value: u.username
  }, u.fullName, " \u2014 ", u.role))))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)",
      overflow: "hidden"
    }
  }, d.rightsModules.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.module
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0.5rem 0.85rem",
      background: "rgba(34,211,238,0.06)",
      fontSize: "var(--fs-2xs)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--accent)",
      borderBottom: "1px solid var(--border)"
    }
  }, m.module), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "0.5rem 0.85rem",
      fontSize: "var(--fs-xs)",
      color: "var(--text-subtle)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)"
    }
  }, "Screen"), actions.map(a => /*#__PURE__*/React.createElement("th", {
    key: a,
    style: {
      width: 86,
      padding: "0.5rem",
      fontSize: "var(--fs-xs)",
      color: "var(--text-subtle)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      textAlign: "center"
    }
  }, a)))), /*#__PURE__*/React.createElement("tbody", null, m.screens.map((s, si) => /*#__PURE__*/React.createElement("tr", {
    key: s,
    style: {
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "0.5rem 0.85rem",
      fontSize: "var(--fs-base)",
      color: "var(--text)"
    }
  }, s), actions.map(a => /*#__PURE__*/React.createElement("td", {
    key: a,
    style: {
      textAlign: "center",
      padding: "0.4rem"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => toggle(s, a),
    role: "switch",
    "aria-checked": grid[s][a],
    "aria-label": `${s} ${a}`,
    style: {
      width: 34,
      height: 20,
      borderRadius: 999,
      border: "none",
      cursor: "pointer",
      padding: 2,
      display: "inline-flex",
      justifyContent: grid[s][a] ? "flex-end" : "flex-start",
      background: grid[s][a] ? "var(--accent-dim)" : "rgba(148,163,184,0.2)",
      transition: "background var(--dur) var(--ease)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: "#fff"
    }
  }))))))))))));
}
function PreferencesScreen() {
  const {
    Card,
    Button,
    Field,
    Input,
    Select,
    Textarea
  } = AD;
  const {
    SubHead
  } = window;
  return /*#__PURE__*/React.createElement(Card, {
    title: "Preferences",
    subtitle: "Company-wide defaults applied to documents, tax and numbering.",
    actions: /*#__PURE__*/React.createElement(Button, null, "Save changes")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem 2rem",
      maxWidth: "52rem"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubHead, null, "Company"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Legal name"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "POS UK Wholesale Ltd"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "VAT registration"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "GB 432 8891 02"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Registered address"
  }, /*#__PURE__*/React.createElement(Textarea, {
    rows: 2,
    defaultValue: "14 Bull Street, Birmingham, B4 6AF"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubHead, null, "Tax & currency"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Default VAT rate"
  }, /*#__PURE__*/React.createElement(Select, {
    defaultValue: "20% (Standard)"
  }, /*#__PURE__*/React.createElement("option", null, "20% (Standard)"), /*#__PURE__*/React.createElement("option", null, "5% (Reduced)"), /*#__PURE__*/React.createElement("option", null, "0% (Zero-rated)"))), /*#__PURE__*/React.createElement(Field, {
    label: "Currency"
  }, /*#__PURE__*/React.createElement(Select, {
    defaultValue: "GBP (\xA3)"
  }, /*#__PURE__*/React.createElement("option", null, "GBP (\xA3)"))), /*#__PURE__*/React.createElement(Field, {
    label: "Prices include VAT"
  }, /*#__PURE__*/React.createElement(Select, {
    defaultValue: "No \u2014 VAT added at line"
  }, /*#__PURE__*/React.createElement("option", null, "No \u2014 VAT added at line"), /*#__PURE__*/React.createElement("option", null, "Yes \u2014 VAT inclusive"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubHead, null, "Document numbering"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Invoice prefix"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "INV-"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Next invoice no"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "1047"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Order prefix"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "SO-"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Receipt prefix"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "RCP-"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubHead, null, "Defaults"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Default branch"
  }, /*#__PURE__*/React.createElement(Select, {
    defaultValue: "Birmingham \u2014 Central"
  }, window.POSDATA.branches.map(b => /*#__PURE__*/React.createElement("option", {
    key: b.id
  }, b.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Default payment terms"
  }, /*#__PURE__*/React.createElement(Select, {
    defaultValue: "14 days"
  }, /*#__PURE__*/React.createElement("option", null, "Due on receipt"), /*#__PURE__*/React.createElement("option", null, "7 days"), /*#__PURE__*/React.createElement("option", null, "14 days"), /*#__PURE__*/React.createElement("option", null, "30 days"))), /*#__PURE__*/React.createElement(Field, {
    label: "Invoice footer note"
  }, /*#__PURE__*/React.createElement(Textarea, {
    rows: 2,
    defaultValue: "Thank you for your business. Goods remain the property of POS UK Wholesale Ltd until paid in full."
  }))))));
}
function ImportScreen() {
  const {
    Card,
    Button,
    Select,
    Badge
  } = AD;
  const {
    SubHead
  } = window;
  const [entity, setEntity] = React.useState("Products");
  const [stage, setStage] = React.useState("upload");
  const preview = {
    Products: {
      cols: ["SKU", "Name", "Category", "UOM", "Wholesale", "Retail", "Re-order"],
      rows: [["SKU-2001", "Jasmine Rice 10kg", "Grocery", "Box", "18.40", "21.00", "40"], ["SKU-2002", "Olive Oil 1L", "Grocery", "Case", "4.10", "5.25", "30"], ["SKU-2003", "Foil Trays 250ct", "Packaging", "Box", "6.80", "8.40", "20"]]
    },
    Customers: {
      cols: ["Name", "Type", "Phone", "Email", "VAT"],
      rows: [["Eastside Grocers", "Wholesale", "0121 555 0190", "buy@eastside.uk", "GB 771 2210 88"], ["Maple Deli", "Retail", "0161 555 7741", "hi@mapledeli.uk", "—"]]
    }
  }[entity];
  return /*#__PURE__*/React.createElement(Card, {
    title: "Bulk Import",
    subtitle: "Import master data from CSV / Excel. Download a template, map columns, validate, then commit."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-end",
      marginBottom: "1.25rem"
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-muted)",
      fontWeight: 600,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, "Import type", /*#__PURE__*/React.createElement(Select, {
    value: entity,
    onChange: e => {
      setEntity(e.target.value);
      setStage("upload");
    },
    style: {
      width: "auto",
      minWidth: "14rem"
    }
  }, /*#__PURE__*/React.createElement("option", null, "Products"), /*#__PURE__*/React.createElement("option", null, "Customers"), /*#__PURE__*/React.createElement("option", null, "Opening Stock"))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Download template")), stage === "upload" ? /*#__PURE__*/React.createElement("div", {
    onClick: () => setStage("preview"),
    style: {
      border: "1.5px dashed var(--border-strong)",
      borderRadius: "var(--radius)",
      padding: "2.5rem",
      textAlign: "center",
      cursor: "pointer",
      background: "rgba(34,211,238,0.04)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-lg)",
      fontWeight: 700,
      color: "var(--text)"
    }
  }, "Drop your ", entity, " file here"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-subtle)",
      marginTop: 6
    }
  }, "CSV or XLSX up to 10 MB \xB7 or click to browse")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(SubHead, {
    style: {
      margin: 0
    }
  }, "Preview \xB7 ", entity.toLowerCase(), ".csv"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success"
  }, preview.rows.length, " valid"), /*#__PURE__*/React.createElement(Badge, {
    tone: "warning"
  }, "0 warnings"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => setStage("upload")
  }, "Choose another file"), /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Commit import"))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "var(--fs-base)"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, preview.cols.map(c => /*#__PURE__*/React.createElement("th", {
    key: c,
    style: {
      textAlign: "left",
      padding: "0.6rem 0.75rem",
      fontSize: "var(--fs-xs)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--text-subtle)",
      fontWeight: 600,
      borderBottom: "1px solid var(--border)"
    }
  }, c)))), /*#__PURE__*/React.createElement("tbody", null, preview.rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, r.map((c, j) => /*#__PURE__*/React.createElement("td", {
    key: j,
    style: {
      padding: "0.55rem 0.75rem",
      color: "var(--text-muted)",
      borderBottom: i < preview.rows.length - 1 ? "1px solid var(--border)" : "none"
    }
  }, c)))))))));
}
function UserActivityReport() {
  const d = window.POSDATA;
  const {
    Badge
  } = AD;
  return window.ReportScreen({
    title: "User Activity Report",
    subtitle: "Audit log of create / update / delete actions across all documents.",
    columns: [{
      key: "at",
      header: "Timestamp"
    }, {
      key: "user",
      header: "User"
    }, {
      key: "docType",
      header: "Document type"
    }, {
      key: "docNo",
      header: "Reference"
    }, {
      key: "action",
      header: "Action",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone
      }, r.action)
    }],
    rows: d.activity
  });
}
function ActiveUsersReport() {
  const d = window.POSDATA;
  const {
    Badge
  } = AD;
  const rows = d.users.filter(u => u.status === "Active").map(u => ({
    username: u.username,
    fullName: u.fullName,
    role: u.role,
    branch: u.branch,
    lastLogin: u.lastLogin
  }));
  return window.ReportScreen({
    title: "Active Users Report",
    subtitle: "Currently enabled user accounts and their last sign-in.",
    columns: [{
      key: "username",
      header: "Username"
    }, {
      key: "fullName",
      header: "Full name"
    }, {
      key: "role",
      header: "Role"
    }, {
      key: "branch",
      header: "Branch"
    }, {
      key: "lastLogin",
      header: "Last login"
    }],
    rows
  });
}
function UsersListReport() {
  const d = window.POSDATA;
  const {
    Badge
  } = AD;
  return window.ReportScreen({
    title: "Users List",
    subtitle: "Complete directory of all user accounts.",
    columns: [{
      key: "username",
      header: "Username"
    }, {
      key: "fullName",
      header: "Full name"
    }, {
      key: "role",
      header: "Role"
    }, {
      key: "branch",
      header: "Branch"
    }, {
      key: "status",
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.status === "Active" ? "success" : "neutral"
      }, r.status)
    }],
    rows: d.users
  });
}
Object.assign(window, {
  BranchesScreen,
  UsersScreen,
  UserRightsScreen,
  PreferencesScreen,
  ImportScreen,
  UserActivityReport,
  ActiveUsersReport,
  UsersListReport
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pos-web/screens-admin.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pos-web/screens-company.jsx
try { (() => {
/* POS UK web — Company module. */
const CO = window.POSUKDesignSystem_85bb4f;
function CustomersScreen() {
  const {
    Card,
    Button,
    DataTable,
    Badge,
    Modal,
    Field,
    Input,
    Select,
    Textarea,
    IconButton,
    Tabs
  } = CO;
  const {
    Toolbar,
    BranchSelect,
    KeyValue,
    SubHead
  } = window;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.customers);
  const [q, setQ] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [detail, setDetail] = React.useState(null);
  const [form, setForm] = React.useState({
    name: "",
    contact: "",
    phone: "",
    whatsapp: "",
    email: "",
    vat: "",
    type: "Wholesale",
    city: "",
    postcode: "",
    address: ""
  });
  const filtered = rows.filter(c => (c.name + c.code).toLowerCase().includes(q.toLowerCase()) && (!typeFilter || c.type === typeFilter));
  const save = () => {
    if (!form.name.trim()) return;
    const n = rows.length + 1;
    setRows([{
      id: "c" + Date.now(),
      code: "CUST-" + String(n).padStart(4, "0"),
      name: form.name,
      contact: form.contact,
      type: form.type,
      phone: form.phone,
      email: form.email,
      vat: form.vat || "—",
      balance: "£0.00",
      active: true
    }, ...rows]);
    setShow(false);
  };
  if (detail) {
    const c = detail;
    return /*#__PURE__*/React.createElement(Card, {
      title: "Customer history",
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: () => setDetail(null)
      }, "\u2190 Back to list")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0 0 1rem",
        marginBottom: "1rem",
        borderBottom: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 12,
        background: "var(--primary)",
        display: "grid",
        placeItems: "center",
        color: "#fff",
        fontWeight: 700,
        boxShadow: "var(--glow-accent)"
      }
    }, c.name[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: "var(--fs-lg)",
        fontWeight: 700,
        color: "var(--text)"
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: "var(--fs-sm)",
        color: "var(--text-muted)"
      }
    }, c.code, " \xB7 ", c.type, " \xB7 ", c.contact)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: "var(--fs-2xs)",
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-wide)",
        color: "var(--text-subtle)",
        fontWeight: 600
      }
    }, "Outstanding"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: "var(--fs-xl)",
        fontWeight: 700,
        color: c.balance === "£0.00" ? "var(--success)" : "var(--danger)"
      }
    }, c.balance))), /*#__PURE__*/React.createElement(KeyValue, {
      style: {
        marginBottom: "1.25rem"
      },
      items: [["Phone", c.phone], ["Email", c.email], ["VAT No.", c.vat], ["Customer Type", c.type], ["Status", c.active ? "Active" : "Inactive"], ["Branch", d.branch]]
    }), /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: "var(--fs-sm)",
        color: "var(--text-muted)",
        fontWeight: 600,
        display: "flex",
        flexDirection: "column",
        gap: 4
      }
    }, "From", /*#__PURE__*/React.createElement(Input, {
      type: "date",
      defaultValue: "2026-06-01",
      style: {
        width: "auto"
      }
    })), /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: "var(--fs-sm)",
        color: "var(--text-muted)",
        fontWeight: 600,
        display: "flex",
        flexDirection: "column",
        gap: 4
      }
    }, "To", /*#__PURE__*/React.createElement(Input, {
      type: "date",
      defaultValue: "2026-06-14",
      style: {
        width: "auto"
      }
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost"
    }, "Apply")), /*#__PURE__*/React.createElement(SubHead, null, "Transactions"), /*#__PURE__*/React.createElement(DataTable, {
      rowKey: (r, i) => i,
      columns: [{
        key: "type",
        header: "Type"
      }, {
        key: "doc",
        header: "Document"
      }, {
        key: "date",
        header: "Date"
      }, {
        key: "amount",
        header: "Amount",
        align: "right"
      }, {
        key: "balance",
        header: "Balance",
        align: "right"
      }, {
        key: "status",
        header: "Payment status",
        render: r => /*#__PURE__*/React.createElement(Badge, {
          tone: r.tone
        }, r.status)
      }],
      rows: d.customerHistory
    }));
  }
  return /*#__PURE__*/React.createElement(Card, {
    title: "Customers",
    actions: /*#__PURE__*/React.createElement(Button, {
      onClick: () => setShow(true)
    }, "Add new")
  }, /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement(BranchSelect, null), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search name or code",
    value: q,
    onChange: e => setQ(e.target.value),
    style: {
      width: "auto",
      minWidth: "16rem"
    }
  }), /*#__PURE__*/React.createElement(Select, {
    value: typeFilter,
    onChange: e => setTypeFilter(e.target.value),
    style: {
      width: "auto"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All types"), d.customerTypes.map(t => /*#__PURE__*/React.createElement("option", {
    key: t.id
  }, t.name)))), /*#__PURE__*/React.createElement(DataTable, {
    rowKey: r => r.id,
    empty: "No customers match your search",
    columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "name",
      header: "Name",
      render: r => /*#__PURE__*/React.createElement("button", {
        onClick: () => setDetail(r),
        style: {
          background: "none",
          border: "none",
          padding: 0,
          color: "var(--accent)",
          fontWeight: 600,
          cursor: "pointer",
          font: "inherit"
        }
      }, r.name)
    }, {
      key: "type",
      header: "Type"
    }, {
      key: "phone",
      header: "Phone"
    }, {
      key: "balance",
      header: "Balance",
      align: "right"
    }, {
      key: "active",
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.active ? "success" : "neutral"
      }, r.active ? "Active" : "Inactive")
    }, {
      key: "act",
      header: "",
      align: "right",
      render: () => /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          gap: 4,
          justifyContent: "flex-end"
        }
      }, /*#__PURE__*/React.createElement(IconButton, {
        label: "Edit",
        size: "sm"
      }, "\u270E"))
    }],
    rows: filtered
  }), /*#__PURE__*/React.createElement(Modal, {
    open: show,
    wide: true,
    title: "Add customer",
    onClose: () => setShow(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      onClick: save
    }, "Save customer"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setShow(false)
    }, "Cancel"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Customer name"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.name,
    onChange: e => setForm({
      ...form,
      name: e.target.value
    }),
    placeholder: "Business name"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Contact person"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.contact,
    onChange: e => setForm({
      ...form,
      contact: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Customer type"
  }, /*#__PURE__*/React.createElement(Select, {
    value: form.type,
    onChange: e => setForm({
      ...form,
      type: e.target.value
    })
  }, d.customerTypes.map(t => /*#__PURE__*/React.createElement("option", {
    key: t.id
  }, t.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Phone / Mobile"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.phone,
    onChange: e => setForm({
      ...form,
      phone: e.target.value
    }),
    placeholder: "0121 000 0000"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "WhatsApp No."
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.whatsapp,
    onChange: e => setForm({
      ...form,
      whatsapp: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.email,
    onChange: e => setForm({
      ...form,
      email: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "VAT No."
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.vat,
    onChange: e => setForm({
      ...form,
      vat: e.target.value
    }),
    placeholder: "GB 000 0000 00"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "City"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.city,
    onChange: e => setForm({
      ...form,
      city: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Postcode"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.postcode,
    onChange: e => setForm({
      ...form,
      postcode: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Billing address",
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(Textarea, {
    rows: 2,
    value: form.address,
    onChange: e => setForm({
      ...form,
      address: e.target.value
    }),
    placeholder: "Street, landmark, country"
  })))));
}
function CustomerTypesScreen() {
  const d = window.POSDATA;
  return window.ListScreen({
    title: "Customer Types",
    addLabel: "Add type",
    columns: [{
      key: "name",
      header: "Type name"
    }, {
      key: "customers",
      header: "Customers",
      align: "right"
    }],
    rows: d.customerTypes,
    formFields: [{
      key: "name",
      label: "Type name",
      required: true,
      full: true,
      placeholder: "e.g. Wholesale"
    }],
    toBuild: f => ({
      id: "ct" + Date.now(),
      name: f.name,
      customers: 0
    })
  });
}
function ReceiptsScreen() {
  const {
    Card,
    Button,
    DataTable,
    Badge,
    Field,
    Select,
    Input
  } = CO;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.receipts);
  const [draft, setDraft] = React.useState({
    customer: "",
    amount: "",
    mode: "CASH",
    ref: ""
  });
  const post = () => {
    if (!draft.customer || !draft.amount) return;
    const n = 504 + (rows.length - 3);
    setRows([{
      id: "r" + Date.now(),
      code: "RCP-0" + n,
      customer: draft.customer,
      amount: "£" + parseFloat(draft.amount || 0).toFixed(2),
      mode: draft.mode,
      ref: draft.ref || "—",
      date: "2026-06-14"
    }, ...rows]);
    setDraft({
      customer: "",
      amount: "",
      mode: "CASH",
      ref: ""
    });
  };
  const tone = {
    CASH: "success",
    BANK_TRANSFER: "info",
    CHEQUE: "warning"
  };
  return /*#__PURE__*/React.createElement(Card, {
    title: "Customer Receipts"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto",
      gap: 12,
      alignItems: "flex-end",
      marginBottom: "1.25rem"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Customer"
  }, /*#__PURE__*/React.createElement(Select, {
    value: draft.customer,
    onChange: e => setDraft({
      ...draft,
      customer: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select\u2026"), d.customers.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.id
  }, c.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Amount"
  }, /*#__PURE__*/React.createElement(Input, {
    value: draft.amount,
    onChange: e => setDraft({
      ...draft,
      amount: e.target.value
    }),
    placeholder: "0.00"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Payment mode"
  }, /*#__PURE__*/React.createElement(Select, {
    value: draft.mode,
    onChange: e => setDraft({
      ...draft,
      mode: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", null, "CASH"), /*#__PURE__*/React.createElement("option", null, "BANK_TRANSFER"), /*#__PURE__*/React.createElement("option", null, "CHEQUE"))), /*#__PURE__*/React.createElement(Field, {
    label: "Reference"
  }, /*#__PURE__*/React.createElement(Input, {
    value: draft.ref,
    onChange: e => setDraft({
      ...draft,
      ref: e.target.value
    }),
    placeholder: "Optional"
  })), /*#__PURE__*/React.createElement(Button, {
    onClick: post
  }, "Post receipt")), /*#__PURE__*/React.createElement(DataTable, {
    rowKey: r => r.id,
    columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "customer",
      header: "Customer"
    }, {
      key: "amount",
      header: "Amount",
      align: "right"
    }, {
      key: "mode",
      header: "Mode",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: tone[r.mode]
      }, r.mode.replace("_", " "))
    }, {
      key: "ref",
      header: "Reference"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "act",
      header: "",
      align: "right",
      render: () => /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm"
      }, "Print")
    }],
    rows: rows
  }));
}
function SalePersonsScreen() {
  const d = window.POSDATA;
  const {
    Badge
  } = CO;
  return window.ListScreen({
    title: "Sale Persons",
    addLabel: "Add sale person",
    columns: [{
      key: "name",
      header: "Name"
    }, {
      key: "designation",
      header: "Designation"
    }, {
      key: "region",
      header: "Region"
    }, {
      key: "commission",
      header: "Commission",
      align: "right"
    }, {
      key: "status",
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.status === "Active" ? "success" : "neutral"
      }, r.status)
    }],
    rows: d.salePersons,
    formFields: [{
      key: "name",
      label: "Name",
      required: true
    }, {
      key: "designation",
      label: "Designation"
    }, {
      key: "region",
      label: "Region"
    }, {
      key: "commission",
      label: "Commission %",
      placeholder: "2.0%"
    }],
    toBuild: f => ({
      id: "sp" + Date.now(),
      name: f.name,
      designation: f.designation,
      region: f.region,
      commission: f.commission || "0%",
      status: "Active"
    })
  });
}
function LedgerReport() {
  const d = window.POSDATA;
  const ledger = [{
    doc: "INV-1042",
    date: "2026-06-10",
    type: "Invoice",
    narration: "Sale invoice",
    debit: "£1,240.00",
    credit: "—",
    balance: "£1,240.00"
  }, {
    doc: "RCP-0501",
    date: "2026-06-10",
    type: "Receipt",
    narration: "Bank transfer",
    debit: "—",
    credit: "£1,240.00",
    balance: "£0.00"
  }, {
    doc: "INV-1051",
    date: "2026-06-12",
    type: "Invoice",
    narration: "Sale invoice",
    debit: "£860.50",
    credit: "—",
    balance: "£860.50"
  }, {
    doc: "RCP-0509",
    date: "2026-06-13",
    type: "Receipt",
    narration: "Cash",
    debit: "—",
    credit: "£400.00",
    balance: "£460.50"
  }];
  return window.ReportScreen({
    title: "Ledger Report",
    subtitle: "Chronological transaction history per customer with running balance.",
    note: "Filter by customer, branch and date range. Printable and emailable.",
    columns: [{
      key: "doc",
      header: "Doc No."
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "type",
      header: "Type"
    }, {
      key: "narration",
      header: "Narration"
    }, {
      key: "debit",
      header: "Debit",
      align: "right"
    }, {
      key: "credit",
      header: "Credit",
      align: "right"
    }, {
      key: "balance",
      header: "Balance",
      align: "right"
    }],
    rows: ledger
  });
}
function ReceivableReport() {
  const d = window.POSDATA;
  const rows = d.customers.filter(c => c.balance !== "£0.00").map(c => ({
    code: c.code,
    name: c.name,
    type: c.type,
    address: window.POSDATA.branch,
    due: c.balance
  }));
  return window.ReportScreen({
    title: "Receivable Report",
    subtitle: "Customers with outstanding balances as of the selected date.",
    columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "name",
      header: "Customer"
    }, {
      key: "type",
      header: "Type"
    }, {
      key: "address",
      header: "Branch"
    }, {
      key: "due",
      header: "Amount due",
      align: "right"
    }],
    rows
  });
}
Object.assign(window, {
  CustomersScreen,
  CustomerTypesScreen,
  ReceiptsScreen,
  SalePersonsScreen,
  LedgerReport,
  ReceivableReport
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pos-web/screens-company.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pos-web/screens-core.jsx
try { (() => {
/* POS UK web — Dashboard + generic placeholder. */
const C = window.POSUKDesignSystem_85bb4f;
function DashboardScreen({
  go
}) {
  const {
    Card,
    StatCard,
    Button,
    DataTable,
    Badge
  } = C;
  const d = window.POSDATA;
  const {
    Toolbar,
    BranchSelect,
    DateField
  } = window;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Dashboard",
    subtitle: "Summary for the selected branch and date range."
  }, /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement(BranchSelect, null), /*#__PURE__*/React.createElement(DateField, {
    label: "From",
    defaultValue: "2026-06-01"
  }), /*#__PURE__*/React.createElement(DateField, {
    label: "To",
    defaultValue: "2026-06-14"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Apply")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
      gap: "1rem"
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Invoices total",
    value: d.stats.invoicesTotal,
    meta: d.stats.invoicesCount + " documents"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Receipts total",
    value: d.stats.receiptsTotal,
    meta: d.stats.receiptsCount + " documents"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Customers with AR",
    value: d.stats.receivables,
    accent: true
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Low-stock items",
    value: d.stats.lowStock,
    meta: "below re-order level"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr",
      gap: "1rem"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Recent invoices",
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: () => go("invoices")
    }, "View all")
  }, /*#__PURE__*/React.createElement(DataTable, {
    rowKey: r => r.id,
    columns: [{
      key: "no",
      header: "No"
    }, {
      key: "customer",
      header: "Customer"
    }, {
      key: "net",
      header: "Net total",
      align: "right"
    }, {
      key: "outstanding",
      header: "Outstanding",
      align: "right"
    }, {
      key: "status",
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone
      }, r.status)
    }],
    rows: d.invoices
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Re-order alerts",
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: () => go("rpt-reorder")
    }, "Report")
  }, /*#__PURE__*/React.createElement(DataTable, {
    rowKey: r => r.id,
    empty: "All products above threshold",
    columns: [{
      key: "name",
      header: "Product"
    }, {
      key: "qty",
      header: "Bal",
      align: "right"
    }, {
      key: "reorder",
      header: "ROL",
      align: "right"
    }, {
      key: "due",
      header: "",
      align: "right",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: "danger"
      }, r.reorder - r.qty, " due")
    }],
    rows: d.products.filter(p => p.qty < p.reorder)
  }))));
}
function PlaceholderScreen({
  title
}) {
  const {
    Card
  } = C;
  return /*#__PURE__*/React.createElement(Card, {
    title: title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "2.5rem 1rem",
      textAlign: "center",
      color: "var(--text-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-md)",
      color: "var(--text-muted)",
      marginBottom: 6
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-sm)"
    }
  }, "Specified in the PRD \u2014 available on request.")));
}
Object.assign(window, {
  DashboardScreen,
  PlaceholderScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pos-web/screens-core.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pos-web/screens-product.jsx
try { (() => {
/* POS UK web — Product module. */
const PR = window.POSUKDesignSystem_85bb4f;
function CategoriesScreen() {
  const d = window.POSDATA;
  const {
    Badge
  } = PR;
  return window.ListScreen({
    title: "Categories",
    addLabel: "Add category",
    columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "name",
      header: "Category"
    }, {
      key: "items",
      header: "Total items",
      align: "right"
    }, {
      key: "active",
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.active ? "success" : "neutral"
      }, r.active ? "Active" : "Inactive")
    }],
    rows: d.categories,
    formFields: [{
      key: "name",
      label: "Category name",
      required: true
    }, {
      key: "code",
      label: "Code",
      placeholder: "CAT-05"
    }],
    toBuild: f => ({
      id: "cat" + Date.now(),
      code: f.code || "CAT-NEW",
      name: f.name,
      items: 0,
      active: true
    })
  });
}
function SubCategoriesScreen() {
  const d = window.POSDATA;
  return window.ListScreen({
    title: "Sub Categories",
    addLabel: "Add sub category",
    columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "parent",
      header: "Parent category"
    }, {
      key: "name",
      header: "Sub category"
    }, {
      key: "items",
      header: "Total items",
      align: "right"
    }],
    rows: d.subCategories,
    formFields: [{
      key: "parent",
      label: "Parent category",
      options: d.categories.map(c => c.name),
      required: true
    }, {
      key: "name",
      label: "Sub category name",
      required: true
    }, {
      key: "code",
      label: "Code",
      placeholder: "SUB-05"
    }],
    toBuild: f => ({
      id: "sc" + Date.now(),
      code: f.code || "SUB-NEW",
      parent: f.parent,
      name: f.name,
      items: 0
    })
  });
}
function LocationsScreen() {
  const d = window.POSDATA;
  return window.ListScreen({
    title: "Stock Locations",
    addLabel: "Add location",
    columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "name",
      header: "Location name"
    }],
    rows: d.locations,
    formFields: [{
      key: "code",
      label: "Location code",
      placeholder: "LOC-04"
    }, {
      key: "name",
      label: "Location name",
      required: true
    }],
    toBuild: f => ({
      id: "l" + Date.now(),
      code: f.code || "LOC-NEW",
      name: f.name
    })
  });
}
function UomsScreen() {
  const d = window.POSDATA;
  return window.ListScreen({
    title: "UOM — Units of Measurement",
    addLabel: "Add UOM",
    columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "name",
      header: "Unit name"
    }],
    rows: d.uoms,
    formFields: [{
      key: "code",
      label: "UOM code",
      placeholder: "UOM-06"
    }, {
      key: "name",
      label: "Unit name",
      required: true,
      placeholder: "e.g. Pallet"
    }],
    toBuild: f => ({
      id: "u" + Date.now(),
      code: f.code || "UOM-NEW",
      name: f.name
    })
  });
}
function ProductsScreen() {
  const {
    Card,
    Button,
    DataTable,
    Badge,
    Modal,
    Field,
    Input,
    Select,
    IconButton
  } = PR;
  const {
    Toolbar
  } = window;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.products);
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("");
  const [show, setShow] = React.useState(false);
  const blank = {
    sku: "",
    name: "",
    type: "Finished",
    category: "Grocery",
    sub: "Rice & Grains",
    uom: "Box",
    purchase: "",
    wholesale: "",
    retail: "",
    location: "Main Warehouse",
    reorder: "",
    barcode: ""
  };
  const [form, setForm] = React.useState(blank);
  const filtered = rows.filter(p => (p.name + p.sku).toLowerCase().includes(q.toLowerCase()) && (!cat || p.category === cat));
  const save = () => {
    if (!form.name.trim() || !form.sku.trim()) return;
    setRows([{
      id: "p" + Date.now(),
      ...form,
      qty: 0,
      reorder: parseInt(form.reorder) || 0,
      active: true
    }, ...rows]);
    setForm(blank);
    setShow(false);
  };
  return /*#__PURE__*/React.createElement(Card, {
    title: "Products",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      onClick: () => setShow(true)
    }, "Add new"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost"
    }, "Import items"))
  }, /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search SKU or name",
    value: q,
    onChange: e => setQ(e.target.value),
    style: {
      width: "auto",
      minWidth: "16rem"
    }
  }), /*#__PURE__*/React.createElement(Select, {
    value: cat,
    onChange: e => setCat(e.target.value),
    style: {
      width: "auto"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All categories"), d.categories.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.id
  }, c.name)))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    rowKey: r => r.id,
    empty: "No products match your search",
    columns: [{
      key: "sku",
      header: "SKU"
    }, {
      key: "name",
      header: "Product",
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          color: "var(--text)",
          fontWeight: 600
        }
      }, r.name)
    }, {
      key: "category",
      header: "Category"
    }, {
      key: "sub",
      header: "Sub category"
    }, {
      key: "uom",
      header: "UOM"
    }, {
      key: "wholesale",
      header: "W/sale",
      align: "right",
      render: r => "£" + r.wholesale
    }, {
      key: "retail",
      header: "Retail",
      align: "right",
      render: r => "£" + r.retail
    }, {
      key: "qty",
      header: "Qty",
      align: "right",
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          color: r.qty < r.reorder ? "var(--danger)" : "var(--text-muted)",
          fontWeight: r.qty < r.reorder ? 600 : 400
        }
      }, r.qty)
    }, {
      key: "active",
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.active ? "success" : "neutral"
      }, r.active ? "Active" : "Inactive")
    }, {
      key: "act",
      header: "",
      align: "right",
      render: () => /*#__PURE__*/React.createElement(IconButton, {
        label: "Edit",
        size: "sm"
      }, "\u270E")
    }],
    rows: filtered
  })), /*#__PURE__*/React.createElement(Modal, {
    open: show,
    wide: true,
    title: "Add product",
    onClose: () => setShow(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      onClick: save
    }, "Save product"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setShow(false)
    }, "Cancel"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Product code (SKU)"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.sku,
    onChange: e => setForm({
      ...form,
      sku: e.target.value
    }),
    placeholder: "SKU-1007"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Product name",
    style: {
      gridColumn: "span 2"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.name,
    onChange: e => setForm({
      ...form,
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Product type"
  }, /*#__PURE__*/React.createElement(Select, {
    value: form.type,
    onChange: e => setForm({
      ...form,
      type: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", null, "Finished"), /*#__PURE__*/React.createElement("option", null, "Raw"))), /*#__PURE__*/React.createElement(Field, {
    label: "Category"
  }, /*#__PURE__*/React.createElement(Select, {
    value: form.category,
    onChange: e => setForm({
      ...form,
      category: e.target.value
    })
  }, d.categories.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.id
  }, c.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Sub category"
  }, /*#__PURE__*/React.createElement(Select, {
    value: form.sub,
    onChange: e => setForm({
      ...form,
      sub: e.target.value
    })
  }, d.subCategories.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.id
  }, s.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "UOM"
  }, /*#__PURE__*/React.createElement(Select, {
    value: form.uom,
    onChange: e => setForm({
      ...form,
      uom: e.target.value
    })
  }, d.uoms.map(u => /*#__PURE__*/React.createElement("option", {
    key: u.id
  }, u.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Stock location"
  }, /*#__PURE__*/React.createElement(Select, {
    value: form.location,
    onChange: e => setForm({
      ...form,
      location: e.target.value
    })
  }, d.locations.map(l => /*#__PURE__*/React.createElement("option", {
    key: l.id
  }, l.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Re-order level"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.reorder,
    onChange: e => setForm({
      ...form,
      reorder: e.target.value
    }),
    placeholder: "0"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Purchase rate"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.purchase,
    onChange: e => setForm({
      ...form,
      purchase: e.target.value
    }),
    placeholder: "0.00"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Wholesale rate"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.wholesale,
    onChange: e => setForm({
      ...form,
      wholesale: e.target.value
    }),
    placeholder: "0.00"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Retail rate"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.retail,
    onChange: e => setForm({
      ...form,
      retail: e.target.value
    }),
    placeholder: "0.00"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Barcode",
    style: {
      gridColumn: "span 2"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.barcode,
    onChange: e => setForm({
      ...form,
      barcode: e.target.value
    }),
    placeholder: "EAN-13"
  })))));
}
function StockSummaryReport() {
  const d = window.POSDATA;
  return window.ReportScreen({
    title: "Current Stock Summary",
    subtitle: "Total quantity on hand per product across all locations.",
    columns: [{
      key: "sku",
      header: "SKU"
    }, {
      key: "name",
      header: "Product"
    }, {
      key: "uom",
      header: "UOM"
    }, {
      key: "qty",
      header: "Total qty",
      align: "right"
    }, {
      key: "value",
      header: "Stock value",
      align: "right",
      render: r => "£" + (r.qty * parseFloat(r.purchase)).toFixed(2)
    }],
    rows: d.products
  });
}
function CurrentStockReport() {
  const d = window.POSDATA;
  return window.ReportScreen({
    title: "Current Stock Report",
    subtitle: "Detailed per-product, per-location stock levels.",
    columns: [{
      key: "sku",
      header: "SKU"
    }, {
      key: "name",
      header: "Product"
    }, {
      key: "location",
      header: "Location"
    }, {
      key: "uom",
      header: "UOM"
    }, {
      key: "qty",
      header: "Balance",
      align: "right"
    }],
    rows: d.products
  });
}
function StockLedgerReport() {
  const moves = [{
    sku: "SKU-1001",
    product: "Basmati Rice 20kg",
    location: "Main Warehouse",
    doc: "GRN-0091",
    date: "2026-06-08",
    inq: "300",
    out: "—",
    balance: "300"
  }, {
    sku: "SKU-1001",
    product: "Basmati Rice 20kg",
    location: "Main Warehouse",
    doc: "INV-1042",
    date: "2026-06-10",
    inq: "—",
    out: "60",
    balance: "240"
  }, {
    sku: "SKU-1003",
    product: "Chopped Tomatoes 2.5kg",
    location: "Showroom",
    doc: "INV-1044",
    date: "2026-06-12",
    inq: "—",
    out: "28",
    balance: "12"
  }, {
    sku: "SKU-1005",
    product: "Paper Bags 500ct",
    location: "Shop Floor",
    doc: "INV-1046",
    date: "2026-06-13",
    inq: "—",
    out: "17",
    balance: "8"
  }];
  return window.ReportScreen({
    title: "Stock Ledger",
    subtitle: "Chronological audit trail of all stock movements, linked to source documents.",
    columns: [{
      key: "sku",
      header: "SKU"
    }, {
      key: "product",
      header: "Product"
    }, {
      key: "location",
      header: "Location"
    }, {
      key: "doc",
      header: "Document"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "inq",
      header: "Qty in",
      align: "right"
    }, {
      key: "out",
      header: "Qty out",
      align: "right"
    }, {
      key: "balance",
      header: "Balance",
      align: "right"
    }],
    rows: moves
  });
}
function ProductListReport() {
  const d = window.POSDATA;
  const {
    Badge
  } = PR;
  return window.ReportScreen({
    title: "Product List",
    subtitle: "Printable catalogue of all products.",
    columns: [{
      key: "sku",
      header: "Code"
    }, {
      key: "name",
      header: "Name"
    }, {
      key: "category",
      header: "Category"
    }, {
      key: "sub",
      header: "Sub category"
    }, {
      key: "wholesale",
      header: "W/sale",
      align: "right",
      render: r => "£" + r.wholesale
    }, {
      key: "retail",
      header: "Retail",
      align: "right",
      render: r => "£" + r.retail
    }, {
      key: "qty",
      header: "Qty",
      align: "right"
    }, {
      key: "active",
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.active ? "success" : "neutral"
      }, r.active ? "Active" : "Inactive")
    }],
    rows: d.products
  });
}
function ReorderReport() {
  const d = window.POSDATA;
  const {
    Badge
  } = PR;
  const rows = d.products.filter(p => p.qty < p.reorder).map(p => ({
    sku: p.sku,
    name: p.name,
    location: p.location,
    balance: p.qty,
    reorder: p.reorder,
    due: p.reorder - p.qty
  }));
  return window.ReportScreen({
    title: "Re-Order Level Report",
    subtitle: "Products at or below their minimum stock threshold.",
    columns: [{
      key: "sku",
      header: "SKU"
    }, {
      key: "name",
      header: "Product"
    }, {
      key: "location",
      header: "Location"
    }, {
      key: "balance",
      header: "Current balance",
      align: "right"
    }, {
      key: "reorder",
      header: "Re-order level",
      align: "right"
    }, {
      key: "due",
      header: "Due balance",
      align: "right",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: "danger"
      }, r.due)
    }],
    rows
  });
}
function BarcodeReport() {
  const {
    Card,
    Button,
    Select
  } = PR;
  const {
    Toolbar
  } = window;
  const d = window.POSDATA;
  return /*#__PURE__*/React.createElement(Card, {
    title: "Product Barcode",
    subtitle: "Generate printable barcode labels for selected products.",
    actions: /*#__PURE__*/React.createElement(Button, null, "Print labels")
  }, /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-muted)",
      fontWeight: 600,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, "Label format", /*#__PURE__*/React.createElement(Select, {
    style: {
      width: "auto"
    }
  }, /*#__PURE__*/React.createElement("option", null, "40 \xD7 25 mm (2 per row)"), /*#__PURE__*/React.createElement("option", null, "50 \xD7 30 mm"), /*#__PURE__*/React.createElement("option", null, "A4 sheet (3 \xD7 8)"))), /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-muted)",
      fontWeight: 600,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, "Copies", /*#__PURE__*/React.createElement(Select, {
    style: {
      width: "auto"
    }
  }, /*#__PURE__*/React.createElement("option", null, "1"), /*#__PURE__*/React.createElement("option", null, "2"), /*#__PURE__*/React.createElement("option", null, "5"), /*#__PURE__*/React.createElement("option", null, "10")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
      gap: 12
    }
  }, d.products.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      background: "#fff",
      borderRadius: 8,
      padding: "12px 14px",
      color: "#0c1222"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#475569",
      margin: "2px 0 8px"
    }
  }, p.sku, " \xB7 \xA3", p.retail), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 1.5,
      height: 38,
      alignItems: "stretch"
    }
  }, p.barcode.split("").map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: parseInt(n) % 3 + 1.5,
      background: "#0c1222"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: 2,
      textAlign: "center",
      marginTop: 4,
      color: "#0c1222"
    }
  }, p.barcode)))));
}
Object.assign(window, {
  CategoriesScreen,
  SubCategoriesScreen,
  ProductsScreen,
  LocationsScreen,
  UomsScreen,
  StockSummaryReport,
  CurrentStockReport,
  StockLedgerReport,
  ProductListReport,
  ReorderReport,
  BarcodeReport
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pos-web/screens-product.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pos-web/screens-sales.jsx
try { (() => {
/* POS UK web — Sales module. */
const SA = window.POSUKDesignSystem_85bb4f;

/* Reusable line-item editor for documents (order / invoice / return). */
function LineItems({
  lines,
  setLines,
  showDisc = true
}) {
  const {
    Select,
    Input,
    IconButton,
    Button
  } = SA;
  const products = window.POSDATA.products;
  const setLine = (i, patch) => setLines(ls => ls.map((l, j) => j === i ? {
    ...l,
    ...patch
  } : l));
  const cols = showDisc ? "1fr 4.5rem 5rem 4.5rem 4.5rem 6rem 2rem" : "1fr 4.5rem 5rem 4.5rem 6rem 2rem";
  const head = showDisc ? ["Product", "Qty", "Rate", "Disc %", "VAT %", "Line total", ""] : ["Product", "Qty", "Rate", "VAT %", "Line total", ""];
  const lineTotal = l => (parseFloat(l.qty) || 0) * (parseFloat(l.rate) || 0) * (1 - (showDisc ? (parseFloat(l.disc) || 0) / 100 : 0)) * (1 + (parseFloat(l.vat) || 0) / 100);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: cols,
      gap: 8,
      fontSize: "var(--fs-2xs)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--text-subtle)",
      fontWeight: 600,
      marginBottom: 8
    }
  }, head.map((h, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      textAlign: i >= head.length - 2 ? "right" : "left"
    }
  }, h))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: cols,
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: l.productId,
    onChange: e => {
      const p = products.find(x => x.id === e.target.value);
      setLine(i, {
        productId: e.target.value,
        rate: p ? p.wholesale : l.rate
      });
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Pick product\u2026"), products.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.sku, " \u2014 ", p.name))), /*#__PURE__*/React.createElement(Input, {
    value: l.qty,
    onChange: e => setLine(i, {
      qty: e.target.value
    })
  }), /*#__PURE__*/React.createElement(Input, {
    value: l.rate,
    onChange: e => setLine(i, {
      rate: e.target.value
    })
  }), showDisc && /*#__PURE__*/React.createElement(Input, {
    value: l.disc,
    onChange: e => setLine(i, {
      disc: e.target.value
    })
  }), /*#__PURE__*/React.createElement(Input, {
    value: l.vat,
    onChange: e => setLine(i, {
      vat: e.target.value
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      fontWeight: 600,
      color: "var(--text)",
      fontSize: "var(--fs-base)"
    }
  }, "\xA3", lineTotal(l).toFixed(2)), /*#__PURE__*/React.createElement(IconButton, {
    label: "Remove line",
    size: "sm",
    onClick: () => setLines(ls => ls.filter((_, j) => j !== i))
  }, "\u2715")))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    style: {
      marginTop: 10
    },
    onClick: () => setLines(ls => [...ls, {
      productId: "",
      qty: "1",
      rate: "0",
      disc: "0",
      vat: "20"
    }])
  }, "+ Add line"));
}
function docTotals(lines, showDisc) {
  let sub = 0,
    vat = 0;
  lines.forEach(l => {
    const base = (parseFloat(l.qty) || 0) * (parseFloat(l.rate) || 0) * (1 - (showDisc ? (parseFloat(l.disc) || 0) / 100 : 0));
    sub += base;
    vat += base * ((parseFloat(l.vat) || 0) / 100);
  });
  return {
    sub,
    vat,
    grand: sub + vat
  };
}
function OrdersScreen() {
  const {
    Card,
    Button,
    DataTable,
    Badge,
    Modal,
    Field,
    Select,
    IconButton
  } = SA;
  const {
    TotalsBar
  } = window;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.orders);
  const [show, setShow] = React.useState(false);
  const [head, setHead] = React.useState({
    customer: "",
    person: "",
    date: "2026-06-14"
  });
  const [lines, setLines] = React.useState([{
    productId: "",
    qty: "1",
    rate: "0",
    disc: "0",
    vat: "20"
  }]);
  const t = docTotals(lines, true);
  const save = () => {
    if (!head.customer || !lines.some(l => l.productId)) return;
    setRows([{
      id: "o" + Date.now(),
      no: "SO-" + (2090 + rows.length - 3),
      date: head.date,
      customer: head.customer,
      person: head.person || "—",
      total: "£" + t.grand.toFixed(2),
      vat: true
    }, ...rows]);
    setShow(false);
    setHead({
      customer: "",
      person: "",
      date: "2026-06-14"
    });
    setLines([{
      productId: "",
      qty: "1",
      rate: "0",
      disc: "0",
      vat: "20"
    }]);
  };
  return /*#__PURE__*/React.createElement(Card, {
    title: "Sale Orders",
    actions: /*#__PURE__*/React.createElement(Button, {
      onClick: () => setShow(true)
    }, "New order")
  }, /*#__PURE__*/React.createElement(DataTable, {
    rowKey: r => r.id,
    columns: [{
      key: "no",
      header: "Order No"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "customer",
      header: "Customer"
    }, {
      key: "person",
      header: "Sale person"
    }, {
      key: "total",
      header: "Total",
      align: "right"
    }, {
      key: "act",
      header: "",
      align: "right",
      render: () => /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          gap: 4,
          justifyContent: "flex-end"
        }
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm"
      }, "Convert to invoice"))
    }],
    rows: rows
  }), /*#__PURE__*/React.createElement(Modal, {
    open: show,
    wide: true,
    title: "New sale order",
    onClose: () => setShow(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      onClick: save
    }, "Save order"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setShow(false)
    }, "Cancel"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Customer"
  }, /*#__PURE__*/React.createElement(Select, {
    value: head.customer,
    onChange: e => setHead({
      ...head,
      customer: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select\u2026"), d.customers.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.id
  }, c.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Sale person"
  }, /*#__PURE__*/React.createElement(Select, {
    value: head.person,
    onChange: e => setHead({
      ...head,
      person: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select\u2026"), d.salePersons.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.id
  }, s.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Order date"
  }, /*#__PURE__*/React.createElement(SA.Input, {
    type: "date",
    value: head.date,
    onChange: e => setHead({
      ...head,
      date: e.target.value
    })
  }))), /*#__PURE__*/React.createElement(LineItems, {
    lines: lines,
    setLines: setLines
  }), /*#__PURE__*/React.createElement(TotalsBar, {
    items: [["Subtotal", "£" + t.sub.toFixed(2)], ["VAT", "£" + t.vat.toFixed(2)], ["Grand total", "£" + t.grand.toFixed(2)]]
  })));
}
function InvoicesScreen() {
  const {
    Card,
    Button,
    DataTable,
    Badge,
    Modal,
    Field,
    Select,
    IconButton
  } = SA;
  const {
    TotalsBar,
    Toolbar
  } = window;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.invoices);
  const [show, setShow] = React.useState(false);
  const [head, setHead] = React.useState({
    customer: "",
    person: "",
    location: "Main Warehouse",
    date: "2026-06-14",
    order: ""
  });
  const [lines, setLines] = React.useState([{
    productId: "",
    qty: "1",
    rate: "0",
    disc: "0",
    vat: "20"
  }]);
  const t = docTotals(lines, true);
  const valid = head.customer && lines.some(l => l.productId);
  const post = () => {
    if (!valid) return;
    setRows([{
      id: "i" + Date.now(),
      no: "INV-" + (1047 + rows.length - 5),
      date: head.date,
      due: "2026-06-28",
      customer: head.customer,
      net: "£" + t.grand.toFixed(2),
      paid: "£0.00",
      outstanding: "£" + t.grand.toFixed(2),
      status: "Draft",
      tone: "info",
      vat: true
    }, ...rows]);
    setShow(false);
    setHead({
      customer: "",
      person: "",
      location: "Main Warehouse",
      date: "2026-06-14",
      order: ""
    });
    setLines([{
      productId: "",
      qty: "1",
      rate: "0",
      disc: "0",
      vat: "20"
    }]);
  };
  return /*#__PURE__*/React.createElement(Card, {
    title: "Sale Invoices",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      onClick: () => setShow(true)
    }, "New invoice"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost"
    }, "Refresh"))
  }, /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement(Select, {
    defaultValue: "",
    style: {
      width: "auto"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All statuses"), /*#__PURE__*/React.createElement("option", null, "Paid"), /*#__PURE__*/React.createElement("option", null, "Partial"), /*#__PURE__*/React.createElement("option", null, "Overdue"), /*#__PURE__*/React.createElement("option", null, "Draft")), /*#__PURE__*/React.createElement(SA.Input, {
    placeholder: "Search invoice or customer",
    style: {
      width: "auto",
      minWidth: "15rem"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    rowKey: r => r.id,
    columns: [{
      key: "no",
      header: "Invoice No"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "due",
      header: "Due date"
    }, {
      key: "customer",
      header: "Customer"
    }, {
      key: "net",
      header: "Net total",
      align: "right"
    }, {
      key: "paid",
      header: "Paid",
      align: "right"
    }, {
      key: "outstanding",
      header: "Outstanding",
      align: "right"
    }, {
      key: "status",
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone
      }, r.status)
    }, {
      key: "act",
      header: "",
      align: "right",
      render: () => /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          gap: 4,
          justifyContent: "flex-end"
        }
      }, /*#__PURE__*/React.createElement(IconButton, {
        label: "Print",
        size: "sm"
      }, "\u2399"), /*#__PURE__*/React.createElement(IconButton, {
        label: "Header",
        size: "sm"
      }, "\u22EF"))
    }],
    rows: rows
  })), /*#__PURE__*/React.createElement(Modal, {
    open: show,
    wide: true,
    title: "New sale invoice",
    onClose: () => setShow(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      onClick: post,
      disabled: !valid
    }, "Post invoice"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setShow(false)
    }, "Cancel"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      gap: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "From sale order"
  }, /*#__PURE__*/React.createElement(Select, {
    value: head.order,
    onChange: e => setHead({
      ...head,
      order: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 None \u2014"), d.orders.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.id
  }, o.no)))), /*#__PURE__*/React.createElement(Field, {
    label: "Customer"
  }, /*#__PURE__*/React.createElement(Select, {
    value: head.customer,
    onChange: e => setHead({
      ...head,
      customer: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select\u2026"), d.customers.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.id
  }, c.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Sale person"
  }, /*#__PURE__*/React.createElement(Select, {
    value: head.person,
    onChange: e => setHead({
      ...head,
      person: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select\u2026"), d.salePersons.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.id
  }, s.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Stock location"
  }, /*#__PURE__*/React.createElement(Select, {
    value: head.location,
    onChange: e => setHead({
      ...head,
      location: e.target.value
    })
  }, d.locations.map(l => /*#__PURE__*/React.createElement("option", {
    key: l.id
  }, l.name))))), head.order && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--accent)",
      margin: "0 0 10px"
    }
  }, "Lines loaded from ", head.order, " \u2014 editable below."), /*#__PURE__*/React.createElement(LineItems, {
    lines: lines,
    setLines: setLines
  }), /*#__PURE__*/React.createElement(TotalsBar, {
    items: [["Subtotal", "£" + t.sub.toFixed(2)], ["VAT (20%)", "£" + t.vat.toFixed(2)], ["Grand total", "£" + t.grand.toFixed(2)]]
  })));
}
function ReturnsScreen() {
  const {
    Card,
    Button,
    DataTable,
    Modal,
    Field,
    Select
  } = SA;
  const {
    TotalsBar
  } = window;
  const d = window.POSDATA;
  const [rows, setRows] = React.useState(d.returns);
  const [show, setShow] = React.useState(false);
  const [head, setHead] = React.useState({
    invoice: "",
    reason: "Damaged goods"
  });
  const [lines, setLines] = React.useState([{
    productId: "",
    qty: "1",
    rate: "0",
    vat: "20"
  }]);
  const t = docTotals(lines, false);
  const valid = head.invoice && lines.some(l => l.productId);
  const save = () => {
    if (!valid) return;
    const inv = d.invoices.find(i => i.no === head.invoice);
    setRows([{
      id: "sr" + Date.now(),
      no: "SR-0" + (314 + rows.length - 2),
      date: "2026-06-14",
      saleNo: head.invoice,
      customer: inv ? inv.customer : "—",
      person: "Daniel Carter",
      subtotal: "£" + t.sub.toFixed(2),
      vat: "£" + t.vat.toFixed(2),
      total: "£" + t.grand.toFixed(2)
    }, ...rows]);
    setShow(false);
    setHead({
      invoice: "",
      reason: "Damaged goods"
    });
    setLines([{
      productId: "",
      qty: "1",
      rate: "0",
      vat: "20"
    }]);
  };
  return /*#__PURE__*/React.createElement(Card, {
    title: "Sale Returns",
    actions: /*#__PURE__*/React.createElement(Button, {
      onClick: () => setShow(true)
    }, "New return")
  }, /*#__PURE__*/React.createElement(DataTable, {
    rowKey: r => r.id,
    columns: [{
      key: "no",
      header: "Return No"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "saleNo",
      header: "Against invoice"
    }, {
      key: "customer",
      header: "Customer"
    }, {
      key: "person",
      header: "Sale person"
    }, {
      key: "subtotal",
      header: "Subtotal",
      align: "right"
    }, {
      key: "vat",
      header: "VAT",
      align: "right"
    }, {
      key: "total",
      header: "Total",
      align: "right"
    }],
    rows: rows
  }), /*#__PURE__*/React.createElement(Modal, {
    open: show,
    wide: true,
    title: "New sale return",
    onClose: () => setShow(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      onClick: save,
      disabled: !valid
    }, "Save return"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setShow(false)
    }, "Cancel"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Against sale invoice"
  }, /*#__PURE__*/React.createElement(Select, {
    value: head.invoice,
    onChange: e => setHead({
      ...head,
      invoice: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select invoice\u2026"), d.invoices.map(i => /*#__PURE__*/React.createElement("option", {
    key: i.id
  }, i.no)))), /*#__PURE__*/React.createElement(Field, {
    label: "Reason"
  }, /*#__PURE__*/React.createElement(Select, {
    value: head.reason,
    onChange: e => setHead({
      ...head,
      reason: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", null, "Damaged goods"), /*#__PURE__*/React.createElement("option", null, "Wrong item"), /*#__PURE__*/React.createElement("option", null, "Customer cancelled"), /*#__PURE__*/React.createElement("option", null, "Quality issue")))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-subtle)",
      margin: "0 0 12px"
    }
  }, "Max return qty per product is enforced server-side against invoiced minus prior returns."), /*#__PURE__*/React.createElement(LineItems, {
    lines: lines,
    setLines: setLines,
    showDisc: false
  }), /*#__PURE__*/React.createElement(TotalsBar, {
    items: [["Subtotal", "£" + t.sub.toFixed(2)], ["VAT", "£" + t.vat.toFixed(2)], ["Refund total", "£" + t.grand.toFixed(2)]]
  })));
}
function SaleRegisterReport() {
  const d = window.POSDATA;
  const {
    Badge
  } = SA;
  return window.ReportScreen({
    title: "Sale Register",
    subtitle: "All sale invoices for the selected branch and period, with totals.",
    columns: [{
      key: "no",
      header: "Invoice No"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "customer",
      header: "Customer"
    }, {
      key: "net",
      header: "Net total",
      align: "right"
    }, {
      key: "paid",
      header: "Paid",
      align: "right"
    }, {
      key: "outstanding",
      header: "Outstanding",
      align: "right"
    }, {
      key: "status",
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone
      }, r.status)
    }],
    rows: d.invoices
  });
}
function ReturnRegisterReport() {
  const d = window.POSDATA;
  return window.ReportScreen({
    title: "Return Register",
    subtitle: "All sale returns for the selected branch and period.",
    columns: [{
      key: "no",
      header: "Return No"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "saleNo",
      header: "Invoice"
    }, {
      key: "customer",
      header: "Customer"
    }, {
      key: "subtotal",
      header: "Subtotal",
      align: "right"
    }, {
      key: "vat",
      header: "VAT",
      align: "right"
    }, {
      key: "total",
      header: "Total",
      align: "right"
    }],
    rows: d.returns
  });
}
Object.assign(window, {
  OrdersScreen,
  InvoicesScreen,
  ReturnsScreen,
  SaleRegisterReport,
  ReturnRegisterReport
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pos-web/screens-sales.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pos-web/shell.jsx
try { (() => {
/* POS UK web — app shell (sidebar + topbar) and login screen. */
const DS = window.POSUKDesignSystem_85bb4f;
const NAV = [{
  section: "Overview",
  items: [["dashboard", "Dashboard"]]
}, {
  section: "Company",
  items: [["customers", "Customers"], ["custtypes", "Customer Types"], ["receipts", "Customer Receipts"], ["salepersons", "Sale Persons"]],
  reports: [["rpt-ledger", "Ledger"], ["rpt-receivable", "Receivable"]]
}, {
  section: "Product",
  items: [["categories", "Categories"], ["subcategories", "Sub Categories"], ["products", "Products"], ["locations", "Stock Locations"], ["uoms", "UOM"]],
  reports: [["rpt-stocksummary", "Stock Summary"], ["rpt-currentstock", "Current Stock"], ["rpt-stockledger", "Stock Ledger"], ["rpt-productlist", "Product List"], ["rpt-reorder", "Re-Order Level"], ["rpt-barcode", "Product Barcode"]]
}, {
  section: "Sales",
  items: [["orders", "Sale Orders"], ["invoices", "Sale Invoices"], ["returns", "Sale Returns"]],
  reports: [["rpt-saleregister", "Sale Register"], ["rpt-returnregister", "Return Register"]]
}, {
  section: "Administration",
  items: [["branches", "Branches"], ["users", "Users"], ["userrights", "User Rights"], ["preferences", "Preferences"], ["import", "Bulk Import"]],
  reports: [["rpt-useractivity", "User Activity"], ["rpt-activeusers", "Active Users"], ["rpt-userslist", "Users List"]]
}];
function NavGroup({
  grp,
  route,
  onNavigate
}) {
  const {
    NavItem,
    NavSection
  } = DS;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(NavSection, null, grp.section), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, grp.items.map(([key, label]) => /*#__PURE__*/React.createElement(NavItem, {
    key: key,
    active: route === key,
    onClick: () => onNavigate(key)
  }, label))), grp.reports && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-2xs)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--text-subtle)",
      padding: "0.5rem 0.65rem 0.25rem",
      opacity: 0.7
    }
  }, "Reports"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      paddingLeft: 6,
      borderLeft: "1px solid var(--border)",
      marginLeft: 6
    }
  }, grp.reports.map(([key, label]) => /*#__PURE__*/React.createElement(NavItem, {
    key: key,
    active: route === key,
    onClick: () => onNavigate(key),
    style: {
      fontSize: "0.82rem"
    }
  }, label)))));
}
function AppShell({
  route,
  onNavigate,
  onLogout,
  children
}) {
  const {
    BrandMark,
    Button
  } = DS;
  const d = window.POSDATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "var(--bg-base)",
      backgroundImage: "var(--wash-app)"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: "var(--sidebar-w)",
      flexShrink: 0,
      background: "linear-gradient(180deg, var(--bg-elevated) 0%, #0d1424 100%)",
      borderRight: "1px solid var(--border)",
      padding: "1.25rem 0.875rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: "1.1rem",
      marginBottom: "0.25rem",
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement(BrandMark, {
    size: 36,
    showWordmark: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto",
      flex: 1,
      marginRight: "-0.4rem",
      paddingRight: "0.4rem"
    }
  }, NAV.map(grp => /*#__PURE__*/React.createElement(NavGroup, {
    key: grp.section,
    grp: grp,
    route: route,
    onNavigate: onNavigate
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      height: "var(--topbar-h)",
      flexShrink: 0,
      background: "rgba(17,24,39,0.75)",
      backdropFilter: "var(--blur)",
      WebkitBackdropFilter: "var(--blur)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 1.25rem",
      position: "sticky",
      top: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--text-subtle)",
      fontWeight: 600
    }
  }, "Branch"), " \xB7 ", d.branch), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: "50%",
      background: "var(--primary)",
      display: "grid",
      placeItems: "center",
      fontSize: "0.72rem",
      fontWeight: 700,
      color: "#fff"
    }
  }, d.user.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.15
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-base)",
      fontWeight: 600,
      color: "var(--text)"
    }
  }, d.user.fullName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-2xs)",
      color: "var(--text-subtle)"
    }
  }, d.user.role)), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: onLogout
  }, "Log out"))), /*#__PURE__*/React.createElement("main", {
    style: {
      padding: "1.25rem",
      flex: 1,
      minWidth: 0
    }
  }, children)));
}
function LoginScreen({
  onLogin
}) {
  const {
    BrandMark,
    Field,
    Input,
    Button
  } = DS;
  const [u, setU] = React.useState("admin");
  const [p, setP] = React.useState("admin123");
  const [busy, setBusy] = React.useState(false);
  const submit = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      onLogin();
    }, 550);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: "1.5rem",
      backgroundColor: "var(--bg-base)",
      backgroundImage: "var(--wash-login)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 420,
      background: "var(--bg-card-solid)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "2rem 2rem 1.75rem",
      boxShadow: "var(--shadow-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: "1.75rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem"
    }
  }, /*#__PURE__*/React.createElement(BrandMark, {
    size: 48
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "1.35rem",
      fontWeight: 700,
      letterSpacing: "var(--tracking-tight)",
      color: "var(--text)"
    }
  }, "Welcome back"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0.4rem 0 0",
      fontSize: "var(--fs-base)",
      color: "var(--text-muted)"
    }
  }, "Sign in to continue to POS / ERP")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Username"
  }, /*#__PURE__*/React.createElement(Input, {
    value: u,
    onChange: e => setU(e.target.value),
    autoComplete: "username"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Password"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "password",
    value: p,
    onChange: e => setP(e.target.value),
    autoComplete: "current-password"
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      fontSize: "var(--fs-sm)",
      color: "var(--text-muted)",
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    defaultChecked: true,
    style: {
      width: 15,
      height: 15,
      accentColor: "var(--accent)"
    }
  }), " Remember me"), /*#__PURE__*/React.createElement(Button, {
    block: true,
    disabled: busy,
    onClick: submit,
    style: {
      marginTop: "0.25rem",
      padding: "0.7rem 1rem"
    }
  }, busy ? "Signing in…" : "Sign in"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textAlign: "center",
      fontSize: "var(--fs-sm)",
      color: "var(--text-subtle)"
    }
  }, "Demo \xB7 ", /*#__PURE__*/React.createElement("code", {
    style: {
      color: "var(--accent)",
      fontFamily: "var(--font-mono)"
    }
  }, "admin / admin123")))));
}
Object.assign(window, {
  AppShell,
  LoginScreen,
  POS_NAV: NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pos-web/shell.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BrandMark = __ds_scope.BrandMark;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.NavItem = __ds_scope.NavItem;

__ds_ns.NavSection = __ds_scope.NavSection;

})();
