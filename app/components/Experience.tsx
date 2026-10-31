"use client";

import { useEffect } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SPLIT_SELECTOR = "main h2, .promotion-copy h3, .services-tariff-main h3";

function splitIntoChars(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "done") return [...el.querySelectorAll<HTMLElement>("span[aria-hidden='true'] > span")];
  el.dataset.split = "done";
  el.setAttribute("aria-label", (el.textContent ?? "").replace(/\s+/g, " ").trim());

  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.nodeValue?.trim()) textNodes.push(node);
  }

  const chars: HTMLElement[] = [];
  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    (node.nodeValue ?? "").split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.append(" ");
        return;
      }
      const word = document.createElement("span");
      word.setAttribute("aria-hidden", "true");
      word.style.cssText = "display:inline-block;white-space:nowrap";
      [...part].forEach((letter) => {
        const ch = document.createElement("span");
        ch.textContent = letter;
        ch.style.display = "inline-block";
        word.append(ch);
        chars.push(ch);
      });
      fragment.append(word);
    });
    node.replaceWith(fragment);
  });
  return chars;
}

export default function Experience() {
  useEffect(() => {
    const revealNodes = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let lenisTick: ((time: number) => void) | null = null;
    let bodyObserver: MutationObserver | null = null;
    if (!reduce) {
      lenis = new Lenis({
        lerp: 0.085,
        wheelMultiplier: 0.9,
        smoothWheel: true,
        syncTouch: true,
        syncTouchLerp: 0.1,
        anchors: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const instance = lenis;
      lenisTick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(lenisTick);
      gsap.ticker.lagSmoothing(0);

      // pause smooth scroll while a modal / menu locks the page
      const locked = () => ["menu-open", "booking-open", "reel-open"].some((name) => document.body.classList.contains(name));
      bodyObserver = new MutationObserver(() => (locked() ? instance.stop() : instance.start()));
      bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    }

    // headings / card titles are written out letter by letter, left to right
    const splitNodes = reduce ? [] : [...document.querySelectorAll<HTMLElement>(SPLIT_SELECTOR)];
    const charGroups = splitNodes.map((el) => ({ el, chars: splitIntoChars(el) }));

    if (reduce) {
      gsap.set(revealNodes, { opacity: 1, y: 0, clearProps: "transform" });
    } else {
      charGroups.forEach(({ el, chars }) => {
        if (!chars.length) return;
        gsap.set(chars, { opacity: 0, yPercent: 55 });
        gsap.to(chars, {
          opacity: 1,
          yPercent: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: Math.min(0.035, 0.9 / chars.length),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onComplete: () => gsap.set(chars, { clearProps: "all" }),
        });
      });

      revealNodes.forEach((node) => {
        const mode = node.getAttribute("data-reveal") || "up";
        const itemsSelector = node.getAttribute("data-reveal-items");
        const stagger = node.hasAttribute("data-reveal-stagger");
        const kids = (itemsSelector
          ? [...node.querySelectorAll<HTMLElement>(itemsSelector)]
          : stagger ? [...node.children] as HTMLElement[] : [])
          .filter((kid) => !kid.matches(SPLIT_SELECTOR));

        if (kids.length > 1 || itemsSelector) {
          const from = mode === "wave"
            ? { opacity: 0, y: 140, scale: 0.94 }
            : mode === "left"
              ? { opacity: 0, x: -90 }
              : { opacity: 0, y: 28 };
          gsap.set(node, { opacity: 1 });
          gsap.set(kids, from);
          gsap.to(kids, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: mode === "wave" ? 1 : 0.9,
            ease: mode === "up" ? "power2.out" : "power3.out",
            stagger: mode === "wave" ? 0.11 : mode === "left" ? 0.14 : 0.08,
            scrollTrigger: { trigger: node, start: mode === "up" ? "top 88%" : "top 85%", once: true },
            onComplete: () => gsap.set(kids, { clearProps: "opacity,transform" }),
          });
        } else {
          gsap.fromTo(
            node,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: { trigger: node, start: "top 88%", once: true },
            },
          );
        }
      });
    }

    const parallaxNodes = document.querySelectorAll<HTMLElement>("[data-parallax]");
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        parallaxNodes.forEach((node) => {
          const rect = node.getBoundingClientRect();
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          node.style.setProperty("--parallax", `${(progress - 0.5) * 28}px`);
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      bodyObserver?.disconnect();
      if (lenisTick) gsap.ticker.remove(lenisTick);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
