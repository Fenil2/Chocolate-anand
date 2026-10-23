import Image from "next/image";
import { cn } from "@/lib/format";

/** The supplied MORA wordmark (extracted from the brand artwork, not redrawn). Ratio ≈ 4.48 : 1 */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/images/mora/mora-wordmark.png"
      alt="MORA"
      width={986}
      height={220}
      priority={priority}
      className={cn("h-auto w-full select-none", className)}
    />
  );
}
