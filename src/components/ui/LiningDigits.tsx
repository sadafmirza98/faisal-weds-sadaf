/**
 * Renders a line with its numbers in Cinzel. The address font (IM Fell) uses
 * old-style figures, whose "1" reads like a dotless "ı" ("ıst Floor").
 */
export function LiningDigits({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d+)/).map((part, i) =>
        /^\d+$/.test(part) ? (
          <span key={i} className="font-cinzel text-[0.9em] font-semibold">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
