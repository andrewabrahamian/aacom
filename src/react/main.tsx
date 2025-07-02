import { createRoot } from "react-dom/client";
import { ProjectExplorer } from "./components/ProjectExplorer";
import "./styles/project-explorer.css";

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

const rootElement = document.getElementById("project-explorer-root");
const payloadElement = document.getElementById("project-data");

if (rootElement && payloadElement?.textContent) {
  try {
    const projects = JSON.parse(payloadElement.textContent) as Project[];
    document.documentElement.classList.add("js-enhanced");

    const staticTarget = rootElement.dataset.staticTarget;
    if (staticTarget) {
      document.getElementById(staticTarget)?.setAttribute("hidden", "true");
    }

    const root = createRoot(rootElement);
    root.render(<ProjectExplorer projects={projects} />);
  } catch (error) {
    console.error("Failed to initialize project explorer", error);
  }
}
