import BentoGrid from "./BentoGrid";
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  ArrowAngularTopRightOutlined,
  CertificateBadge1Outlined,
  Crane4Outlined,
  StampOutlined,
  Shield2CheckOutlined,
} from "@lineiconshq/free-icons";

// TODO: replace placeholder figures, texts and photos with real company data
const STATS = [
  {
    value: "15",
    unit: "лет",
    label: "на рынке строительства",
    text: "Строим коммерческие и государственные объекты: от первых складов до крупных социальных комплексов. Опыт, который снижает риски заказчика.",
    span: "c-4",
  },
  {
    value: "120+",
    unit: "",
    label: "сданных объектов",
    text: "Школы, спортивные комплексы, бизнес-центры, логистические и жилые комплексы. Каждый объект сдаём с полной исполнительной документацией.",
    span: "c-4",
  },
  {
    value: "450 000",
    unit: "м²",
    label: "построено и отделано",
    text: "Общая площадь объектов компании. Берём проекты от 2 000 до 30 000 м² и ведём их от земляных работ до ввода в эксплуатацию.",
    span: "c-4",
  },
  {
    value: "300+",
    unit: "",
    label: "специалистов в штате",
    text: "Инженеры, прорабы, монтажники и собственные бригады. Не передаём ключевые работы случайным субподрядчикам.",
    span: "c-4",
  },
] as const;

const DOCS = [
  { icon: CertificateBadge1Outlined, text: "Членство в СРО на строительство" },
  { icon: Shield2CheckOutlined, text: "Допуски к работам на объектах капитального строительства" },
  { icon: StampOutlined, text: "Опыт исполнения контрактов по 44-ФЗ и 223-ФЗ" },
  { icon: Crane4Outlined, text: "Собственная техника и бригады" },
] as const;

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="shell">
        <div className="section-head" data-reveal data-reveal-stagger>
          <h2 id="about-title">О компании</h2>
          <p className="section-lead">
            ВАС СТРОЙ — генеральный подрядчик для бизнеса и государства. Берём объект целиком: от земляных работ до сдачи в эксплуатацию, с единой ответственностью за сроки, качество и бюджет.
          </p>
        </div>

        <BentoGrid className="bento" data-reveal data-reveal-stagger>
          {STATS.map((item) => (
            <article key={item.label} className={`bento-card bento-stat ${item.span}`} tabIndex={0}>
              <div className="bento-body">
                <p className="bento-num">
                  {item.value}
                  {item.unit ? <small>{item.unit}</small> : null}
                </p>
                <h3 className="bento-label">{item.label}</h3>
                <div className="bento-more">
                  <p>{item.text}</p>
                </div>
              </div>
            </article>
          ))}

          <article className="bento-card bento-docs c-8">
            <h3 className="bento-docs-title">Допуски и опыт</h3>
            <ul className="bento-list">
              {DOCS.map(({ icon, text }) => (
                <li key={text}>
                  <Lineicons icon={icon} size={28} strokeWidth={1.5} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <span className="bento-arrow" aria-hidden="true">
              <Lineicons icon={ArrowAngularTopRightOutlined} size="100%" strokeWidth={1.2} />
              <Lineicons icon={ArrowAngularTopRightOutlined} size="100%" strokeWidth={1.2} />
            </span>
          </article>
        </BentoGrid>
      </div>
    </section>
  );
}
