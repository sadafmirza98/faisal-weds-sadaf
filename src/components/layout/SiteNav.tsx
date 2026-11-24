"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { WaxSeal } from "@/components/magical/WaxSeal";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn, scrollToId } from "@/lib/utils";

const ids = wedding.nav.map((n) => n.id);

export function SiteNav() {
  const { opened } = useExperience();
  const reduced = useReducedMotion();
  const active = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Let the menu close before scrolling so the page is unlocked.
    window.setTimeout(() => scrollToId(id, !!reduced), open ? 60 : 0);
  };

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-500",
        scrolled ? "bg-midnight/75 shadow-[0_1px_0_rgb(197_164_106/0.25)] backdrop-blur-md" : "bg-transparent",
      )}
      initial={{ y: -80, opacity: 0 }}
      animate={opened ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
      transition={{ duration: 0.9, delay: opened ? 0.6 : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* The seal takes you back to the top (it used to reopen the letter, which hid the whole site). */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
          className="flex items-center gap-2.5"
          aria-label="Back to the top"
        >
          <WaxSeal size={34} />
          <span className="hidden font-cinzel text-sm tracking-[0.25em] text-gold-light sm:inline">
            {wedding.couple.monogram[0]} <span className="font-script text-lg tracking-normal text-candle">&amp;</span> {wedding.couple.monogram[1]}
          </span>
        </button>
        <ul className="hidden items-center gap-1 lg:flex">
          {wedding.nav.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                onClick={go(n.id)}
                aria-current={active === n.id ? "true" : undefined}
                className={cn(
                  "relative px-3 py-2 font-cinzel text-[0.7rem] font-semibold tracking-[0.2em] uppercase transition-colors",
                  active === n.id ? "text-gold-light" : "text-parchment/70 hover:text-parchment",
                )}
              >
                {n.label}
                {active === n.id && (
                  <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-px bg-gold-light shadow-[0_0_8px_#e8c98b]" />
                )}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <button
            ref={menuButton}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold-light lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="parchment-dark fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto lg:hidden"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          >
            <ul className="flex flex-col items-center gap-2 px-6 py-10">
              {wedding.nav.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.05 } }}>
                  <a
                    ref={i === 0 ? firstLink : undefined}
                    href={`#${n.id}`}
                    onClick={go(n.id)}
                    aria-current={active === n.id ? "true" : undefined}
                    className={cn(
                      "block px-6 py-3 text-center font-cinzel text-lg tracking-[0.22em] uppercase",
                      active === n.id ? "text-gold-light" : "text-parchment/85",
                    )}
                  >
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="px-6 pb-10 text-center font-fell text-parchment/60 italic">“{wedding.hero.tagline}”</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
