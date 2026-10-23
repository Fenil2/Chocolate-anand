"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { gifts } from "@/components/products/products";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { imageReveal } from "@/components/motion/variants";
import { formatINR } from "@/lib/format";

export function Gifting() {
  return (
    <section id="gifting" aria-labelledby="gift-title" className="relative bg-obsidian pb-20 pt-20 sm:pb-28 sm:pt-24 lg:pb-40 lg:pt-36">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
        <div className="relative">
          <motion.div
            className="relative aspect-[5/4] overflow-hidden sm:aspect-[27/10]"
            variants={imageReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <Image
              src="/images/mora/range-lineup.jpg"
              alt="The four MORA bars — Bold, Crush, Chill and Midnight — laid out side by side on dark stone"
              fill
              sizes="(min-width: 1440px) 1376px, 100vw"
              className="object-cover object-[50%_60%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent sm:bg-gradient-to-r sm:from-obsidian/90 sm:via-obsidian/30" />
          </motion.div>

          <Reveal className="relative pt-8 sm:absolute sm:inset-x-0 sm:bottom-auto sm:top-1/2 sm:max-w-md sm:-translate-y-1/2 sm:p-10 lg:p-16">
            <RevealItem>
              <h2 id="gift-title" className="display text-[clamp(2.1rem,9.4vw,2.9rem)] sm:text-[clamp(2.2rem,4.6vw,4rem)]">
                Make Their Day a Little Sweeter.
              </h2>
            </RevealItem>
            <RevealItem>
              <p className="mt-4 max-w-[30ch] text-beige">Boxed bars for birthdays, thank-yous and no reason at all.</p>
            </RevealItem>
            <RevealItem>
              <LinkButton href="#gift-sets" className="mt-7">
                Explore Gifting
              </LinkButton>
            </RevealItem>
          </Reveal>
        </div>

        <Reveal as="ul" className="mt-12 grid gap-8 sm:mt-16 sm:gap-10 md:grid-cols-2 md:gap-14" amount={0.2}>
          {gifts.map((g, i) => (
            <RevealItem key={g.id} as="li" id={i === 0 ? "gift-sets" : undefined} className="flex gap-4 border-t border-ivory/10 pt-8 min-[400px]:gap-6">
                <div className="relative aspect-[4/5] w-[5.5rem] shrink-0 self-start overflow-hidden bg-cocoa min-[400px]:w-28 sm:w-36 sm:self-auto">
                  <Image src={g.image.src} alt={g.image.alt} fill sizes="9rem" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="display text-[1.6rem] leading-[1.05] min-[400px]:text-[1.9rem] sm:leading-[1.02]">{g.name}</h3>
                    <p className="text-sm tabular-nums text-beige">
                      {formatINR(g.price)} <span className="text-xs text-beige/50">demo</span>
                    </p>
                  </div>
                  <p className="text-sm text-gold">
                    {g.subtitle} · {g.weight}
                  </p>
                  <p className="mt-2 text-sm text-beige/75">{g.description}</p>
                  <div className="mt-auto max-w-[14rem] pt-5">
                    <AddToCartButton productId={g.id} productName={g.name} />
                  </div>
                </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
