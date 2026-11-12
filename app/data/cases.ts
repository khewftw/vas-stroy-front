// TODO: confirm the figures marked below. Photos live in public/objects/<project>/.
// Cases with a non-empty `gallery` get their own page; the rest are preview-only cards.
export type CaseItem = {
  slug: string;
  title: string;
  kind: string;
  customer: string;
  area: number | null;
  scope: string;
  term: string | null;
  year: number;
  image: string;
  gallery: readonly string[];
};

export const CASES: readonly CaseItem[] = [
  {
    slug: "zilant-sportivnyy-zal",
    title: "Зилант",
    kind: "Сеть спортивных залов",
    customer: "Зилант",
    area: 3000,
    scope: "Отделка и инженерные системы",
    term: "3 месяца",
    year: 2025,
    image: "/objects/zilant/cover.png",
    gallery: [],
  },
  {
    slug: "sunlight",
    title: "Sunlight",
    kind: "Розничная точка",
    customer: "Sunlight",
    area: 350,
    scope: "Отделка торгового зала",
    term: "2 месяца",
    year: 2025,
    image: "/objects/sunlight/cover.png",
    gallery: [],
  },
  {
    slug: "nashe-zoloto",
    title: "Наше золото",
    kind: "Розничная точка",
    customer: "Наше золото",
    area: 280, // TODO: confirm
    scope: "Отделка торгового зала",
    term: "2 месяца", // TODO: confirm
    year: 2025,
    image: "/objects/nashe-zoloto/nz.webp",
    gallery: [],
  },
  {
    slug: "585-zolotoy",
    title: "585 Золотой",
    kind: "Розничная точка",
    customer: "585 Золотой",
    area: 320, // TODO: confirm
    scope: "Отделка торгового зала",
    term: "2 месяца", // TODO: confirm
    year: 2025,
    image: "/objects/585/XXXL.webp",
    gallery: [],
  },
];

export const hasPage = (item: CaseItem) => item.gallery.length > 0;
export const caseBySlug = (slug: string) => CASES.find((item) => item.slug === slug);
