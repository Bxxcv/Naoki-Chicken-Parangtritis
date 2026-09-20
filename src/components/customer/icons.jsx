// Ikon inline (tanpa dependency tambahan) — konsisten dengan aturan skill:
// "avoid random dependencies for tiny UI tasks".
function IconBase({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconCart(props) {
  return (
    <IconBase {...props}>
      <path d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </IconBase>
  );
}

export function IconDrumstick(props) {
  return (
    <IconBase {...props}>
      <path d="M13.5 3c1.3 0 2.1 1 1.9 2.2l-.5 2.6c2.4 1 3.9 3.4 3.5 5.9-.6 3-3.7 5-6.8 4.5C8.3 17.6 6.2 14.7 6.8 11.7c.5-2.5 2.6-4.3 5.1-4.5l.5-2.6c.1-.9.7-1.6 1.1-1.6Z" />
      <circle cx="10.5" cy="12.5" r=".6" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="14.5" r=".6" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function IconBowl(props) {
  return (
    <IconBase {...props}>
      <path d="M4 11h16a8 8 0 0 1-16 0Z" />
      <path d="M9 11c0-2 1.3-4 3-4s3 2 3 4" />
      <path d="M2 11h20" />
    </IconBase>
  );
}

export function IconDrink(props) {
  return (
    <IconBase {...props}>
      <path d="M7.5 8h9l-1.1 10.3a2 2 0 0 1-2 1.7h-2.8a2 2 0 0 1-2-1.7L7.5 8Z" />
      <path d="M9 8 8 5h8l-1 3" />
      <path d="M9.5 12.5h5" />
    </IconBase>
  );
}

export function IconDineIn(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="7" />
      <path d="M9 9v6M9 9c0-.8.3-1.5.8-2M15 9v6" />
    </IconBase>
  );
}

export function IconTakeaway(props) {
  return (
    <IconBase {...props}>
      <path d="M4.5 8h15l-1.3 11.2a2 2 0 0 1-2 1.8H7.8a2 2 0 0 1-2-1.8L4.5 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </IconBase>
  );
}

export function IconPickup(props) {
  return (
    <IconBase {...props}>
      <path d="M4 10 5 4h14l1 6" />
      <path d="M4 10v9a1 1 0 0 0 1 1h3v-6h8v6h3a1 1 0 0 0 1-1v-9" />
      <path d="M4 10a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </IconBase>
  );
}

export function IconDelivery(props) {
  return (
    <IconBase {...props}>
      <circle cx="6.5" cy="18" r="2.2" />
      <circle cx="17" cy="18" r="2.2" />
      <path d="M6.5 18h5.5l2-6h3M12.5 12l2 3h2.5" />
      <path d="M9 8h3l1 4" />
    </IconBase>
  );
}

export function IconPin(props) {
  return (
    <IconBase {...props}>
      <path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </IconBase>
  );
}

export function IconToggle(props) {
  return (
    <IconBase {...props}>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="7" cy="17" r="2" />
    </IconBase>
  );
}
