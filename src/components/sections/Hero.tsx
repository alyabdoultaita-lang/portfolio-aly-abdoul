import { delay } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { Profile, SiteSettings } from "@/types/content";
import { ButtonLink } from "@/components/ui/Button";
import { DownloadIcon } from "@/components/ui/Icons";
import { SmartImage } from "@/components/ui/SmartImage";

/**
 * Hero : nom en très grand, révélé ligne par ligne, portrait monochrome,
 * accroche en serif italique et trois appels à l'action.
 */
export function Hero({ profile, settings }: { profile: Profile; settings: SiteSettings }) {
  const [first, ...rest] = profile.full_name.split(" ");
  const last = rest.pop() ?? "";
  const middle = rest.join(" ");

  return (
    <section className="relative overflow-hidden bg-paper pt-28 sm:pt-32" aria-labelledby="hero-title">
      <div className="container-x">
        {/* Barre de méta-données */}
        <div className="eyebrow fade-up flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-ink pb-4 text-stone">
          <span className="text-ink">{settings.hero.kicker}</span>
          <span className="hidden sm:inline">{profile.location}</span>
          <span>{siteConfig.coordinates}</span>
          {profile.available_for_work && (
            <span className="flex items-center gap-2 text-ink">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-ink opacity-50 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-ink" />
              </span>
              Disponible
            </span>
          )}
        </div>

        <div className="grid gap-8 pt-8 lg:grid-cols-12 lg:gap-10 lg:pt-12">
          {/* Nom */}
          <div className="lg:col-span-8">
            <h1 id="hero-title" className="display-xl uppercase">
              <span className="line-mask">
                <span style={delay(100)}>{first}</span>
              </span>
              {middle && (
                <span className="line-mask">
                  <span style={delay(220)}>
                    {middle}
                    <span className="font-serif font-normal normal-case italic tracking-normal">,</span>
                  </span>
                </span>
              )}
              <span className="line-mask">
                <span style={delay(340)} className="text-outline">
                  {last}
                </span>
              </span>
            </h1>

            <div className="mt-8 grid gap-8 sm:mt-12 sm:grid-cols-2">
              <p className="fade-up text-lg font-medium leading-snug tracking-tight sm:text-xl" style={delay(600)}>
                <span className="eyebrow mb-3 block text-stone">Poste</span>
                {profile.headline}
              </p>
              {profile.tagline && (
                <p className="fade-up font-serif text-2xl italic leading-tight sm:text-[1.75rem]" style={delay(700)}>
                  « {profile.tagline} »
                </p>
              )}
            </div>

            <div className="fade-up mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={delay(820)}>
              <ButtonLink href="/portfolio" arrow>
                Voir mon portfolio
              </ButtonLink>
              <ButtonLink href={profile.cv_url ?? "/cv"} variant="outline">
                <span className="flex items-center gap-3">
                  Télécharger mon CV <DownloadIcon className="size-4" />
                </span>
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost" arrow>
                Me contacter
              </ButtonLink>
            </div>
          </div>

          {/* Portrait */}
          <figure className="relative lg:col-span-4">
            <div className="unveil group relative aspect-[4/5] overflow-hidden bg-mist" style={delay(250)}>
              {profile.photo_url && (
                <SmartImage
                  src={profile.photo_url}
                  alt={`Portrait de ${profile.full_name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="img-tone object-cover"
                />
              )}
              <span className="eyebrow absolute left-3 top-3 bg-paper px-2 py-1 text-ink">Portrait</span>
            </div>
            <figcaption className="eyebrow mt-3 flex justify-between text-stone">
              <span>{profile.full_name}</span>
              <span>Fig. 01</span>
            </figcaption>
          </figure>
        </div>

        {/* Déclaration */}
        <p className="fade-up mt-16 max-w-3xl border-t border-line pt-6 text-xl leading-snug tracking-tight text-stone sm:mt-24 sm:text-2xl" style={delay(950)}>
          {settings.hero.statement}
        </p>
      </div>
    </section>
  );
}
