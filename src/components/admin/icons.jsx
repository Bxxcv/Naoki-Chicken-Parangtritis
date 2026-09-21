function IconBase({ children, size = 18, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
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

export const IconDashboard = (p) => (
  <IconBase {...p}><rect x="3.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" /></IconBase>
);
export const IconOrders = (p) => (
  <IconBase {...p}><rect x="5" y="4" width="14" height="17" rx="2.2" /><path d="M9 3.2h6v2.6H9z" /><path d="M9 11h6M9 15h4" /></IconBase>
);
export const IconPos = (p) => (
  <IconBase {...p}><rect x="3.5" y="8.5" width="17" height="12" rx="2" /><path d="M7 8.5V5.4A1.4 1.4 0 0 1 8.4 4h7.2A1.4 1.4 0 0 1 17 5.4v3.1" /><path d="M7.5 13h4M7.5 16.5h9" /></IconBase>
);
export const IconKitchen = (p) => (
  <IconBase {...p}><path d="M7 14a3.6 3.6 0 0 1-1-7 3.4 3.4 0 0 1 6-1.6A3.4 3.4 0 0 1 18 7a3.6 3.6 0 0 1-1 7Z" /><path d="M7 14v4.6A1.4 1.4 0 0 0 8.4 20h7.2a1.4 1.4 0 0 0 1.4-1.4V14" /></IconBase>
);
export const IconProducts = (p) => (
  <IconBase {...p}><path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2Z" /><path d="m4 7.2 8 4.3 8-4.3M12 11.5V21" /></IconBase>
);
export const IconStock = (p) => (
  <IconBase {...p}><circle cx="7" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><circle cx="12" cy="16.5" r="3" /><path d="M9.6 8.6 10.7 14M14.4 8.6 13.3 14" /></IconBase>
);
export const IconCustomers = (p) => (
  <IconBase {...p}><circle cx="9.5" cy="8" r="3.4" /><path d="M3.5 20a6 6 0 0 1 12 0" /><path d="M16.2 5.2a3.2 3.2 0 0 1 0 5.8M17.5 20a5.6 5.6 0 0 0-2-4.3" /></IconBase>
);
export const IconExpenses = (p) => (
  <IconBase {...p}><path d="M6 3.5h12v17l-2.5-1.6-2.5 1.6-2.5-1.6L8 20.5 6 20.5Z" /><path d="M9.5 8.5h5M9.5 12.5h5" /></IconBase>
);
export const IconPayments = (p) => (
  <IconBase {...p}><rect x="3" y="5.5" width="18" height="13" rx="2.2" /><path d="M3 10h18M6.5 14.5h3" /></IconBase>
);
export const IconReports = (p) => (
  <IconBase {...p}><path d="M4 20.5V4M4 20.5h16" /><rect x="7" y="12" width="3" height="6" rx="1" /><rect x="12.5" y="8" width="3" height="10" rx="1" /><rect x="18" y="14" width="2.6" height="4" rx="1" /></IconBase>
);
export const IconAnalytics = (p) => (
  <IconBase {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v10M14.3 9.2c-.6-.7-1.4-1-2.3-1-1.4 0-2.4.8-2.4 1.9 0 2.6 4.8 1.4 4.8 4 0 1.1-1 1.9-2.4 1.9-1 0-1.8-.3-2.4-1" /></IconBase>
);
export const IconStaff = (p) => (
  <IconBase {...p}><circle cx="10" cy="8" r="3.4" /><path d="M4 20a6 6 0 0 1 12 0" /><path d="m16.5 12.2 1.7 1.7 3.3-3.4" /></IconBase>
);
export const IconSettings = (p) => (
  <IconBase {...p}><circle cx="12" cy="12" r="3" /><path d="M19.2 14.2a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-2.6 1.1v.2a1.8 1.8 0 0 1-3.6 0v-.1a1.5 1.5 0 0 0-2.7-1.1l-.1.1a1.8 1.8 0 1 1-2.6-2.6l.1-.1a1.5 1.5 0 0 0-1.1-2.6h-.2a1.8 1.8 0 0 1 0-3.6h.1a1.5 1.5 0 0 0 1.1-2.7l-.1-.1a1.8 1.8 0 1 1 2.6-2.6l.1.1a1.5 1.5 0 0 0 2.6-1.1v-.2a1.8 1.8 0 0 1 3.6 0v.1a1.5 1.5 0 0 0 2.7 1.1l.1-.1a1.8 1.8 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0 1.1 2.6h.2a1.8 1.8 0 0 1 0 3.6h-.1a1.5 1.5 0 0 0-1.4.9Z" /></IconBase>
);

export const IconPlus = (p) => (<IconBase {...p}><path d="M12 5.5v13M5.5 12h13" /></IconBase>);
export const IconDownload = (p) => (<IconBase {...p}><path d="M12 4v10M8 10.5l4 3.9 4-3.9M4.5 19.5h15" /></IconBase>);
export const IconCalendar = (p) => (<IconBase {...p}><rect x="3.5" y="5.5" width="17" height="15" rx="2.2" /><path d="M3.5 10h17M8 3.5v4M16 3.5v4" /></IconBase>);
export const IconSearch = (p) => (<IconBase {...p}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></IconBase>);
export const IconFilter = (p) => (<IconBase {...p}><path d="M3.5 5.5h17l-6.5 7.6V20l-4-2.2v-5.2Z" /></IconBase>);
export const IconChevronRight = (p) => (<IconBase {...p}><path d="m9.5 6 6 6-6 6" /></IconBase>);
export const IconChevronDown = (p) => (<IconBase {...p}><path d="m6 9.5 6 6 6-6" /></IconBase>);
export const IconTrend = (p) => (<IconBase {...p}><path d="M3.5 17 9 11l4 3.6 7.5-7.6" /><path d="M15.5 7h5v5" /></IconBase>);
export const IconBox = (p) => (<IconBase {...p}><path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2Z" /><path d="m4 7.2 8 4.3 8-4.3M12 11.5V21" /></IconBase>);
export const IconBulb = (p) => (<IconBase {...p}><path d="M9 17.5h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.4 10.9c.5.4.9 1 .9 1.6h5c0-.7.4-1.2.9-1.6A6 6 0 0 0 12 3Z" /></IconBase>);
export const IconMenuBars = (p) => (<IconBase {...p}><path d="M4 7h16M4 12h16M4 17h16" /></IconBase>);
export const IconClose = (p) => (<IconBase {...p}><path d="M6 6l12 12M18 6 6 18" /></IconBase>);
export const IconStore = (p) => (<IconBase {...p}><path d="M4 10 5.2 4h13.6L20 10" /><path d="M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9" /><path d="M4 10a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" /></IconBase>);
