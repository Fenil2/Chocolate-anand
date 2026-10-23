import { site } from "@/lib/site";
import { bars } from "@/components/products/products";
import { Logo } from "@/components/ui/Logo";
import { Newsletter } from "./Newsletter";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-obsidian">
      <div className="mx-auto grid max-w-[90rem] grid-cols-2 gap-x-8 gap-y-14 px-4 pb-10 pt-20 sm:px-8 md:grid-cols-12">
        <div className="col-span-2 md:col-span-4">
          <div className="w-36">
            <Logo />
          </div>
          <p className="mt-4 text-sm text-beige/75">{site.tagline}</p>
        </div>

        <nav aria-label="Shop" className="md:col-span-2">
          <p className="mb-4 text-sm text-gold">Shop</p>
          <ul className="space-y-2.5 text-sm text-ivory/80">
            {bars.map((b) => (
              <li key={b.id}>
                <a href="#shop" className="hover:text-gold">
                  {b.name}
                </a>
              </li>
            ))}
            <li>
              <a href="#gifting" className="hover:text-gold">
                Gifting
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="About" className="md:col-span-2">
          <p className="mb-4 text-sm text-gold">MORA</p>
          <ul className="space-y-2.5 text-sm text-ivory/80">
            <li>
              <a href="#story" className="hover:text-gold">
                Our story
              </a>
            </li>
            <li>
              <a href="#flavour" className="hover:text-gold">
                Find your flavour
              </a>
            </li>
            <li>
              {/* PLACEHOLDER contact address — set site.contactEmail */}
              <a href={`mailto:${site.contactEmail}`} className="hover:text-gold">
                Contact us
              </a>
            </li>
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-4">
          <Newsletter />
        </div>
      </div>

      <div className="mx-auto flex max-w-[90rem] flex-col gap-3 border-t border-ivory/10 px-4 py-6 text-xs text-beige/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {year} MORA. All rights reserved.</p>
        {/* PLACEHOLDER: link to real policy pages once written. Social links omitted until real profiles exist. */}
        <ul className="flex gap-6">
          <li>
            <a href={`mailto:${site.contactEmail}?subject=Privacy%20policy`} className="hover:text-gold">
              Privacy policy
            </a>
          </li>
          <li>
            <a href={`mailto:${site.contactEmail}?subject=Terms`} className="hover:text-gold">
              Terms
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
