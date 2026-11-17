"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MagicDialogProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
  /** Visual style of the panel. */
  variant?: "parchment" | "night" | "bare";
}

/**
 * Accessible modal on the native <dialog> element: top layer, focus trap,
 * Escape to close, inert background and focus return come from the browser.
 */
export function MagicDialog({ open, onClose, label, children, className, variant = "parchment" }: MagicDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes.
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto max-h-[92svh] w-[min(92vw,34rem)] overflow-visible bg-transparent p-0 text-inherit backdrop:bg-[#05070c]/80 backdrop:backdrop-blur-sm open:animate-none",
        className,
      )}
    >
      {open && (
        <div
          className={cn(
            "relative max-h-[92svh] overflow-y-auto",
            variant === "parchment" && "parchment deckle px-8 py-12 sm:px-12",
            variant === "night" && "parchment-dark rounded-[3px] border border-gold/40 px-6 py-10 sm:px-10",
          )}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              "absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full transition",
              variant === "parchment" ? "text-ink hover:bg-ink/10" : "text-gold-light hover:bg-gold/15",
            )}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
