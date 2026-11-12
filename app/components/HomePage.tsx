import Image from "next/image";
import About from "./About";
import BookButton from "./BookButton";
import Cases from "./Cases";
import Experience from "./Experience";
import FooterReveal from "./FooterReveal";
import News from "./News";
import Services from "./Services";
import HeroParallax from "./HeroParallax";
import Stories from "./Stories";
import SiteFooter from "./SiteFooter";

// TODO: confirm client names; logos live in public/vectors
const CLIENTS = [
  { src: "/vectors/585-full.svg", alt: "585", shape: "wide" },
  { src: "/vectors/gerb%20rt.svg", alt: "Герб Республики Татарстан", shape: "round" },
  { src: "/vectors/minzemimush.svg", alt: "Министерство земельных и имущественных отношений", shape: "square" },
  // sunlight-knockout.svg: same logo with the red fill turned white and the white glyph cut out
  { src: "/vectors/sunlight-knockout.svg", alt: "Sunlight", shape: "wide" },
  { src: "/vectors/nashe-zololot.svg", alt: "Наше золото", shape: "wide" },
] as const;

// each logo twice so one set is wider than the screen; the whole set is repeated for a seamless loop
const MARQUEE = [...CLIENTS, ...CLIENTS];

export default function HomePage() {
  return (
    <>
      <Experience />
      <HeroParallax />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <Image className="hero-image" src="/objects/sunlight/cover.png" alt="" fill sizes="100vw" priority />
          <div className="hero-shade" />
          <div className="hero-center">
            <h1 id="hero-title">Строим коммерческие и государственные объекты</h1>
            <p className="hero-sub">Генподряд, монолит, фасады и инженерные сети. Работаем с бизнесом и госзаказчиками по 44-ФЗ и 223-ФЗ.</p>
            <div className="hero-actions">
              <BookButton className="hero-book" offer="quote">
                <span>Получить коммерческое предложение</span>
              </BookButton>
              <a className="hero-ghost" href="#cases">Наши объекты</a>
            </div>
          </div>
          <div className="hero-clients">
            <p>Нам доверяют</p>
            <div className="clients-marquee">
              <ul className="clients-track">
                {[0, 1].map((copy) =>
                  MARQUEE.map((logo, i) => (
                    <li key={`${copy}-${i}`} className={`is-${logo.shape}`} aria-hidden={copy === 1 ? true : undefined}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logo.src} alt={copy === 1 ? "" : logo.alt} />
                    </li>
                  )),
                )}
              </ul>
            </div>
          </div>
        </section>

        <Stories />
        <About />
        <Services />
        <Cases />
        <News />
        <div id="contacts" aria-hidden="true" />
      </main>
      <SiteFooter />
      <FooterReveal />
    </>
  );
}
