import type { ResumeTemplate } from "./templateTypes";

export const mindmapTemplate: ResumeTemplate = {
  id: "mindmap",
  name: "Mapa Conceptual",
  description: "Un diseño vanguardista estilo mapa conceptual, conectando tu trayectoria mediante nodos.",
  className: "template-mindmap",
  defaultTheme: {
    fontFamily: '"Geist", "Segoe UI", sans-serif',
    headingFontFamily: '"Geist", "Segoe UI", sans-serif',
    baseFontSize: 10,
    mainHeadingSize: 22,
    sectionHeadingSize: 12,
    accentColor: "#2C3E50",
    textColor: "#334155",
    pageColor: "#ffffff",
    sidebarPosition: "left",
    showProfilePicture: true,
    pictureFrameStyle: "circle",
    pictureFrameWidth: 3,
    pictureSize: 32,
    pageSize: "A4",
    showSummarySeparator: false,
  },
  defaultSectionOrder: [
    "summary",
    "experience",
    "education",
    "skills",
    "languages",
    "courses",
    "portfolio"
  ],
};
