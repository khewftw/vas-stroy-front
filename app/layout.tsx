import type { Metadata } from "next";
import localFont from "next/font/local";
import CustomCursor from "./components/ui/CustomCursor";
import BookingModal from "./components/BookingModal";
import CircleVideo from "./components/CircleVideo";
import FloatingCta from "./components/FloatingCta";
import ScrollReset from "./components/ScrollReset";
import SiteHeader from "./components/SiteHeader";
import "./globals.css";

const basisGrotesque = localFont({
  src: [
    { path: "../fonts/BasisGrotesquePro-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/BasisGrotesquePro-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/BasisGrotesquePro-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/BasisGrotesquePro-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-basis",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["Helvetica Neue", "Helvetica", "Arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "ВАС СТРОЙ — строительство коммерческих и государственных объектов",
  description: "Генеральный подряд для бизнеса и госзаказчиков: монолит, фасады, инженерные сети, отделка. Работаем по 44-ФЗ и 223-ФЗ.",
  openGraph: {
    title: "ВАС СТРОЙ",
    description: "Генеральный подряд для бизнеса и госзаказчиков. Получите коммерческое предложение.",
    images: ["/new/images/hero.jpg"],
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${basisGrotesque.variable} ${basisGrotesque.className} antialiased`}>
      <body>
        <a className="skip-link" href="#main">Перейти к содержанию</a>
        <ScrollReset />
        <SiteHeader />
        {children}
        <BookingModal />
        <FloatingCta />
        <CircleVideo />
        <CustomCursor />
      </body>
    </html>
  );
}
