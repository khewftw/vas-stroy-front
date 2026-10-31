import type { Metadata } from "next";
import HomePage from "../components/HomePage";

// duplicate of the home page in another colour scheme: keep it out of search results
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function BrownHome() {
  return <HomePage theme="brown" />;
}
