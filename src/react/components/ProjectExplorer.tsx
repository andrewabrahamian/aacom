import { useMemo, useState } from "react";

type Project = {
  id?: string;
  title: string;
  subtitle: string;
  url: string;
  image?: string;
  tags?: string[];
  date?: string;
  featured?: boolean;
};

type SortKey = "featured" | "newest" | "alphabetical";

type Props = {
  projects: Project[];
};

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

export function ProjectExplorer({ projects }: Props) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("featured");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => {
      (project.tags ?? []).forEach((tag) => tags.add(tag));
    });
    return ["all", ...Array.from(tags).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const queryValue = normalize(query);

    const filtered = projects.filter((project) => {
      const matchesTag = selectedTag === "all" || (project.tags ?? []).includes(selectedTag);
      const searchable = [project.title, project.subtitle, ...(project.tags ?? [])]
        .join(" ")
        .toLowerCase();
      const matchesQuery = queryValue.length === 0 || searchable.includes(queryValue);
      return matchesTag && matchesQuery;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "newest") {
        const aTime = a.date ? new Date(a.date).getTime() : 0;
        const bTime = b.date ? new Date(b.date).getTime() : 0;
        return bTime - aTime;
      }

      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return a.title.localeCompare(b.title);
    });
  }, [projects, query, selectedTag, sortBy]);

  return (
    <div className="project-explorer-app" role="region" aria-label="Interactive project explorer">
      <div className="project-controls">
        <label className="project-control">
          <span>Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find by topic, project, or skill"
            aria-label="Search projects"
          />
        </label>

        <label className="project-control">
          <span>Tag</span>
          <select
            value={selectedTag}
            onChange={(event) => setSelectedTag(event.target.value)}
            aria-label="Filter projects by tag"
          >
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag === "all" ? "All tags" : tag}
              </option>
            ))}
          </select>
        </label>

        <label className="project-control">
          <span>Sort</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortKey)} aria-label="Sort projects">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </label>

        <button
          type="button"
          className="button small"
          onClick={() => {
            setQuery("");
            setSelectedTag("all");
            setSortBy("featured");
          }}
        >
          Clear
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="project-empty">No projects match your filters.</p>
      ) : (
        <div className="project-grid">
          {filteredProjects.map((project) => (
            <article key={project.id ?? project.title} className="project-card">
              {project.image ? (
                <a href={project.url} className="project-card-image-link" aria-label={`Open ${project.title}`}>
                  <img src={`/img/${project.image}`} alt={project.title} className="project-card-image" />
                </a>
              ) : null}

              <div className="project-card-body">
                <h3>
                  <a href={project.url}>{project.title}</a>
                </h3>
                <p>{project.subtitle}</p>
                {project.tags && project.tags.length > 0 ? (
                  <ul className="project-tag-list" aria-label="Project tags">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
