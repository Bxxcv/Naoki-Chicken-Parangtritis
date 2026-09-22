// Ikon inline (tanpa dependency tambahan).
function IconBase({ children, size = 22, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
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

export function IconPin(props) {
  return (
    <IconBase {...props}>
      <path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </IconBase>
  );
}

export function IconDineIn(props) {
  return (
    <IconBase {...props}>
      <path d="M5 3v7a2.5 2.5 0 0 0 5 0V3M7.5 10v11" />
      <path d="M17.5 3c-1.4 1.4-2 3.2-2 5.2 0 1.4.7 2.3 2 2.6V21" />
    </IconBase>
  );
}

export function IconTakeaway(props) {
  return (
    <IconBase {...props}>
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </IconBase>
  );
}

export function IconPickup(props) {
  return (
    <IconBase {...props}>
      <path d="M4 10 5.2 4h13.6L20 10" />
      <path d="M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9" />
      <path d="M4 10a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
      <path d="M9.5 20v-5h5v5" />
    </IconBase>
  );
}

export function IconDelivery(props) {
  return (
    <IconBase {...props}>
      <circle cx="7" cy="18" r="2.1" />
      <circle cx="17.5" cy="18" r="2.1" />
      <path d="M7 18h6.4M2.5 6h8.5v12M11 10h4l3 3.5V18" />
    </IconBase>
  );
}

export function IconDrumstick(props) {
  return (
    <IconBase {...props}>
      <path d="M14.2 3.2c1.3 0 2 1 1.8 2.2l-.5 2.4c2.3 1 3.7 3.3 3.3 5.7-.6 2.9-3.6 4.8-6.6 4.3-3.2-.5-5.2-3.3-4.6-6.2.5-2.4 2.5-4.1 4.9-4.3l.5-2.5c.1-.9.7-1.6 1.2-1.6Z" />
      <path d="m9.6 15.2-4 4M6.6 17.2 5 21l3.8-1.6" />
    </IconBase>
  );
}

export function IconBag(props) {
  return (
    <IconBase {...props}>
      <path d="M4.5 7h15l-1 12.3a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4.5 7Z" />
      <path d="M8.8 10V6.5a3.2 3.2 0 0 1 6.4 0V10" />
    </IconBase>
  );
}

export function IconCup(props) {
  return (
    <IconBase {...props}>
      <path d="M7 8h10l-1 11a2 2 0 0 1-2 1.8h-4A2 2 0 0 1 8 19L7 8Z" />
      <path d="M8.6 8 8 4.5h8L15.4 8" />
      <path d="M17.3 11.5h1.4a2.3 2.3 0 0 1 0 4.6h-1.8" />
    </IconBase>
  );
}

export function IconSearch(props) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </IconBase>
  );
}

export function IconClock(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </IconBase>
  );
}

export function IconArrowRight(props) {
  return (
    <IconBase {...props}>
      <path d="M4.5 12h15M13 5.5 19.5 12 13 18.5" />
    </IconBase>
  );
}

export function IconChevronDown(props) {
  return (
    <IconBase {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </IconBase>
  );
}

export function IconPlay(props) {
  return (
    <IconBase {...props}>
      <path d="M7 4.8 19 12 7 19.2V4.8Z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function IconPause(props) {
  return (
    <IconBase {...props}>
      <rect x="7" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none" />
      <rect x="13.4" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

// Satu sumber artwork kategori: dipakai komponen ikon di bawah DAN
// animasi fly-to-cart (butuh string path). Kunci: tea, milo, milkshake,
// cafe, hotplate, ricebox, extra, ayam, paket, minum.
const CATEGORY_PATHS = {
  tea: '<path d="M6 10h11v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-5Z" /><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" /><path d="M4.5 21h14" /><path d="M12 10V8" /><rect x="10.8" y="5.4" width="2.4" height="2.6" rx=".6" />',
  milo: '<path d="M7 4h10v12a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V4Z" /><path d="M17 8.5h1.2a2.8 2.8 0 0 1 0 5.6H17" /><path d="M10 9h4" />',
  milkshake: '<path d="M8.5 9h7l-.9 11H9.4L8.5 9Z" /><path d="M8.5 9c0-2.2 1.6-3.5 3.5-3.5s3.5 1.3 3.5 3.5" /><path d="m13 5.5 1.8-3" />',
  cafe: '<path d="M4 17.5h16" /><path d="M5.5 17.5a6.5 6.5 0 0 1 13 0" /><path d="M12 11V9.5" /><circle cx="12" cy="8" r="1" />',
  hotplate: '<ellipse cx="12" cy="15.5" rx="8" ry="3.8" /><ellipse cx="12" cy="15.5" rx="4.5" ry="2" /><path d="M9 3.5c-1.2 1.6 1.2 2.6 0 4.2M12.5 3c-1.2 1.6 1.2 2.6 0 4.2M16 3.5c-1.2 1.6 1.2 2.6 0 4.2" />',
  ricebox: '<path d="M7 9h10l1.2 11H5.8L7 9Z" /><path d="m7 9 1.6-4.5h6.8L17 9" /><path d="M10 4.5V3M14 4.5V3" />',
  extra: '<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5v7M8.5 12h7" />',
  ayam: '<path d="M14.2 3.2c1.3 0 2 1 1.8 2.2l-.5 2.4c2.3 1 3.7 3.3 3.3 5.7-.6 2.9-3.6 4.8-6.6 4.3-3.2-.5-5.2-3.3-4.6-6.2.5-2.4 2.5-4.1 4.9-4.3l.5-2.5c.1-.9.7-1.6 1.2-1.6Z" /><path d="m9.6 15.2-4 4M6.6 17.2 5 21l3.8-1.6" />',
  paket: '<path d="M4.5 7h15l-1 12.3a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4.5 7Z" /><path d="M8.8 10V6.5a3.2 3.2 0 0 1 6.4 0V10" />',
  minum: '<path d="M7 8h10l-1 11a2 2 0 0 1-2 1.8h-4A2 2 0 0 1 8 19L7 8Z" /><path d="M8.6 8 8 4.5h8L15.4 8" /><path d="M17.3 11.5h1.4a2.3 2.3 0 0 1 0 4.6h-1.8" />',
};

export { CATEGORY_PATHS };

function CategoryArt({ art, ...props }) {
  return (
    <IconBase {...props}>
      <g dangerouslySetInnerHTML={{ __html: CATEGORY_PATHS[art] }} />
    </IconBase>
  );
}

export function IconTea(props) { return <CategoryArt art="tea" {...props} />; }
export function IconMilo(props) { return <CategoryArt art="milo" {...props} />; }
export function IconMilkshake(props) { return <CategoryArt art="milkshake" {...props} />; }
export function IconCafe(props) { return <CategoryArt art="cafe" {...props} />; }
export function IconHotPlate(props) { return <CategoryArt art="hotplate" {...props} />; }
export function IconRiceBox(props) { return <CategoryArt art="ricebox" {...props} />; }
export function IconExtra(props) { return <CategoryArt art="extra" {...props} />; }

export const CATEGORY_COMPONENTS = {
  tea: IconTea,
  milo: IconMilo,
  milkshake: IconMilkshake,
  cafe: IconCafe,
  hotplate: IconHotPlate,
  ricebox: IconRiceBox,
  extra: IconExtra,
};

export function IconMenuBars(props) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconBase>
  );
}

export function IconClose(props) {
  return (
    <IconBase {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </IconBase>
  );
}

export function IconPlus(props) {
  return (
    <IconBase {...props}>
      <path d="M12 5.5v13M5.5 12h13" />
    </IconBase>
  );
}

export function IconInstagram(props) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="1.1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function IconTiktok(props) {
  return (
    <IconBase {...props}>
      <path d="M10 4.5V15a3.75 3.75 0 1 0 3.75-3.75" />
      <path d="M10 8a5.25 5.25 0 0 0 5.5 1.5V6.8A3.4 3.4 0 0 1 12 5" />
    </IconBase>
  );
}

export function IconWhatsapp(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8l-1.2 4.2 4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" />
      <path d="M9.2 8.6c.4 2.7 3 5.3 5.7 5.7l.9-1.3 1.9 1c-.3 1.3-1.1 1.9-2.3 1.6-3.3-.8-6.6-4.1-7.4-7.4-.3-1.2.3-2 1.6-2.3l1 1.9Z" />
    </IconBase>
  );
}
