import Link from "next/link";
import { FOOTER_NAV } from "./nav";

// TODO: replace placeholder requisites, address, email and working hours with real company data
const REQUISITES = {
  entity: "ООО «ВАС СТРОЙ»",
  inn: "ИНН 1657777777 · КПП 165701001",
  ogrn: "ОГРН 1161697777777",
  address: "420111, г. Казань, ул. Кремлёвская, д. 7, оф. 17",
  phone: "+7 (843) 217-77-77",
  phoneHref: "tel:+78432177777",
  email: "info@vasstroy.ru",
  hours: "Пн–Пт с 9:00 до 18:00",
} as const;

const DOCS = [
  { href: "/privacy", label: "Политика конфиденциальности" },
  { href: "/consent", label: "Согласие на обработку персональных данных" },
  { href: "/offer", label: "Публичная оферта" },
] as const;

export default function SiteFooter({ reveal = true, narrow = false }: { reveal?: boolean; narrow?: boolean }) {
  const motion = reveal ? { "data-reveal": true } : {};
  return (
    <footer className={`footer${narrow ? " footer-narrow" : ""}`}>
      <div className="shell">
        <div className="footer-grid" {...motion} {...(reveal ? { "data-reveal-stagger": true } : {})}>
          <div className="footer-brand">
            <a className="footer-logo" href="#main" aria-label="ВАС СТРОЙ / Главная">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="footer-logo-mark" src="/vectors/vas-stroy-light.svg" alt="" />
            </a>
            <div className="footer-legal">
              <p className="footer-entity">{REQUISITES.entity}</p>
              <p>{REQUISITES.inn}</p>
              <p>{REQUISITES.ogrn}</p>
            </div>
          </div>

          <div className="footer-col">
            <p className="footer-label">Разделы</p>
            <nav className="footer-nav" aria-label="Навигация по странице">
              {FOOTER_NAV.map((item) => (
                <a key={item.href} href={item.href}>{item.label}</a>
              ))}
            </nav>
          </div>

          <div className="footer-col">
            <p className="footer-label">Документы</p>
            <nav className="footer-nav footer-nav-docs" aria-label="Документы">
              {DOCS.map((item) => (
                <Link key={item.href} href={item.href}>{item.label}</Link>
              ))}
            </nav>
          </div>

          <div className="footer-col">
            <p className="footer-label">Контакты</p>
            <div className="footer-secondary">
              <a className="footer-contact-phone" href={REQUISITES.phoneHref}>{REQUISITES.phone}</a>
              <a href={`mailto:${REQUISITES.email}`}>{REQUISITES.email}</a>
              <p>{REQUISITES.address}</p>
              <p>{REQUISITES.hours}</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom" {...motion}>
          <p>© {new Date().getFullYear()} ВАС СТРОЙ. Все права защищены.</p>
          <p className="footer-152">
            Обработка персональных данных осуществляется в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
          </p>
        </div>
      </div>
    </footer>
  );
}
