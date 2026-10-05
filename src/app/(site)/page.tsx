import { CallToAction, HomeArticles, HomeExperience, HomeProjects, HomeSkills } from "@/components/sections/HomeSections";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { SkillsMarquee } from "@/components/sections/SkillsMarquee";
import { JsonLd } from "@/components/ui/JsonLd";
import { getArticles, getExperiences, getProfile, getProjects, getSettings, getSkillCategories, getSkills } from "@/lib/data/public";
import { groupSkillsByDomain } from "@/lib/skills";
import { personJsonLd, websiteJsonLd } from "@/lib/seo";

export const revalidate = 60;

export default async function HomePage() {
  const [profile, settings, experiences, projects, skills, skillCategories, articles] = await Promise.all([
    getProfile(),
    getSettings(),
    getExperiences(),
    getProjects({ featured: true, limit: 4 }),
    getSkills(),
    getSkillCategories(),
    getArticles({ pageSize: 4 }),
  ]);

  const featuredSkills = skills.filter((s) => s.is_featured);
  const skillDomains = groupSkillsByDomain(skillCategories, featuredSkills.length > 0 ? featuredSkills : skills);
  const marqueeItems = skillDomains.map((d) => d.category.name);

  return (
    <>
      <JsonLd data={[personJsonLd(profile), websiteJsonLd()]} />
      <Hero profile={profile} settings={settings} />
      <SkillsMarquee items={marqueeItems} />
      <Intro profile={profile} stats={settings.stats} />
      <HomeExperience experiences={experiences} />
      <HomeProjects projects={projects} />
      <HomeSkills domains={skillDomains} />
      <HomeArticles articles={articles.items} />
      <CallToAction settings={settings} profile={profile} />
    </>
  );
}
