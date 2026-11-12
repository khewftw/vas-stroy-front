// TODO: replace placeholder stories (texts, figures, photos) with real company content.
// Figures for the first two stories come from app/data/cases.ts; the rest are placeholders.
export type Story = {
  id: string;
  title: string;
  tag: string;
  src: string;
  text: string;
  facts: readonly string[];
};

export const STORIES: readonly Story[] = [
  {
    id: "sunlight",
    title: "Sunlight: торговый зал за 2 месяца",
    tag: "Объект",
    src: "/objects/sunlight/cover.png",
    text: "Отделали торговый зал сети Sunlight. Работали по графику заказчика и сдали точку к открытию.",
    facts: ["350 м²", "2 месяца"],
  },
  {
    id: "zilant",
    title: "Зилант: зал единоборств под ключ",
    tag: "Объект",
    src: "/objects/zilant/cover.png",
    text: "Сделали спортивный зал сети Зилант: от отделки до инженерных систем, с учётом требований к покрытиям и вентиляции.",
    facts: ["3 000 м²", "3 месяца"],
  },
  {
    id: "585",
    title: "585 Золотой: отделка без остановки торговли",
    tag: "Объект",
    src: "/objects/585/XXXL.webp",
    text: "Обновили розничную точку, не останавливая работу магазина: работы вели поэтапно и в удобное для заказчика время.",
    facts: ["320 м²", "2 месяца"],
  },
  {
    id: "nashe-zoloto",
    title: "Наше золото: как мы уложились в график",
    tag: "Кейс",
    src: "/objects/nashe-zoloto/nz.webp",
    text: "Рассказываем, как построили график работ на торговой точке и ни разу не сдвинули дату открытия.",
    facts: ["280 м²", "2 месяца"],
  },
  {
    id: "process",
    title: "Как мы ведём объект: от сметы до сдачи",
    tag: "Процесс",
    src: "/new/images/cases/case-2/02-modern_apartment_living_room_int.jpg",
    text: "Показываем, из каких этапов состоит работа: обследование, смета, закупка, производство работ и сдача.",
    facts: [],
  },
  {
    id: "warranty",
    title: "Что входит в гарантию на объект",
    tag: "Гарантия",
    src: "/new/images/cases/case-1/06-modern_hallway_with_orange_walls.jpg",
    text: "Объясняем, как устроена гарантийная ответственность подрядчика и что стоит зафиксировать в договоре.",
    facts: [],
  },
  {
    id: "questions",
    title: "Пять вопросов, которые стоит задать подрядчику",
    tag: "Советы",
    src: "/new/images/quiz/2.jpg",
    text: "Короткий чек-лист для заказчика: что спросить до подписания договора, чтобы не получить сюрпризов по срокам и цене.",
    facts: [],
  },
  {
    id: "state",
    title: "Госконтракты: как мы работаем по 44-ФЗ",
    tag: "Госзаказ",
    src: "/new/images/quiz/4.jpg",
    text: "Рассказываем, как строим работу с государственными заказчиками: допуски, обеспечение контракта и приёмка.",
    facts: [],
  },
];
