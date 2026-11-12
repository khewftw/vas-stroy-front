"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { openBooking } from "../lib/booking";
import { CONTACT_LINKS, MOBILE_NAV, PAGE_NAV } from "./nav";

// TODO: point the other three directions to their own pages when they exist
const DIRECTIONS = [
  { href: "/", label: "Коммерческие и государственные объекты", active: true },
  { href: "#", label: "Ремонт квартир", active: false },
  { href: "#", label: "Ремонт домов", active: false },
  { href: "#", label: "Строительство зданий", active: false },
] as const;

const PHONE = CONTACT_LINKS[0];

// legal pages bring their own masthead
const OWN_HEADER = ["/privacy", "/offer", "/consent"];

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);


  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 1000) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  if (OWN_HEADER.some((path) => pathname.startsWith(path))) return null;
  const narrow = pathname.startsWith("/cases/") || pathname.startsWith("/news/");

  return (
    <header data-narrow={narrow ? "" : undefined} className={`site-header${scrolled ? " is-scrolled" : ""}${scrolled || menuOpen ? " is-solid" : ""}`}>
      <div className="site-header-inner shell">
        <Link className="site-logo" href="/" aria-label="ВАС СТРОЙ / Главная">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/vectors/vas-stroy${scrolled || menuOpen ? "" : "-light"}.svg`} alt="" />
        </Link>

        <div className="site-header-top">
          <nav className="site-directions" aria-label="Направления">
            {DIRECTIONS.map((item) => (
              <a key={item.label} href={item.href} className={item.active ? "is-active" : ""} aria-current={item.active ? "page" : undefined}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="site-header-meta">
            <a className="site-phone" href={PHONE.href}>+7 (843) 217-77-77</a>
          </div>
        </div>

        <div className="site-header-bottom">
          <nav className="site-nav" aria-label="Навигация по сайту">
            {PAGE_NAV.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </nav>
          <button className="btn-primary site-cta" type="button" onClick={() => openBooking("quote")}>
            Запросить КП
          </button>
        </div>

        <button className="site-burger" type="button" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <span />
          <span />
        </button>
      </div>

      <div className="site-menu" hidden={!menuOpen} onClick={() => setMenuOpen(false)} data-lenis-prevent>
        <div className="site-menu-inner" data-lenis-prevent onClick={(event) => event.stopPropagation()}>
          <p className="site-menu-label">Направления</p>
          <nav aria-label="Направления">
            {DIRECTIONS.map((item) => (
              <a key={item.label} href={item.href} className={item.active ? "is-active" : ""} onClick={() => setMenuOpen(false)}>{item.label}</a>
            ))}
          </nav>
          <p className="site-menu-label">Разделы</p>
          <nav aria-label="Разделы">
            {MOBILE_NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
            ))}
          </nav>
          <a className="site-menu-phone" href={PHONE.href}>+7 (843) 217-77-77</a>
          <button className="btn-primary" type="button" onClick={() => { setMenuOpen(false); openBooking("quote"); }}>
            Получить коммерческое предложение
          </button>
        </div>
      </div>
    </header>
  );
}
