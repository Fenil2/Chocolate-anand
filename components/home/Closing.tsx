import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { MeltEdge } from "./MeltEdge";

export function Closing() {
  return (
    <section aria-labelledby="closing-title" className="relative">
      <div className="grain relative bg-[linear-gradient(to_bottom,#1a0d09_0%,#2c140c_45%,#4a2516_100%)] px-4 pb-10 pt-20 text-center sm:px-8 sm:pt-28 lg:pt-40">
        <Reveal>
          <RevealItem>
            <h2 id="closing-title" className="display text-[clamp(3.4rem,10vw,9rem)]">
              One Last Square?
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mx-auto mt-5 max-w-sm text-beige">Go on. Nobody’s counting.</p>
          </RevealItem>
          <RevealItem>
            <LinkButton href="#flavour" className="mt-9">
              Find Your Favourite
            </LinkButton>
          </RevealItem>
        </Reveal>
      </div>
      {/* The section itself pours into the footer */}
      <MeltEdge className="relative z-10 -mt-px bg-obsidian" />
    </section>
  );
}
