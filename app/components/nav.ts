export const PAGE_NAV = [
  { href: "#about", label: "О компании" },
  { href: "#services", label: "Услуги" },
  { href: "#cases", label: "Объекты" },
  { href: "#news", label: "Новости" },
] as const;

export const MOBILE_NAV = [
  ...PAGE_NAV,
  { href: "#contacts", label: "Контакты" },
] as const;

export const FOOTER_NAV = PAGE_NAV;

// TODO: replace placeholder Telegram / MAX links with the real company accounts
export const CONTACT_LINKS = [
  { id: "call", label: "Позвонить", href: "tel:+78432177777", icon: null },
  { id: "telegram", label: "Telegram", href: "https://t.me/vasstroy", icon: "/new/telegram-svgrepo-com.svg" },
  { id: "max", label: "MAX", href: "https://max.ru/vasstroy", icon: "/new/Max_logo_black.svg" },
] as const;
