import { MessageCircle, Phone } from "lucide-react";
import { wedding } from "@/config/wedding";
import { telHref, whatsappUrl } from "@/lib/contact";
import { cn } from "@/lib/utils";

/** "For any queries · +91 …" with Call and WhatsApp links. */
export function ContactLinks({ className, tone = "ink" }: { className?: string; tone?: "ink" | "night" }) {
  const { contact } = wedding;
  const ink = tone === "ink";
  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <p className={cn("font-cinzel text-[0.68rem] font-bold tracking-[0.32em] uppercase", ink ? "text-ink-soft" : "text-gold")}>{contact.label}</p>
      <a href={telHref} className={cn("whitespace-nowrap font-cinzel text-lg font-semibold tracking-[0.08em] hover:underline", ink ? "text-ink" : "text-parchment")}>
        {contact.phone}
      </a>
      <div className="mt-1 flex flex-wrap justify-center gap-2.5">
        <a href={telHref} className={cn(ink ? "btn-ink sketch" : "btn-ghost", "!min-h-10 !px-4 !py-2 !text-[0.64rem]")}>
          <Phone className="h-4 w-4" aria-hidden /> Call
        </a>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={cn(ink ? "btn-ink sketch" : "btn-ghost", "!min-h-10 !px-4 !py-2 !text-[0.64rem]")}>
          <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
