import { delay } from "@/lib/utils";
import Link from "next/link";
import type { Profile, Stat } from "@/types/content";
import { Counter } from "@/components/ui/Counter";
import { ArrowIcon } from "@/components/ui/Icons";

export function Intro({ profile, stats }: { profile: Profile; stats: Stat[] }) {
  return (
    <section className="container-x py-24 sm:py-36" aria-labelledby="intro-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <p className="eyebrow text-stone lg:col-span-3" data-reveal="fade">
          <span className="text-ink">01 / </span>Présentation
        </p>
        <div className="lg:col-span-9">
          <h2 id="intro-title" className="text-[clamp(1.75rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.035em]" data-reveal>
            {profile.short_bio ?? profile.headline}
          </h2>
          <Link href="/a-propos" className="group mt-10 inline-flex items-center gap-3 text-lg font-medium" data-reveal>
            <span className="link-underline">En savoir plus sur mon parcours</span>
            <ArrowIcon className="size-5 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Statistiques — valeurs modifiables dans Admin > Paramètres */}
      {stats.length > 0 && (
      <dl className="mt-20 grid grid-cols-2 border-t border-ink sm:mt-28 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col-reverse border-b border-line py-8 pr-4 even:pl-4 lg:border-b-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0"
            data-reveal
            style={delay(i * 90)}
          >
            <dt className="eyebrow mt-3 text-stone">{stat.label}</dt>
            <dd className="text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-none tracking-[-0.06em]">
              <Counter value={stat.value} suffix={stat.suffix} />
            </dd>
          </div>
        ))}
      </dl>
      )}
    </section>
  );
}
