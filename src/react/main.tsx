import { createRoot } from "react-dom/client";
import { ProjectExplorer } from "./components/ProjectExplorer";
import "./styles/project-explorer.css";

type Project = {
  id?: string;
  title: string;
  subtitle: string;
  url: string;
  repo?: string;
  image?: string;
  tags?: string[];
  date?: string;
  featured?: boolean;
  kind?: string;
  stage?: string;
  language?: string;
};

type Profile = {
  name?: string;
  handle?: string;
  headline?: string;
  location?: string;
  avatar?: string;
  summary?: string;
  stats?: Array<{ label: string; value: string }>;
  links?: Array<{ label: string; url: string }>;
  pillars?: string[];
};

const rootElement = document.getElementById("project-explorer-root");
const payloadElement = document.getElementById("project-data");
const profileElement = document.getElementById("profile-data");

function parsePayload<T>(text: string): T {
  const parsed = JSON.parse(text);
  return typeof parsed === "string" ? (JSON.parse(parsed) as T) : (parsed as T);
}

if (rootElement && payloadElement?.textContent) {
  try {
    const projects = parsePayload<Project[]>(payloadElement.textContent);
    const profile = profileElement?.textContent ? parsePayload<Profile>(profileElement.textContent) : undefined;
    document.documentElement.classList.add("js-enhanced");

    const staticTarget = rootElement.dataset.staticTarget;
    if (staticTarget) {
      document.getElementById(staticTarget)?.setAttribute("hidden", "true");
    }

    const root = createRoot(rootElement);
    root.render(<ProjectExplorer projects={projects} profile={profile} />);
  } catch (error) {
    console.error("Failed to initialize project explorer", error);
  }
}
