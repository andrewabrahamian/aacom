import { useMemo } from "react";

type Project = {
  id?: string;
  title: string;
  subtitle: string;
  url: string;
  repo?: string;
  tags?: string[];
  date?: string;
  featured?: boolean;
  kind?: string;
  stage?: string;
  language?: string;
};

type ProfileLink = {
  label: string;
  url: string;
};

type Profile = {
  name?: string;
  headline?: string;
  avatar?: string;
  summary?: string;
  links?: ProfileLink[];
  pillars?: string[];
};

type Props = {
  projects: Project[];
  profile?: Profile;
};

const defaultProfile: Required<Pick<Profile, "name" | "headline" | "summary">> = {
  name: "Andrew Abrahamian",
  headline: "AI infrastructure research, strategy, and applied ML",
  summary:
    "I work on AI infrastructure research and competitive strategy, with personal projects spanning NLP, ML systems, decision tools, and durable research workflows."
};

function hasAnyTag(project: Project, tags: string[]): boolean {
  return tags.some((tag) => project.tags?.includes(tag));
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;
    return bTime - aTime;
  });
}

export function ProjectExplorer({ projects, profile }: Props) {
  const mergedProfile = { ...defaultProfile, ...profile };
  const sortedProjects = useMemo(() => sortProjects(projects), [projects]);

  const projectGroups = useMemo(
    () =>
      [
        {
          title: "Infrastructure and research systems",
          projects: sortedProjects.filter((project) =>
            hasAnyTag(project, ["ai-infrastructure", "knowledge-systems", "research-systems", "competitive-intelligence", "automation", "codex"])
          )
        },
        {
          title: "Machine learning and NLP",
          projects: sortedProjects.filter((project) =>
            hasAnyTag(project, ["llm", "nlp", "machine-learning", "deep-learning", "computer-vision", "embeddings"])
          )
        },
        {
          title: "Products and utilities",
          projects: sortedProjects.filter((project) => hasAnyTag(project, ["product", "fintech", "algorithms", "prototype", "mlops"]))
        }
      ].filter((group) => group.projects.length > 0),
    [sortedProjects]
  );

  return (
    <div className="site-demo-app ledger-app" role="region" aria-label="Andrew Abrahamian portfolio">
      <article className="demo-surface ledger-surface">
        <header className="ledger-header">
          <div>
            <h1>{mergedProfile.name}</h1>
            <p>{mergedProfile.headline}</p>
          </div>
          {mergedProfile.avatar ? <img src={mergedProfile.avatar} alt="" /> : null}
        </header>

        <section className="ledger-copy" aria-label="Profile summary">
          <ul>
            <li>{mergedProfile.summary}</li>
            {(mergedProfile.pillars ?? []).map((pillar) => (
              <li key={pillar}>{pillar}</li>
            ))}
          </ul>
        </section>

        <section className="ledger-projects" aria-labelledby="ledger-projects-heading">
          <h2 id="ledger-projects-heading">Projects</h2>
          {projectGroups.map((group) => (
            <div className="ledger-group" key={group.title}>
              <h3>{group.title}</h3>
              <ol>
                {group.projects.map((project) => (
                  <li key={project.id ?? project.title}>
                    <a href={project.url}>{project.title}</a>
                    <span>{project.subtitle}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>

        <ProfileLinks links={mergedProfile.links} />
      </article>
    </div>
  );
}

function ProfileLinks({ links }: { links?: ProfileLink[] }) {
  if (!links?.length) return null;

  return (
    <nav className="profile-links" aria-label="Profile links">
      {links.map((link) => (
        <a key={link.url} href={link.url}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
