import type { Block } from "../data/articles";
import { getImageSize } from "../lib/imageSize";
import BookButton from "./BookButton";
import { Accordion, Reveal, Zoomable } from "./ArticleWidgets";

// renders the article body from a list of blocks (later: produced from Markdown by the admin panel)
export default function ArticleBlocks({ blocks, title }: { blocks: readonly Block[]; title: string }) {
  return (
    <div className="a-body">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "intro":
            return <p key={key} className="a-intro">{block.text}</p>;
          case "h2":
            return (
              <Reveal key={key}>
                <h2 id={block.id} className="a-h2">{block.text}</h2>
              </Reveal>
            );
          case "h3":
            return <h3 key={key} className="a-h3">{block.text}</h3>;
          case "p":
            return <p key={key} className="a-p">{block.text}</p>;
          case "list":
            return (
              <ul key={key} className="a-list">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <Reveal key={key}>
                <blockquote className="a-quote">
                  <p>{block.text}</p>
                  <cite>{block.cite}</cite>
                </blockquote>
              </Reveal>
            );
          case "callout":
            return (
              <Reveal key={key}>
                <aside className="a-callout">
                  <strong>{block.title}</strong>
                  <p>{block.text}</p>
                </aside>
              </Reveal>
            );
          case "image": {
            const size = getImageSize(block.src);
            return (
              <Reveal key={key}>
                <Zoomable src={block.src} alt={block.alt} caption={block.caption} width={size?.width} height={size?.height} />
              </Reveal>
            );
          }
          case "accordion":
            return <Reveal key={key}><Accordion title={block.title} items={block.items} /></Reveal>;
          case "checklist":
            return (
              <Reveal key={key}>
                <div className="a-checklist">
                  <h3 className="a-block-title">{block.title}</h3>
                  <ul>
                    {block.items.map((item) => {
                      const [lead, ...rest] = item.split(" — ");
                      return (
                        <li key={item}>
                          {rest.length ? (
                            <>
                              <strong>{lead}</strong>
                              <span>{rest.join(" — ")}</span>
                            </>
                          ) : (
                            lead
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            );
          case "cta":
            return (
              <Reveal key={key}>
                <section className="a-cta" aria-label={block.title}>
                  <h3>{block.title}</h3>
                  <p>{block.text}</p>
                  <div className="a-cta-actions">
                    <BookButton
                      className="btn-primary a-cta-btn"
                      offer={{ title: "Оставить заявку", meta: `Статья: ${title}`, submitLabel: "Оставить заявку", source: `article: ${title}` }}
                    >
                      {block.primary}
                    </BookButton>
                    <a className="a-cta-ghost" href="tel:+78432177777">+7 (843) 217-77-77</a>
                  </div>
                </section>
              </Reveal>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
